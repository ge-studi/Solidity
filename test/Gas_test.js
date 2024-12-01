const {expect} = require("chai");
const{ethers} = require("hardhat");

describe("Gas",function(){
    let Gas,gas;
    

    before(async function(){
        Gas = await ethers.getContractFactory("Gas");
        gas= await Gas.deploy();
        await gas.waitForDeployment();
    });

    it("Should consume all gas and fail",async function(){
        const value = 200000n;
        await expect(gas.input({
            gasLimit: BigInt(value)
        })).to.be.reverted;
    });
});