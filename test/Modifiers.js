const{expect}=require("chai");
const{ethers}=require("hardhat");


describe("Function Modifiers",function(){
    let FunctionModifiers,functionModifiers;
    let addr1;
    let owner;
   
    before(async function(){
       FunctionModifiers = await ethers.getContractFactory("FunctionModifiers");
       [owner, addr1] = await ethers.getSigners();
       functionModifiers = await FunctionModifiers.deploy();
       await functionModifiers.waitForDeployment();
    });

    it("Should deploy correct owner",async function(){
       expect(await functionModifiers.owner()).to.equal(owner.address);
       expect(await functionModifiers.val()).to.equal(0);
       expect(await functionModifiers.locked()).to.equal(false);
    });

    it("Should allow only owner to set value",async function(){
        await functionModifiers.setVal(10);
        expect(await functionModifiers.val()).to.equal(10);

        await expect(functionModifiers.connect(addr1).setVal(20)).to.be.revertedWith("Not owner");

    });

    it("Should accept valid address",async function(){
        
         //const zeroAddress = "0x0000000000000000000000000000000000000000";
         await functionModifiers.setAddress(addr1.address);

         // Use ethers.ZeroAddress as a reference for the zero address
         const zeroAddress = ethers.ZeroAddress;
         await expect(functionModifiers.setAddress(zeroAddress)).to.be.revertedWith("Not valid address");
    });

    it("Should handle noChange modifier correctly",async function(){
        await functionModifiers.changeValue(42);
        expect(await functionModifiers.val()).to.equal(42);

        expect(await functionModifiers.locked()).to.equal(false);

        await functionModifiers.changeValue(100);
        expect(await functionModifiers.val()).to.equal(100);
    });
});