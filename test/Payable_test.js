const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Payable Contract", function () {
  let Payable, payable, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    Payable = await ethers.getContractFactory("Payable");
    payable = await Payable.deploy({ value: ethers.parseEther("10") });
    await payable.waitForDeployment();
  });

  it("Should deploy and set the owner", async function () {
    expect(await payable.owner()).to.equal(await owner.getAddress());
  });

  it("Should allow the owner to withdraw the full contract balance", async function () {
    // Record initial balance as BigInt
    const initialOwnerBalance = BigInt(await ethers.provider.getBalance(owner.address));

    // Withdraw funds
    const tx = await payable.withdraw();
    const receipt = await tx.wait();

    // Use tx.gasPrice if effectiveGasPrice is not available
    const gasPrice = receipt.effectiveGasPrice ? BigInt(receipt.effectiveGasPrice) : BigInt(tx.gasPrice);
    const gasCost = BigInt(receipt.gasUsed) * gasPrice;

    // Validate balances after withdrawal
    const finalOwnerBalance = BigInt(await ethers.provider.getBalance(owner.address));
    const contractBalance = BigInt(await ethers.provider.getBalance(payable.target));

    expect(finalOwnerBalance).to.equal(
        initialOwnerBalance + BigInt(ethers.parseEther("10")) - gasCost
    );
    expect(contractBalance).to.equal(0n);
});



  it("Should allow the owner to transfer ether to another address", async function () {
    const transferAmount = ethers.parseEther("5");

    // Transfer ether to addr1
    const initialAddr1Balance = await ethers.provider.getBalance(addr1.address);
    const tx = await payable.transfer(addr1.address, transferAmount);
    await tx.wait();

    const addr1Balance = await ethers.provider.getBalance(addr1.address);
    const contractBalance = await ethers.provider.getBalance(payable.target);

    expect(BigInt(addr1Balance)).to.equal(BigInt(initialAddr1Balance) + BigInt(transferAmount));
    expect(contractBalance).to.equal(BigInt(ethers.parseEther("5")));
  });

  it("Should revert if non-owner tries to withdraw", async function () {
    await expect(payable.connect(addr1).withdraw()).to.be.revertedWith(
        "Only the owner can withdraw"
    );
});


  it("Should revert if transfer fails", async function () {
    const contractBalance = await ethers.provider.getBalance(payable.target);

    // Attempt to transfer more than the contract's balance
    const transferAmount = BigInt(contractBalance) + BigInt(ethers.parseEther("1"));

    await expect(
      payable.transfer(addr1.address, transferAmount)
    ).to.be.revertedWith("Failed to send ether");
  });
});
