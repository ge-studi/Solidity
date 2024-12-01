//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;
contract Mapping{
    mapping(address => uint256)public map;
    function get(address addr) public view returns(uint256){
    return map[addr];}

    function set(address addr,uint256 i)public{
        map[addr] = i;
    }

    function remove(address addr)public{
        delete map[addr];
    }
}


contract NestedMapping{
    mapping(address => mapping(uint256 => bool)) public nested;
    function get(address addr1,uint256 i)public view returns(bool){
        return nested[addr1][i];
    }

    function set(address addr1,uint256 i, bool boo)public{
        nested[addr1][i] = boo;
    }

    function remove(address addr1,uint256 i)public{
        delete nested[addr1][i];
    }
}