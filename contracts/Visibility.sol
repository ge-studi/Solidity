//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;
contract Base{
    function privateFunc() public pure returns(string memory){
        return "Function called is private";
    }

    function test() public pure returns(string memory){
        return privateFunc();
    }

    function internalfunc() internal pure returns(string memory){
        return "Internal function called";
    }

    function testInternal() public pure virtual returns(string memory){
        return testInternal();
    }
     
     function externalfunc() public pure returns(string memory){
        return "External function called";
     }
}
    contract Child is Base{
        function testInternal() public pure override returns(string memory){
            return internalfunc();
        }
    }