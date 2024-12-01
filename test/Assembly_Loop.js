const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AssemblyLoop", function () {
    let assemblyLoop;

    before(async function () {
        const AssemblyLoop = await ethers.getContractFactory("AssemblyLoop");
        assemblyLoop = await AssemblyLoop.deploy();
        await assemblyLoop.waitForDeployment();
    });

    it("should return 10 for yul_for_loop", async function () {
        const result = await assemblyLoop.yul_forLoop();
        expect(result).to.equal(10);
    });

    it("should return 5 for yul_while_loop", async function () {
        const result = await assemblyLoop.yul_whileLoop();
        expect(result).to.equal(5);
    });
});
