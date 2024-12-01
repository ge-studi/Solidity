const{expect}=require("chai");
const{ethers}=require("hardhat");


describe("Inheritance Contract",function(){
  let AA,B2;
  let contractA,contractB;

    beforeEach(async function(){
        AA = await ethers.getContractFactory("AA");
        B2 = await ethers.getContractFactory("B2");
       
        contractA = await AA.deploy();
        contractB = await B2.deploy();
      
        });

        it("Should return first from contract A",async function(){
            expect(await contractA.getName()).to.equal("First");
        });

        it("Should return second from contract B",async function(){
            expect(await contractB.getName()).to.equal("Second");
        });

    
});