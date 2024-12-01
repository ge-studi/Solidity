const {expect} = require("chai");
const{ethers} = require("hardhat");

describe("Reading_writing",function(){
    let Reading_writing,reading_writing;

    before(async function(){
        Reading_writing = await ethers.getContractFactory("Reading_writing");
        reading_writing= await Reading_writing.deploy();
        await reading_writing.waitForDeployment();
    });

    it("Should return correct value of num for set function",async function(){
        await reading_writing.set(900);
        expect(await reading_writing.num()).to.equal(900);
    });

    it("Should return correct value of num for get function",async function(){
        expect(await reading_writing.get()).to.equal(900);
    });
});