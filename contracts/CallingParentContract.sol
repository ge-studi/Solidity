//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;
contract _A{
    event Log(string message);

    function foo()public virtual{
        emit Log("_A.foo called");
    }

    function bar() public virtual{
        emit Log("_A.bar called");
    
    }

}

contract _B is _A{
    function foo() public virtual override{
        emit Log("_B.foo called");
        _A.foo(); 
    }

    function bar() public virtual override{
        emit Log("_B.bar called");
        super.bar();
    }
}

contract _C is _A{
    function foo() public virtual override{
        emit Log("_C.foo called");
        _A.foo();
    }

    function bar() public virtual override{
        emit Log("_C.bar called");
        super.bar();
    }
}

contract _D is _B,_C{
    function foo() public override(_B,_C){
        super.foo();
    }
    function bar() public override(_B,_C){
        super.bar();
    }
}