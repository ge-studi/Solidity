const {expect} = require("chai");
const{ethers} = require("hardhat");

describe("Loop",function(){
    let Loop,loop_1;
    

    before(async function(){
        Loop = await ethers.getContractFactory("Loop");
        loop_1= await Loop.deploy();
        await loop_1.waitForDeployment();
    });

    it("Should return correct values of i and j after loops",async function(){
             const[i,j] = await loop_1.loop();   
        expect(i).to.equal(3);

        expect(j).to.equal(5);
            });
        
        });