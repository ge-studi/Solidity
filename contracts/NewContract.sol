//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;
contract Car{
    string public model;
    address public owner;
    address public carAddr;
    constructor(string memory _model,address _owner) payable{
        model=_model;
        owner = _owner;
        carAddr = address(this);
    }
}

contract CarFactory{
    Car[] public cars;
    function create(address _owner,string memory _model)public{
        Car car = new Car(_model,_owner);
        cars.push(car);
    }
    function createAndSendEther(address _owner,string memory _model)public payable{
           Car car = (new Car){value:msg.value}(_model,_owner);
           cars.push(car);
    }
}