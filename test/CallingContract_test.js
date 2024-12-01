const{expect} = require("chai");
const{ethers} = require("hardhat");

describe("Calling Other Contract",function(){
  let Calle,calle;
  let Caller,caller;
    beforeEach(async function(){
       [deployer]=await ethers.getSigners();
        Calle = await ethers.getContractFactory("Calle");
        calle = await Calle.deploy();
        
        await calle.waitForDeployment();
        //console.log("Address0", await calle.getAddress());

        Caller = await ethers.getContractFactory("Caller");
        caller = await Caller.deploy();
        //console.log("Address",await caller.getAddress());
        await caller.waitForDeployment();
    });
    it("Should set value of x",async function(){
        await calle.set(42);
        const x = await calle.x();
        expect(x).to.equal(42);
    });

    it("Should send ether",async function(){
        const tx = await calle.SetandSendEther(84,{value: ethers.parseEther("1.0")});
        await tx.wait();
        const x = await calle.x();
        const value = await calle.value();
        expect(x).to.equal(84);
        expect(value).to.equal(ethers.parseEther("1.0"));
    });

    describe("Caller Contract",function(){
        it("Should call set on calle contract",async function(){
            await caller.set(calle.target,123);
    
            const a = await calle.x();
            expect(a).to.equal(123);
        });
    
        it("Should call setFromAddress() function on Calle contract",async function(){
            await caller.setFromAddress(calle.target,456);
            const x = await calle.x();
            expect(x).to.equal(456);
        });
    
        it("Should call SetandSendEther() function with ether on Calle contract",async function(){
            const tx = await caller.SetandSendEther(calle.target,789,{value: ethers.parseEther("2.0")});
            await tx.wait();
    
            const x = await calle.x();
            const value = await calle.value();
            expect(x).to.equal(789);
            expect(value).to.equal(ethers.parseEther("2.0"));
    }); 
    });

});
