//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;

contract View_PureFunctions{
 uint256 public val1 = 90;

 function add(uint256 val2) public view returns(uint256){
    return val1 + val2;
 }

 function output(uint256 a, uint256 b) public pure returns(uint256){
    return a+b;
 }
}