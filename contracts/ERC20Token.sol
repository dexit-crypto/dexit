// contracts/ERC20Token.sol
// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.6.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Token is ERC20 {
    constructor(string memory name, string memory symbol, uint256 initialSupply, address owner) public ERC20(name, symbol) {
        _mint(owner, initialSupply);
    }
}

