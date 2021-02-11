## `MockAggregator`

This contract provides a consistent address for the
CurrentAnwerInterface but delegates where it reads from to the owner, who is
trusted to update it.




### `constructor(uint80 roundId_, int256 answer_, uint256 startedAt_, uint256 updatedAt_, uint80 answeredInRound_)` (public)





### `latestRoundData() → uint80 roundId_, int256 answer_, uint256 startedAt_, uint256 updatedAt_, uint80 answeredInRound_` (public)





### `setRoundData(uint80 roundId_, int256 answer_, uint256 startedAt_, uint256 updatedAt_, uint80 answeredInRound_)` (public)





### `getRoundData(uint80 _roundId) → uint80 roundId_, int256 answer_, uint256 startedAt_, uint256 updatedAt_, uint80 answeredInRound_` (public)





### `decimals() → uint8` (public)





### `description() → string` (public)





### `version() → uint256` (public)






