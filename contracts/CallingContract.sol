//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;
import "hardhat/console.sol";
contract Calle{
    uint256 public x;
    uint256 public value;

    function set(uint256 _x)public returns(uint256){
       
        x=_x;
        
        return x;
    }

    function SetandSendEther(uint256 _x)public payable returns(uint256,uint256){
        x=_x;
        value=msg.value;
        return (x,value);
    }
}

contract Caller {
    function set(Calle _calle ,uint256 _x)public {
       
        uint256 x = _calle.set(_x);
        
    }
    function setFromAddress(address _addr,uint256 _x)public{
        Calle calle = Calle(_addr);
        calle.set(_x);
    }

    function SetandSendEther(Calle _calle,uint256 _x)public payable{
        (uint256 x,uint256 value)= _calle.SetandSendEther{value:msg.value}(_x);
    }
}