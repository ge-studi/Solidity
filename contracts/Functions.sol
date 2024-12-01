//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;
contract Functions{
    function return_multiple() public pure returns(uint256,bool,uint256){
        return(89,true,789);
    }

    function returnNamedValues() public pure returns(uint256 val1,bool val2,uint256 val3){
        return(890,false,567);
    }
    function returnParameterizedValues() public pure returns(uint256 val1,bool val2,uint256 val3){
        val1 = 890;
        val2 = false;
        val3 = 567;
    }

    } 