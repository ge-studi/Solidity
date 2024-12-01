const {expect} = require("chai");
const{ethers} = require("hardhat");

describe("Immutable",function(){
    let Immutable,immutable;
    let deployer,otherAccount;

    before(async function(){
        [deployer,otherAccount] = await ethers.getSigners();
        Immutable = await ethers.getContractFactory("Immutable");

        immutable= await Immutable.deploy(123);
        await immutable.waitForDeployment();
    });

    it("Should return correct value",async function(){
       expect(await(immutable.Value())).to.equal(123);
    })

    it("Should return correct address",async function(){
        expect(await(immutable._address())).to.equal(deployer.address);
     })

     it("Should not be able to modify immutable values",async function(){
         expect(await(immutable.connect(otherAccount)._address())).to.not.be.reverted;    
    });
});