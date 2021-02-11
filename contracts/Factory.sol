pragma solidity ^0.6.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./MockAggregator.sol";
import "./PriceConsumerV3.sol";
import "./Swap.sol";
import "./ERC20Token.sol";


contract Factory {

    uint constant initialSupply = 10000 * 10**18;
    Swap public swapContract;
    ERC20Token public aaveContract;
    ERC20Token public batContract;
    ERC20Token public gnoContract;
    ERC20Token public linkContract;
    ERC20Token public uniContract;
    ERC20Token public usdtContract;
    ERC20Token public wethContract;
    ERC20Token public wbtcContract;
    address owner;

    constructor() public {
        owner = msg.sender;
        swapContract = new Swap();
        addOracle(630000000000000);
        aaveContract = new ERC20Token("AAVE", "AAVE", initialSupply, address(swapContract));
        addOracle(ERC20(aaveContract), 3003003000000000);
        batContract = new ERC20Token("Basic Atention Token", "BAT", initialSupply, address(swapContract));
        addOracle(ERC20(batContract), 3207184092370000000);
        gnoContract = new ERC20Token("Gnosis", "GNO", initialSupply, address(swapContract));
        addOracle(ERC20(gnoContract), 7045726760000000);
        linkContract = new ERC20Token("Chainlink", "LINK", initialSupply, address(swapContract));
        addOracle(ERC20(linkContract), 41666666660000000);
        uniContract = new ERC20Token("UniSwap", "UNI", initialSupply, address(swapContract));
        addOracle(ERC20(uniContract), 48685491720000000);
        usdtContract = new ERC20Token("USDT", "USDT", initialSupply, address(swapContract));
        addOracle(ERC20(usdtContract), 1000000000000000000);
        wethContract = new ERC20Token("Wrapped Ether", "WETH", initialSupply, address(swapContract));
        addOracle(ERC20(wethContract), 630000000000000);
        wbtcContract = new ERC20Token("Wrapped Bitcoin", "WBTC", initialSupply, address(swapContract));
        addOracle(ERC20(wbtcContract), 26746540000000);
    }

    function addOracle(ERC20 erc20_, int256 price_) public payable {
        MockAggregator mockAggregator = new MockAggregator(0, price_, 0, 0, 0);
        PriceConsumerV3 consumer = new PriceConsumerV3(mockAggregator);
        swapContract.addOracleForERC20(erc20_, consumer);
    }

    function addOracle(int256 price_) public payable {
        MockAggregator mockAggregator = new MockAggregator(0, price_, 0, 0, 0);
        PriceConsumerV3 consumer = new PriceConsumerV3(mockAggregator);
        swapContract.addOracle(consumer);
    }

    function getSwapContractAddress() public view returns (address){
        return address(swapContract);
    }

    function getAave() public view returns (address){
        return address(aaveContract);
    }

    function getBat() public view returns (address){
        return address(batContract);
    }

    function getGno() public view returns (address){
        return address(gnoContract);
    }

    function getLink() public view returns (address){
        return address(linkContract);
    }

    function getUni() public view returns (address){
        return address(uniContract);
    }

    function getUsdt() public view returns (address){
        return address(usdtContract);
    }

    function getWeth() public view returns (address){
        return address(wethContract);
    }

    function getWbtc() public view returns (address){
        return address(wbtcContract);
    }
}
