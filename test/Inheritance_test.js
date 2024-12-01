const{expect}=require("chai");
const{ethers}=require("hardhat");


describe("Inheritance Contract",function(){
  let A,B,C,D;
  let contractA,contractB, contractC, contractD;

    beforeEach(async function(){
        A = await ethers.getContractFactory("A");
        B = await ethers.getContractFactory("B");
        C = await ethers.getContractFactory("C");
        D = await ethers.getContractFactory("D");

        contractA = await A.deploy();
        contractB = await B.deploy();
        contractC = await C.deploy();
        contractD = await D.deploy();
        });

        it("Should return one from contract A",async function(){
            expect(await contractA.returnString()).to.equal("One");
        });

        it("Should return two from contract B",async function(){
            expect(await contractB.returnString()).to.equal("Two");
        });

        it("Should return three from contract C",async function(){
            expect(await contractC.returnString()).to.equal("Three");
        });

        it("Should return contract overridden string from contract D",async function(){
            expect(await contractD.returnString()).to.equal("Three");
        });
});