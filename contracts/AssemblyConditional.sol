//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;

contract AssemblyConditional{
    function yul_if(uint256 x)public pure returns(uint256 z){
        assembly{
            if lt(x,10){z:= 99}
        }
    }

    function yul_switch(uint256 x)public pure returns(uint256 z){
        assembly{
            switch x
            case 1 {z :=10}
            case 2 {z := 20}
            default{z :=0}
        }

    }
}