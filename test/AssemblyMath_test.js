const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AssemblyMath", function () {
    let assemblyMath;

    before(async function () {
        const AssemblyMath = await ethers.getContractFactory("AssemblyMath");
        assemblyMath = await AssemblyMath.deploy();
        await assemblyMath.waitForDeployment();
    });

    describe("yul_add", function () {
        it("should return the correct sum", async function () {
            const result = await assemblyMath.yul_add(5n, 3n);
            expect(result).to.equal(8n);
        });

        it("should revert on overflow", async function () {
            const maxUint256 = ethers.MaxUint256;
            await expect(assemblyMath.yul_add(maxUint256, 1n)).to.be.reverted;
        });
    });

    describe("yul_mul", function () {
        it("should return the correct product", async function () {
            const result = await assemblyMath.yul_mul(5n, 3n);
            expect(result).to.equal(15n);
        });

        it("should return 0 when multiplying by 0", async function () {
            const result = await assemblyMath.yul_mul(0n, 3n);
            expect(result).to.equal(0n);
        });

        it("should revert on overflow", async function () {
            const maxUint256 = ethers.MaxUint256;
            await expect(assemblyMath.yul_mul(maxUint256, 2n)).to.be.reverted;
        });
    });

    describe("yul_fixedPoint", function () {
        it("should return the correct fixed-point result", async function () {
            const result = await assemblyMath.yul_fixedPoint(12345n, 100n);
            expect(result).to.equal(12300n);
        });

        it("should handle edge cases correctly", async function () {
            const result = await assemblyMath.yul_fixedPoint(100n, 3n);
            expect(result).to.equal(99n);
        });
    });
});
