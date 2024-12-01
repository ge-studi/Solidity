const{expect} = require("chai");
const{ethers} = require("hardhat");

describe("Function Selector Contract",function(){
 let FunctionSelector,functionSelector;
 beforeEach(async function(){
    [deployer] = await ethers.getSigners();
  FunctionSelector = await ethers.getContractFactory("FunctionSelector");
 functionSelector = await FunctionSelector.deploy();
 await functionSelector.waitForDeployment();
 });

 it("Should convert data into bytes",async function(){
  const func = "getSelector(string)";
   const expected = ethers.keccak256(ethers.toUtf8Bytes(func)).slice(0,10);
   const selector = await functionSelector.getSelector(func);

   expect(selector).to.equal(expected);
 });
});