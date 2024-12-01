//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;

contract BitwiseOperations{
    function and(uint256 x,uint256 y)external pure returns(uint256){
      return x & y;

    }
    function or(uint256 x,uint256 y)external pure returns(uint256){
      return x | y;

    }
    function xor(uint256 x,uint256 y)external pure returns(uint256){
     return x ^ y;

    }

    function not(uint8 x)external pure returns(uint8){
      return ~x;
    }

    function shiftLeft(uint256 x,uint256 bits)external pure returns(uint256){
      return x << bits;

    }

    function shiftRight(uint256 x,uint256 bits)external pure returns(uint256){
            return x>> bits;

    }

    function getLastNBits(uint256 x,uint256 n)external pure returns(uint256){

      uint256 mask = (1<<n)-1;
      return x & mask;
    }

    function getLastNBitsUsingMod(uint256 x,uint256 n)external pure returns(uint256){
       return x% (1 << n);

    }

     function mostSignificantBit(uint256 x)external pure returns(uint256){
         uint256 i=0;
         while((x>>=1)>0){
            ++i;
         }
         
            return i;
    }

     function getFirstNBits(uint256 x,uint256 n,uint256 len)external pure returns(uint256){
        uint256 mask =((1<<n)-1)<<(len-1);
        return x & mask;
    }
}