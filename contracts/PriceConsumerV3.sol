pragma solidity ^0.6.6;

import "@chainlink/contracts/v0.6/interfaces/AggregatorV3Interface.sol";

contract PriceConsumerV3 {

    AggregatorV3Interface internal priceFeed;


    constructor(AggregatorV3Interface addressAggregator) public {
        priceFeed = AggregatorV3Interface(addressAggregator);
    }

    /**
     * Returns the latest price
     */
    function getLatestPrice() public view returns (int) {
        (
            uint80 roundID,
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();
        return price;
    }
}
