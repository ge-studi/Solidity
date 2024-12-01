//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;

contract MinimalProxy{
    event ProxyCreated(address proxy);
    function clone(address target)external returns(address result){
        bytes20 targetBytes = bytes20(target); //convert address to 20 bytes

        assembly{
            //reads 32 bytes of memory at ponter stored in 0x40
            let clone:= mload(0x40)
            mstore(
                clone,
                0x3d602d80600a3d3981f3363d3d373d3d3d363d73000000000000000000000000
            )
            //32 bytes at clone  + 20 bytes
            mstore(add(clone,0x14),targetBytes)
          //32 bytes + 40 bytes
            mstore(
                add(clone,0x28),
                 0x5af43d82803e903d91602b57fd5bf30000000000000000000000000000000000
            )

            result :=create(0,clone,0x37)
        }
      emit ProxyCreated(result);
   
    }
}

contract TargetContract{
    uint256 public value;

    function setValue(uint256  _value) public{
        value = _value;
    }
}