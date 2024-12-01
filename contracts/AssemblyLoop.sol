//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;
contract AssemblyLoop{
    function yul_forLoop() public pure returns(uint256 z){
        assembly{
            for{let i :=0}lt(i,10){ i:= add(i,1)}{z :=add(z,1)}
        }
    }

    function yul_whileLoop() public pure returns(uint256 z){
        assembly{
            let i:= 0
            for{} lt(i,5){}{
                i :=add(i,1)
                z:= add(z,1)
            }
        }
    }
}