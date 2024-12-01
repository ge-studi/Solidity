//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;

contract AssemblyVariable{
    function yu_let() public pure returns(uint256 z){
      assembly{
        let x :=123
          z :=456
          
      }
    }
}