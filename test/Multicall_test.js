const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Multicall Test", function () {
  let testMulticall, multicall, owner;

  beforeEach(async function(){

    [owner] = await ethers.getSigners();

    // Deploy Testmulticall contract
    const Testmulticall = await ethers.getContractFactory("Testmulticall");
    testMulticall = await Testmulticall.deploy();
    await testMulticall.waitForDeployment();

    // Deploy Multicall contract
    const Multicall = await ethers.getContractFactory("Multicall");
    multicall = await Multicall.deploy();
    await multicall.waitForDeployment();
  });

  it("Should call func1 and return the correct result", async function () {
    const data1 = await testMulticall.getData1();
    const targets = [await testMulticall.getAddress()];
    const data = [data1];

    const results = await multicall.multicall(targets, data);

    const decoded = ethers.AbiCoder.defaultAbiCoder().decode(["uint256", "uint256"], results[0]);
    expect(decoded[0]).to.equal(1); // First return value should be 1
  });

  it("Should call func2 and return the correct result", async function () {
    const data2 = await testMulticall.getData2();
    const targets = [await testMulticall.getAddress()];
    const data = [data2];

    const results = await multicall.multicall(targets, data);

    const decoded = ethers.AbiCoder.defaultAbiCoder().decode(["uint256", "uint256"], results[0]);
    expect(decoded[0]).to.equal(2); // First return value should be 2
  });

  it("Should multicall func1 and func2 and return the correct results", async function () {
    const data1 = await testMulticall.getData1();
    const data2 = await testMulticall.getData2();

    const targets = [await testMulticall.getAddress(), await testMulticall.getAddress()];
    const data = [data1, data2];

    const results = await multicall.multicall(targets, data);

    const decoded1 = ethers.AbiCoder.defaultAbiCoder().decode(["uint256", "uint256"], results[0]);
    const decoded2 = ethers.AbiCoder.defaultAbiCoder().decode(["uint256", "uint256"], results[1]);

    expect(decoded1[0]).to.equal(1); // func1 first return value should be 1
    expect(decoded2[0]).to.equal(2); // func2 first return value should be 2
  });

  it("Should fail if targets and data arrays have different lengths", async function () {
    const data1 = await testMulticall.getData1();
    const targets = [await testMulticall.getAddress()];

    await expect(
      multicall.multicall(targets, [data1, data1])
    ).to.be.revertedWith("target length != data length");
  });

  it("Should fail if staticcall fails", async function () {
    const invalidData = ethers.AbiCoder.defaultAbiCoder().encode(["string"], ["invalid"]);
    const targets = [await testMulticall.getAddress()];
    const data = [invalidData];

    await expect(multicall.multicall(targets, data)).to.be.revertedWith("call failed");
  });
});
