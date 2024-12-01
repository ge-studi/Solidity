//SPDX-License-identifier:MIT
pragma solidity ^0.8.19;

contract One{
    string public name;
    constructor(string memory _name){
        name = _name;
    }

}

contract Two{
    string public text;
    constructor(string memory _text){
        text = _text;
    }
}

contract X is One("Input to one"),Two("Input to two"){}

contract Y is One,Two{
    constructor(string memory _name,string memory _text)One(_name)Two(_text){}
}
    contract Z is One,Two{
        constructor() One("One was called") Two("Two was called"){
            
        }
    } 
