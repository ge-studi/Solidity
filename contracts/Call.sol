//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;
contract Receiver{
    event Received(address caller, uint256 amount,string message);
    fallback()external payable{
        emit Received(msg.sender,msg.value,"FallBack was called");
}

function foo(string memory _message,uint256 _x)public payable returns(uint256){
    emit Received(msg.sender,msg.value,_message);
    return _x+1;
}
}

contract Caller1{
    event Response(bool success,bytes data);

    function testCallFoo(address payable _addr)public payable{
        (bool success,bytes memory data)= _addr.call{
            value: msg.value,
            gas: 5000
        }(abi.encodeWithSignature("foo(string,uint256)","call foo",123));

        emit Response(success,data);
    }

    function test(address payable _addr)public payable{
        (bool success,bytes memory data) = _addr.call{value:msg.value}(
            abi.encodeWithSignature("doesNotExist()"));
    }
}
