//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;
contract UncheckedMath{
    function add(uint256 x,uint256 y)external pure returns(uint256){
        unchecked{
            return x+y;
        }
}

   function sub(uint256 x,uint256 y)external pure returns(uint256){
    unchecked{
        return x-y;
    }
   }

   function sumofCubes(uint256 x,uint256 y)external pure returns(uint256){
    unchecked{
        uint256 x3 = x*x*x;
        uint256 y3 = y*y*y;

        return x3 + y3;
    }
   }
}
