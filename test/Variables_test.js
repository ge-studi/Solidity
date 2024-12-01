const {expect} = require("chai");
const{ethers} = require("hardhat");

describe("Variables",function(){
    let Variables,variables;

    before(async function(){
        Variables = await ethers.getContractFactory("Variables");
        variables= await Variables.deploy();
        await variables.waitForDeployment();
    });
    it("Should initialize text to Geeta",async function(){
        expect(await variables.text()).to.equal("Geeta");
    });

    it("Should initialize number to 478",async function(){
        expect(await variables.num()).to.equal(478);
    });

    it("Should execute getResult without errors",async function(){
       expect(await(variables.getResult())).to.not.be.reverted;
    });

    it("Should execute get correct timestamp in getResult",async function(){
        await(variables.getResult());
     });

     it("Should get correct sender address in getResult",async function(){
        await(variables.getResult());
     });
});