const{expect}=require("chai");
const{ethers}=require("hardhat");


describe("Error Contract",function(){
    let Error,error;
   
    before(async function(){
       Error = await ethers.getContractFactory("Error");
       error = await Error.deploy();
       await error.waitForDeployment();
    });

    it("Should pass test function with correct input",async function(){
       await expect(error.test(11)).to.not.be.reverted;
    });

    it("Should revert with invalid input",async function(){
        await expect(error.test(10)).to.be.revertedWith("Input must be greater than 10");
     });

     it("Should pass test1() function",async function(){
        await expect(error.test1(23)).to.not.be.reverted;
     });

     it("Should revert test1() with invalid input",async function(){
        await expect(error.test1(10)).to.be.revertedWith("Input must be greater than 10");
     });

     it("Should pass testing() function with num equal to 0",async function(){
        await expect(error.testing()).to.not.be.reverted;
     });

     it("Should revert testCustomError() with invalid withdrawal amount",async function(){
        const withdrawalAmount = ethers.parseUnits("1");
        await expect(error.testCustomError(withdrawalAmount)).to.be.revertedWithCustomError(error, "bal").withArgs(0, withdrawalAmount);
     });
});