//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;
contract AA{
    string public name ="First";

    function getName() public view returns(string memory){
        return name;
    }

}


contract B2 is AA
{
    constructor(){
        name = "Second";
   
    }
}