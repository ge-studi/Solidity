//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;
contract Foo{
    address public owner;

    constructor(address _owner){
        require(_owner!=address(0),"invalid address");
        assert(_owner!= 0x0000000000000000000000000000000000000001);
        owner = _owner;
    }

    function myFunc(uint256 x)public pure returns(string memory){
        require(x!= 0,"Failed");
        return "Function called";
    }
}

contract Bar{
    event Log(string message);
    event LogBytes(bytes data);

    Foo public foo;

    constructor(){
        foo = new Foo(msg.sender);
    }

    function tryCatchCall(uint256 _i)public{
        try foo.myFunc(_i) returns (string memory result){
            emit Log(result);
        } catch{
            emit Log("Call failed");
        }
    }
}

