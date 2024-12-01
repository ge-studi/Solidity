const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("UncheckedMath", function () {
    let uncheckedMath;

    before(async function () {
        const UncheckedMath = await ethers.getContractFactory("UncheckedMath");
        uncheckedMath = await UncheckedMath.deploy();
        await uncheckedMath.waitForDeployment();
    });

    it("should return the correct sum for add function", async function () {
        const result = await uncheckedMath.add(3n, 7n);
        expect(result).to.equal(10n);

        const largeSum = await uncheckedMath.add(
            ethers.MaxUint256,
            1n
        );
        expect(largeSum).to.equal(0n);
    });

    it("should return the correct difference for sub function", async function () {
        const result = await uncheckedMath.sub(10n, 3n);
        expect(result).to.equal(7n);

        const largeSub = await uncheckedMath.sub(
            ethers.MaxUint256,
            1n
        );
        expect(largeSub).to.equal(ethers.MaxUint256 - 1n);
    });

    it("should return the correct sum of cubes for sumOfCubes function", async function () {
        const result = await uncheckedMath.sumofCubes(2, 3);
        expect(result).to.equal(8 + 27);

        const largeCubeSum = await uncheckedMath.sumofCubes(
            10,
            20
        );
        expect(largeCubeSum).to.equal(1000 + 8000);
    });
});
