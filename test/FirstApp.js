const {expect} = require("chai");
const{ethers} = require("hardhat");

describe("FirstApplication",function(){
    let FirstApplication,firstApplication;

    before(async function(){
        FirstApplication = await ethers.getContractFactory("FirstApplication");
        firstApplication = await FirstApplication.deploy();
        await firstApplication.waitForDeployment();
    });
    it("Should increment the counter at 0",async function(){
        const initialCount = await firstApplication.getRes();
        expect(initialCount).to.equal(0);
    });
    it("Should increment the counter",async function(){
        await firstApplication.increment();
        const count= await firstApplication.getRes();
        expect(count).to.equal(1);
});

it("Should decrement the counter",async function(){
        await firstApplication.increment();
        await firstApplication.decrement()
        const count= await firstApplication.getRes();
        expect(count).to.equal(1);
    
});

it("Should handle multiple m(increments) and n(decrements)",async function(){
    const m =10;
    const n= 8;

    for(let i=0;i<m;i++){
        await firstApplication.increment();
    }

    for(let i=n;i>=0;i--){
        await firstApplication.decrement();
    }

    const expectedCount = m - n;
    const count = await firstApplication.getRes();
    expect(count).to.equal(expectedCount);

});

it("Should handle decrementing below zero",async function(){
    //here we are checking negative case without incrementing.
    await firstApplication.decrement();
    const count =  await firstApplication.getRes();
    expect(count).to.equal(1);
});

it("Should handle large increment and decrement values",async function(){
    const largeNumber = 10000;
    console.log("Starting value:", Number(await firstApplication.getRes()));
    for(let i=0;i<largeNumber;i++){
        await firstApplication.increment();
    }
        console.log("After increment value:", Number(await firstApplication.getRes()));

    for(let i=0;i<largeNumber/2 + 1;i++){
            await firstApplication.decrement();}
           
            const expectedCount = largeNumber/2;
            const count = await firstApplication.getRes();

            console.log("Final value:", count);
            expect(count).to.equal(expectedCount);

});

});