const {expect} = require("chai");
const{ethers} = require("hardhat");

describe("Events contract",function(){
    let Events,events;

    before(async function(){
        Events = await ethers.getContractFactory("Events");
        [owner] = await ethers.getSigners();
        events = await  Events.deploy();
        await events.waitForDeployment();
    });

    it("Should emit event Log correctly",async function(){
        await expect (events.enter()).to.emit(events,"Logging").withArgs(owner.address,"Hello");
    });
});