//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;
contract AssemblyMath{
    function yul_add(uint256 x,uint256 y)public pure returns(uint256 z){
        assembly{
            z := add(x,y)
            if lt(z,x){revert(0,0)}
        }
    }

    function yul_mul(uint256 x,uint256 y)public pure returns(uint256 z){
        assembly{
            switch x 
            case 0{z :=0}
            default{
                z := mul(x,y)
                if iszero(eq(div(z,x),y)){revert(0,0)}
            }
        }
    }

    function yul_fixedPoint(uint256 x,uint256 b)public pure returns(uint256 z){
        assembly{       
                let half:= div(b,2)
                z:= add(x,half)
                z:= mul(div(z,b),b)
            }
        }
    }