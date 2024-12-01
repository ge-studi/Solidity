//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;
contract Factory{
    function deploy(address _owner, uint256 _foo, bytes32 _salt)public payable
    returns(address){
        return address(new TestContract{salt: _salt}(_owner,_foo));
    }  
}

contract FactoryAssembly{
    event Deployed(address addr, uint256 salt);

    function getBytecode(address _owner,uint256 _foo)public pure returns(bytes memory){
        bytes memory bytecode = type(TestContract).creationCode;

        return abi.encodePacked(bytecode,abi.encode(_owner,_foo));
    }

    function getAddress(bytes memory bytecode,  uint256 _salt)public view returns(address){
        bytes32 hash = keccak256(abi.encodePacked(
            bytes1(0xff),address(this),_salt,keccak256(bytecode)
        )
        );
    }

    function deploy(bytes memory bytecode, uint256 _salt)public payable{
        address addr;
            assembly{
                addr :=
                create2(
                    callvalue(),
                    add(bytecode, 0x20),
                    mload(bytecode),
                    _salt
                )

                if iszero(extcodesize(addr)){revert(0,0)}
            }
            emit Deployed(addr,_salt);
    }
    }

    contract TestContract{
        address public owner;
        uint256 public foo;

        constructor(address _owner,uint256 _foo)payable{
            owner = _owner;
            foo = _foo;
        }

        function getBalance() public view returns(uint256){
            return address(this).balance;
        }
    }


