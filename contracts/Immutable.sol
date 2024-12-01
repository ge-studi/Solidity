//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;
contract Immutable{
    address public immutable _address;
    uint256 public immutable  Value;

    constructor(uint256 _value){
        _address = msg.sender;
        Value = _value;
    }
}