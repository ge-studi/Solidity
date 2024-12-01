//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;
contract Gas{
    uint256 i =0;
    function input() public{
        while(true){
            i+=1;
        }
    }
}