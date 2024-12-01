//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;
contract Proxy1{
    event Deploy(address);
    receive() external payable{}
   //event Execute(address target, bytes data);

    

    function deploy(bytes memory _code)external payable returns(address addr){
        assembly{
            addr :=create(callvalue(),add(_code,0x20),mload(_code))
        }

        require(addr!=address(0),"deploy failed");

        emit Deploy(addr);
    }
     
     function execute(address _target,bytes memory _data)external payable{
        
        (bool success,) = _target.call{value:msg.value}(_data);
        require(success,"failed");

        //emit Execute(_target, _data);
     }

}

contract TestContract1{
    address public owner = msg.sender;

    function setOwner(address _owner)public{
        require(msg.sender == owner,"not owner");
        owner = _owner;
    }

    
}

contract TestContract2{
    address public owner = msg.sender;
    uint256 public value = msg.value;
    uint256 public x;
    uint256 public y;

    constructor(uint256 _x,uint256 _y)payable{
        x=_x;
        y=_y;
    }
}

contract Helper{
    function getBytecode1()external pure returns(bytes memory){
        bytes memory bytecode = type(TestContract1).creationCode;
        return bytecode;
    }

    function getBytecode2(uint256 _x,uint256 _y)external pure returns(bytes memory){
      bytes memory bytecode = type(TestContract2).creationCode;
      return abi.encodePacked(bytecode,abi.encode(_x,_y));
    }

   // Example Helper contract method
        function getCallData(address _owner) external pure returns (bytes memory) {
            return abi.encodeWithSignature("transferOwnership(address)", _owner);
        }
}
