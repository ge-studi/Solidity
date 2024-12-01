//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;
contract ifElse{
    function check(uint256 val)public pure returns(uint256){
        if(val<100){
            return 0;
            }
        else if(val < 200) 
        {
            return 1;
        }
        else {
            return 2;
        }
}

    function get_Ans(uint256 _val)public pure returns(uint256){
        return _val<100?1:2;
    }
}