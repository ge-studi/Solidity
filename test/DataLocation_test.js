const{expect} =require("chai");
const{ethers}=require("hardhat");

describe("DataLocations Contract",function(){
 let DataLocations;
 let dataLocations;

 before(async function(){
    DataLocations = await ethers.getContractFactory("DataLocations");
    dataLocations = await DataLocations.deploy();
    dataLocations.waitForDeployment();
 });

 it("Should call the input function",async function(){
    await dataLocations.input();
 });

 it("Should return memory using get()",async function(){
    const testArr = [1,2,3];
    const returnedArr = await dataLocations.get(testArr);
    expect(returnedArr.length).to.equal(testArr.length);

    for(let i=0;i<testArr.length;i++){
        expect(returnedArr[i]).to.equal(testArr[i]);
    }
 });


 it("Should handle an empty array passed to get()", async function () {
    const emptyArr = [];
    const returnedArr = await dataLocations.get(emptyArr);
    expect(returnedArr.length).to.equal(0);
  });
  
 it("Should handle calldata",async function(){
    const testArr = [1,2,3];
    await dataLocations.do_something(testArr);
 });

 it("Should handle a large calldata array",async function(){
  const largeArr = Array(100).fill(1);
  await dataLocations.do_something(largeArr);
 });
});