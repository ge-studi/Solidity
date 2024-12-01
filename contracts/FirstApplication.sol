//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;
contract FirstApplication{
    uint256 count;
    function increment() public {
        count++;
    }
    function decrement() public{
        count--;
    }
    function getRes() public view returns(uint256){
        return count;
    }

}