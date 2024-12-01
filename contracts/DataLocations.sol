//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;
contract DataLocations{
    uint256[] public arr;
    mapping(uint256 =>address)map;

    struct Mystruct{
        uint256 foo;
    }

    mapping(uint256 => Mystruct)mystruct;

    function input()public{
        _input(arr,map,mystruct[1]);

        Mystruct storage mystructs = mystruct[1];
        Mystruct memory mymemstruct = Mystruct(0);    
        }

    function _input(uint256[] storage _arr,
        mapping(uint256 => address)storage _map,
        Mystruct storage _mystruct)internal{

        }
        function get(uint256[] memory _arr) public pure returns (uint256[] memory) {
            return _arr;
}

        function do_something(uint256[] calldata _arr)external{

        }
    }
