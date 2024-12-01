const{expect}=require("chai");
const{ethers}=require("hardhat");

describe("Visibility Contract",function(){
  let Base,base;
    let Child, child;
  beforeEach(async function(){
   Base = await ethers.getContractFactory("Base");
   Child = await ethers.getContractFactory("Child");
   base = await Base.deploy();
   child = await Child.deploy();
  });

  it("Should return privateFunc() correctly",async function(){
       expect(await base.test()).to.equal("Function called is private");
});

it("Should test internalFunc correctly",async function(){
   expect(await child.testInternal()).to.equal("Internal function called");
});

it("Should test external function correctly",async function(){
  expect(await base.externalfunc()).to.equal("External function called");
});

});



