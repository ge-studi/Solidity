//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;
contract Ethers_1{
    uint256 public Costwei = 1 wei;
    bool public is0neWei = (Costwei == 1);

    bool public isOneWei = (Costwei == 1e9);

    uint256 public CostEther = 1 ether;
    bool public isOneEther= (CostEther == 1e18);
}