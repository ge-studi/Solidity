const {expect} = require("chai");
const{ethers} = require("hardhat");

describe("Enum",function(){
    let Enum,enumContract;
    let owner;

    before(async function(){
        [owner] = await ethers.getSigners();
        Enum = await ethers.getContractFactory("Enum");
        enumContract= await Enum.deploy();
        await enumContract.waitForDeployment();
    });

    it("Should initialize with default status",async function(){
        const status = await enumContract.get();
        expect(status).to.equal(0);
    });

    it("Should set status to Accepted",async function(){
        await enumContract.set(1);
        const status = await enumContract.get();
        expect (status).to.equal(1);
    });
    it("Should set status to Rejected",async function(){
        await enumContract.set(2);
        const status = await enumContract.get();
        expect (status).to.equal(2);
    });
    it("Should set status to Canceled",async function(){
        await enumContract.set(3);
        const status = await enumContract.get();
        expect (status).to.equal(3);
    });
    it("Should set status to Pending",async function(){
        await enumContract.set(4);
        const status = await enumContract.get();
        expect (status).to.equal(4);
    });

});