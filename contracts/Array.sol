//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;
contract Array{
    uint256[] public arr;
    uint256[] public arr1 = [4,5,6];
    uint256[100] public Fixedarr;

    function get(uint256 i)public view returns(uint256){
        return arr[i];
    }

    function getArr() public view returns(uint256[] memory){
        return arr;
    }

    function push(uint256 i)public{
        arr.push(i);
    }

    function pop()public{
        arr.pop();
    }

    function getLength() public view  returns(uint256){
        return arr.length;
    }

    function remove(uint256 index) public{
       delete arr[index]; 
    }

    

}