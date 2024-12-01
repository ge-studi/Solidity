//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;

contract GasOptimization{
    uint256 public total;
    //To optimize gas replace memory with calldata 
    function sum(uint256[] calldata nums)external{
        uint256 _total =total;
        uint256 len = nums.length;

        for(uint256 i=0;i<len;){
            uint256 num = nums[i];
            if(num % 2 == 0 && num < 99){
                total += num;
            }
            unchecked{
                ++i;
            }
        }
        total = _total;

    }
}