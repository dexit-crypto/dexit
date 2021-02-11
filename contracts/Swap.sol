pragma solidity ^0.6.6;


import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./PriceConsumerV3.sol";

contract Swap is Ownable {

    mapping(address => uint256) public poolEth;

    mapping(address => mapping(ERC20 => uint256)) public poolErc20;

    mapping(ERC20 => PriceConsumerV3) public oracleErc20;

    PriceConsumerV3 public oracleEth;
    constructor() public {

    }

    function deposit(ERC20 erc20_, uint256 amount_) public payable {
        require( erc20_.transferFrom(msg.sender, address(this), amount_) );
        poolErc20[msg.sender][erc20_]=poolErc20[msg.sender][erc20_]+=amount_;
    }

    function deposit() public payable {
        require(msg.value>0);
        poolEth[msg.sender]=poolEth[msg.sender]+=msg.value;
    }

    function withdraw(ERC20 erc20_) public payable {
        uint256 amount = poolErc20[msg.sender][erc20_];
        assert (amount>0);
        poolErc20[msg.sender][erc20_]=0;
        erc20_.transferFrom(address(this), msg.sender, amount);
    }

    function withdraw() public payable {
        uint256 amount = poolEth[msg.sender];
        assert (amount>0);
        poolEth[msg.sender]=0;
        msg.sender.transfer(amount);
    }

    function addOracle(PriceConsumerV3 oracle_) public payable onlyOwner{
        oracleEth = oracle_;
    }

    function addOracleForERC20(ERC20 erc20_, PriceConsumerV3 oracle_) public payable onlyOwner{
        oracleErc20 [erc20_] = oracle_;
    }

    function swap(ERC20 input_ , ERC20 output_, uint256 amountInput_) public payable {
        require(oracleErc20[input_]!=PriceConsumerV3(0));
        require(oracleErc20[output_]!=PriceConsumerV3(0));
        uint256 inputPrice = uint256(PriceConsumerV3(oracleErc20[input_]).getLatestPrice());
        uint256 outputPrice = uint256(PriceConsumerV3(oracleErc20[output_]).getLatestPrice());
        uint256 amountOutPut = amountInput_*(outputPrice / inputPrice);
        assert (output_.balanceOf(address(this))>uint256(amountOutPut));
        input_.transferFrom(msg.sender, address(this), amountInput_);
        output_.transfer(msg.sender, amountOutPut);
    }


    function swap(ERC20 input_, uint256 amountInput_) public payable {
        require(oracleErc20[input_]!=PriceConsumerV3(0));
        require(oracleEth!=PriceConsumerV3(0));
        uint256 ethPrice = uint256(PriceConsumerV3(oracleEth).getLatestPrice());
        uint256 tokenPrice = uint256(PriceConsumerV3(oracleErc20[input_]).getLatestPrice());
        uint256 amountOutPut = msg.value * (ethPrice/tokenPrice);
        assert (address(this).balance>uint256(amountOutPut));
        input_.transferFrom(msg.sender, address(this), amountInput_);
        msg.sender.transfer(amountOutPut);
    }

    function swap(ERC20 output_) public payable {
        require(oracleErc20[output_]!=PriceConsumerV3(0));
        require(oracleEth!=PriceConsumerV3(0));
        require(msg.value>0);
        uint256 ethPrice = uint256(PriceConsumerV3(oracleEth).getLatestPrice());
        uint256 tokenPrice = uint256(PriceConsumerV3(oracleErc20[output_]).getLatestPrice());
        uint256 amountOutPut = msg.value * (tokenPrice/ethPrice);
        assert(amountOutPut>0);
        assert (output_.balanceOf(address(this))>uint256(amountOutPut));
        output_.transfer(msg.sender, amountOutPut);
    }

    function getLatestPrice(ERC20 erc20) public view returns (int) {
        return oracleErc20[erc20].getLatestPrice();
    }
}
