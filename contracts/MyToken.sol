//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;
 
 import "../contracts/ERC20.sol";

 contract MyToken is ERC20 {
    constructor(string memory name_, string memory symbol_)  {
        _name = name_;
        _symbol = symbol_;
        _mint(msg.sender, 1000000 * 10**18);
       

}

function mint(address account, uint256 amount)public{
    _mint(account,amount);
}
function burn(address account, uint256 amount) public {
    require(balanceOf(account) >= amount, "Insufficient balance to burn");
    _burn(account, amount);
}


}

 

 
