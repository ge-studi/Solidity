//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;

contract Events{
    event Logging(address indexed sender, string message);

    function enter() public{
        emit Logging(msg.sender,"Hello");
    }
}