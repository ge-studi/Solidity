const {expect} = require("chai");
const{ethers} = require("hardhat");

describe("ifElse",function(){
    let ifElse,ifelse;
    

    before(async function(){
        ifElse = await ethers.getContractFactory("ifElse");
        ifelse= await ifElse.deploy();
        await ifelse.waitForDeployment();
    });
    describe("check function",function(){
    it("Should return 0 when value < 100",async function(){
        expect(await(ifelse.check(50))).to.equal(0);
    });

    it("Should return 1 when value is between 100 and 199",async function(){
        expect(await(ifelse.check(150))).to.equal(1);
    });

    it("Should return 2  when value >=200",async function(){
        expect(await(ifelse.check(200))).to.equal(2);
        expect(await(ifelse.check(250))).to.equal(2);
    });
});

describe("get_Ans function",function(){

    it("Should return 1 when value < 100",async function(){
        expect(await(ifelse.get_Ans(50))).to.equal(1);
    });

    it("Should return 2  when value >=100",async function(){
        expect(await(ifelse.get_Ans(100))).to.equal(2);
        expect(await(ifelse.get_Ans(150))).to.equal(2);
    });
});
});