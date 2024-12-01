const{expect} =require("chai");
const{ethers} = require("hardhat");

describe("ByteCodeContract", function () {
    let ByteCodeContract, byteCodeContract, owner;

    beforeEach(async function () {
        [owner] = await ethers.getSigners();
        ByteCodeContract = await ethers.getContractFactory("ByteCodeContract");
        byteCodeContract = await ByteCodeContract.deploy();
        await byteCodeContract.waitForDeployment();
    });

    it("Should deploy a contract and emit the correct event", async function () {
        const tx = await byteCodeContract.deploy();
        const receipt = await tx.wait();

        const event = receipt.logs.find((log) => {
            return log.fragment.name === "Log";
        });

        const deployedAddress = event.args[0]; // Access the first argument (address)

        expect(deployedAddress).to.be.properAddress;

        // Check if a contract exists at the deployed address
        const code = await ethers.provider.getCode(deployedAddress);
        expect(code).to.not.equal("0x");
    });

    it("Should deploy a contract that returns 255", async function () {
        const tx = await byteCodeContract.deploy();
        const receipt = await tx.wait();
        const deployedAddress = receipt.logs.find((log) => {
            return log.fragment.name === "Log";
        }).args[0];

        const IContract = new ethers.Contract(deployedAddress, ["function getValue() external view returns (uint256)"], owner);
        const value = await IContract.getValue();

        expect(value).to.equal(255n);
    });


    it("Should deploy multiple contracts with unique addresses", async function () {
        const tx1 = await byteCodeContract.deploy();
        const receipt1 = await tx1.wait();
        const addr1 = receipt1.logs.find((log) => {
            return log.fragment.name === "Log";
        }).args[0];

        const tx2 = await byteCodeContract.deploy();
        const receipt2 = await tx2.wait();
        const addr2 = receipt2.logs.find((log) => {
            return log.fragment.name === "Log";
        }).args[0];

        expect(addr1).to.not.equal(addr2);
    });

    it("Should deploy contract with correct runtime code", async function () {
        const tx = await byteCodeContract.deploy();
        const receipt = await tx.wait();
        const deployedAddress = receipt.logs.find((log) => {
            return log.fragment.name === "Log";
        }).args[0];

        const runtimeCode = await ethers.provider.getCode(deployedAddress);
        const expectedCode = "0x60ff60005260206000f3";

        expect(runtimeCode).to.equal(expectedCode);
    });
});
