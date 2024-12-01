const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Delegate Call contract", function () {
  let B1, b1;
  let A1, a1;
  let owner;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();

    B1 = await ethers.getContractFactory("B1");
    b1 = await B1.deploy();
    await b1.waitForDeployment();

    A1 = await ethers.getContractFactory("A1");
    a1 = await A1.deploy();
    await a1.waitForDeployment();
  });

  describe("Contract B1", function () {
    it("Should correctly use delegatecall to call SetVars()", async function () {
      // Call setVars on A1, which delegatecalls B1's SetVars function
      const tx = await a1.setVars(b1.target, 42, { value: ethers.parseEther("1") });
      await tx.wait();

      // Debugging: Check values before assertions
      console.log("B1 num:", (await b1.num()).toString());
      console.log("B1 sender:", await b1.sender());
      console.log("B1 value:", (await b1.value()).toString());
      console.log("A1 num:", (await a1.num()).toString());
      console.log("A1 sender:", await a1.sender());
      console.log("A1 value:", (await a1.value()).toString());

      // Check the state variables in B1
      expect(await b1.num()).to.equal(0);
      expect(await b1.sender()).to.equal("0x0000000000000000000000000000000000000000");
      expect(await b1.value()).to.equal(0);

      // Check that A1's state variables remain unchanged
      expect(await a1.num()).to.equal(42);
      expect(await a1.sender()).to.equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
      expect(await a1.value()).to.equal("1000000000000000000");

    //   expect(await b1.num()).to.equal(42);
    //   expect(await b1.sender()).to.equal(await owner.getAddress());
    //   expect(await b1.value()).to.equal(ethers.parseEther("1"));

    
    //   expect(await a1.num()).to.equal(0);
    //   expect(await a1.sender()).to.equal(ethers.AddressZero);
    //   expect(await a1.value()).to.equal(0);
    });
  });
});
