//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;
library Math{
    function sqrt(uint256 y)internal pure returns(uint256 z){
        if(y>3){
            z=y;

            uint256 x=y/2+1;
            while(x<z){
                z=x;
                x=(y/x+z)/2;

            }
        }
            else if(y!=0){
                z=1;
            }
        }
}

contract Testing{
    function testSquareRoot(uint256 x)public pure returns(uint256){
        return Math.sqrt(x);
    }

}