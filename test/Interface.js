const{expect} = require("chai");
const{ethers} =require("hardhat");

describe("Interface Contract",function(){
  let Counter,counter;
  let MyContract,myContract;
  
beforeEach(async function(){
  Counter = await ethers.getContractFactory("Counter");
  counter = await Counter.deploy();
  await counter.waitForDeployment();

  MyContract = await ethers.getContractFactory("MyContract");
  myContract = await MyContract.deploy();
  await myContract.waitForDeployment();
});

it("Should correctly increment counter",async function(){
  expect (await counter.count()).to.equal(0);
  console.log("Address",await counter.getAddress());
  await counter.increment();
  expect(await counter.count()).to.equal(1);
});
it("Should increment Counter using MyContract",async function(){
  expect(await counter.count()).to.equal(0);
  await myContract.incrementCounter(await counter.getAddress());
  expect(await counter.count()).to.equal(1);
});
it("Should correctly get count from Counter using MyContract",async function(){
    expect (await myContract.getCount(await counter.getAddress())).to.equal(0);
    await counter.increment();
    expect(await myContract.getCount(await counter.getAddress())).to.equal(1);
  });
});


