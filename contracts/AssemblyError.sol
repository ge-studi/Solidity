//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;
contract AssemblyError{
  function yul_revert(uint256 x)public pure{
    assembly {
        if gt(x,10){
        revert(0,0)}
    }
  }
}
