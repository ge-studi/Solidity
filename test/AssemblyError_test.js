const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AssemblyError", function () {
    let assemblyError;

    before(async function () {
        const AssemblyError = await ethers.getContractFactory("AssemblyError");
        assemblyError = await AssemblyError.deploy();
        await assemblyError.waitForDeployment();
    });

    it("should not revert when x is 10 or less", async function () {
        await expect(assemblyError.yul_revert(10n)).to.not.be.reverted;
    });

    it("should revert when x is greater than 10", async function () {
        await expect(assemblyError.yul_revert(11n)).to.be.reverted;
    });
});
