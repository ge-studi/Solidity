//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;
contract A{
    function returnString() public pure virtual returns(string memory){
        return "One";
    }
}
    contract B is A{
        function returnString() public pure virtual override returns(string memory){
            return "Two";
        }
    }


contract C is A{
    function returnString() public pure virtual override returns(string memory){
        return "Three";
    }

}
 contract D is B,C{
    function returnString() public pure override(B,C)returns(string memory){
        return super.returnString();
   
    }
 }


