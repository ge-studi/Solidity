const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HelloWorld", function () {
  let HelloWorld;
  let helloWorld;

  before(async function () {
    // Deploy the HelloWorld contract
    HelloWorld = await ethers.getContractFactory("HelloWorld");
    helloWorld = await HelloWorld.deploy();
    await helloWorld.waitForDeployment();
  });


  it("should return Hello World", async function () {
    // ...
    expect(await helloWorld.greet()).to.equal("Hello World");
  });

});
