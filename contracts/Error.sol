//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;

contract Error{
    function test(uint256 value)public pure {
        require(value > 10,"Input must be greater than 10");}

    function test1(uint256 value)public pure{
        if(value<=10)
        revert("Input must be greater than 10");
    }

    uint256 public num;
    function testing() public view{
        assert(num==0); //num always equal to 0.
    }

    error bal(uint256 balance,uint256 withdraw);

    function testCustomError(uint256 _withdraw)public view {
        uint256 b = address(this).balance;
        if(b<_withdraw){
            revert bal({balance: b, withdraw: _withdraw
            });
        }
    }
}