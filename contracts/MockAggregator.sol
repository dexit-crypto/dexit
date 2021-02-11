// SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/v0.6/interfaces/AggregatorV3Interface.sol";

/**
 * @title A trusted proxy for updating where current answers are read from
 * @notice This contract provides a consistent address for the
 * CurrentAnwerInterface but delegates where it reads from to the owner, who is
 * trusted to update it.
 */
contract MockAggregator is AggregatorV3Interface, Ownable {


  uint80 roundId;
  int256 answer;
  uint256 startedAt;
  uint256 updatedAt;
  uint80 answeredInRound;

  constructor(
      uint80 roundId_,
      int256 answer_,
      uint256 startedAt_,
      uint256 updatedAt_,
      uint80 answeredInRound_) public Ownable() {
    setRoundData(roundId_,answer_, startedAt_, updatedAt_, answeredInRound_);
  }



  function latestRoundData()
    public
    view
    virtual
    override
    returns (
      uint80 roundId_,
      int256 answer_,
      uint256 startedAt_,
      uint256 updatedAt_,
      uint80 answeredInRound_
    )
  {
    return (
      roundId,
      answer,
      startedAt,
      updatedAt,
      answeredInRound
    );
  }


  function setRoundData(
      uint80 roundId_,
      int256 answer_,
      uint256 startedAt_,
      uint256 updatedAt_,
      uint80 answeredInRound_
  )
    public
    payable
    onlyOwner
  {
    roundId = roundId_;
    answer = answer_;
    startedAt_ = startedAt;
    updatedAt_ = updatedAt;
    answeredInRound_ = answeredInRound;
  }

  function getRoundData(uint80 _roundId)
    public
    view
    virtual
    override
    returns (
      uint80 roundId_,
      int256 answer_,
      uint256 startedAt_,
      uint256 updatedAt_,
      uint80 answeredInRound_
    )
  {
    return latestRoundData();
  }


  function decimals()
      public
      override
      view
      returns (uint8)
  {
      return 0;
  }

  function description()
      public
      override
      view
      returns (string memory)
  {
      return "mock";
  }

  function version()
      public
      override
      view
      returns (uint256)
  {
      return 0;
  }


}
