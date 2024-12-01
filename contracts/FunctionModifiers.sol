//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;
contract FunctionModifiers{
    address public owner;
    uint256 public val;
    bool public locked;
    constructor(){
        owner=msg.sender;

    }

    modifier onlyOwner(){
        require(msg.sender == owner,"Not owner");
        _;
    }
function setVal(uint256 _val) public onlyOwner {
    val = _val;
}

function setAddress(address _addr) public validAddress(_addr) {
    // Some logic
}

function changeValue(uint256 _val) public noChange {
    val = _val;
}
    modifier validAddress(address _addr){
        require(_addr!= address(0),"Not valid address");
        _;
    }
    modifier noChange(){
        require(!locked,"No change");
        locked = true;
        _;
        locked =false;
    }

}