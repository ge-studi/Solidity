const{expect}=require("chai");
const{ethers}=require("hardhat");


describe("View and Pure Functions",function(){
    let View_PureFunctions,view_PureFunctions;
   
    before(async function(){
        View_PureFunctions = await ethers.getContractFactory("View_PureFunctions");
        view_PureFunctions = await View_PureFunctions.deploy();
       await view_PureFunctions.waitForDeployment();
    });

    it("Should add correctly",async function(){
        const val2=100;
        const expectedValue=190;
        expect (await view_PureFunctions.add(val2)).to.equal(expectedValue);
    });

    it("Should get output correctly",async function(){
      const a = 60;
      const b = 80;
      const expectedValue = 140;
      expect(await view_PureFunctions.output(a,b)).to.equal(expectedValue);
    });

    it("Should return correct expected first value",async function(){
        const expectedVal = 90;
        expect(await view_PureFunctions.val1()).to.equal(expectedVal);
    });
});
