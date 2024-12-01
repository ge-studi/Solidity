// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "hardhat/console.sol";

contract B1 {
    uint256 public num;
    address public sender;
    uint256 public value;

    function SetVars(uint256 _num) public payable {
        num = _num;
        console.log("I am in contract B1", num);
        sender = msg.sender;
        value = msg.value;
    }
}

contract A1 {
    uint256 public num;
    address public sender;
    uint256 public value;

    function setVars(address _contract, uint256 _num) public payable {
        (bool success, ) = _contract.delegatecall(
            abi.encodeWithSignature("SetVars(uint256)", _num)
        );
        require(success, "Delegatecall failed");
    }
}
