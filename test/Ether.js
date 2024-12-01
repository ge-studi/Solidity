const {expect} = require("chai");
const{ethers} = require("hardhat");

describe("Ethers",function(){
    let Ethers_1,ethers_1;
    let owner;

    before(async function(){
        Ethers_1 = await ethers.getContractFactory("Ethers_1");
        [owner] = await ethers.getSigners();
        ethers_1= await Ethers_1.deploy();
        await ethers_1.waitForDeployment();
    });

    it("Should check for costwei set to 1wei",async function(){
        expect(await ethers_1.Costwei()).to.equal(1);
    });
    it("Should check for isOneWei false",async function(){
        expect(await ethers_1.isOneWei()).to.equal(false);
    });
    it("Should check for costEther set to 1 ether",async function(){
        const oneEtherInWei = ethers.parseUnits("1","ether");
        expect(await ethers_1.CostEther()).to.equal(oneEtherInWei);
    });

    it("Should check for isOneEther set to true",async function(){
        expect(await ethers_1.isOneEther()).to.equal(true);
    });
});