const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AssemblyConditional", function () {
    let assemblyConditional;

    before(async function () {
        const AssemblyConditional = await ethers.getContractFactory("AssemblyConditional");
        assemblyConditional = await AssemblyConditional.deploy();
        await assemblyConditional.waitForDeployment();
    });

    it("should return 99 for yul_if when x < 10", async function () {
        const result = await assemblyConditional.yul_if(5n);
        expect(result).to.equal(99n);
    });

    it("should return 0 for yul_if when x >= 10", async function () {
        const result = await assemblyConditional.yul_if(10n);
        expect(result).to.equal(0n);
    });

    it("should return 10 for yul_switch when x is 1", async function () {
        const result = await assemblyConditional.yul_switch(1n);
        expect(result).to.equal(10n);
    });

    it("should return 20 for yul_switch when x is 2", async function () {
        const result = await assemblyConditional.yul_switch(2n);
        expect(result).to.equal(20n);
    });

    it("should return 0 for yul_switch when x is not 1 or 2", async function () {
        const result = await assemblyConditional.yul_switch(3n);
        expect(result).to.equal(0n);
    });
});
