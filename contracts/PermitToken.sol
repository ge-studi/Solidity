// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "hardhat/console.sol";
contract PermitToken is EIP712 {
    address public admin;
    mapping(bytes32 => bool) public usedSalts;
     
    // Custom TypeHash for the withdrawal function
    bytes32 public constant PERMIT_WITHDRAW_TYPEHASH = keccak256(
        "PermitWithdraw(address user,uint256 amount,bytes32 salt)"
    );

    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);

    constructor() payable EIP712("validate", "1") {
        admin = msg.sender;
    }

    function withdraw(uint256 amount, bytes32 salt, bytes calldata signature) public {
        require(!usedSalts[salt], "Signature already used");
        //   console.log("salt",salt);
        require(address(this).balance >= amount, "Insufficient balance");

        // Create the struct hash for EIP712
        bytes32 structHash = keccak256(
            abi.encode(PERMIT_WITHDRAW_TYPEHASH, msg.sender, amount, salt));
        bytes32 hash = _hashTypedDataV4(structHash);

        // Recover the signer address
        address signer = ECDSA.recover(hash, signature);
        require(signer == admin, "Invalid signature");

        // Mark the salt as used
        usedSalts[salt] = true;

        // Transfer the amount to the user
        payable(msg.sender).transfer(amount);
        emit Withdraw(msg.sender, amount);
    }

    // Only the admin can deposit ETH
    receive() external payable {
        require(msg.sender == admin, "Only admin can deposit");
        require(msg.value > 0, "Deposit amount must be greater than 0");
        emit Deposit(msg.sender, msg.value);
    }
}
