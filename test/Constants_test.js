const {expect} = require("chai");
const{ethers} = require("hardhat");

describe("Constants",function(){
    let Constants,constants;

    before(async function(){
       Constants = await ethers.getContractFactory("Constants");
        constants= await Constants.deploy();
        await constants.waitForDeployment();
    });
    it("Should return correct address",async function(){
        expect(await constants._address()).to.equal("0x777788889999AaAAbBbbCcccddDdeeeEfFFfCcCc");
    });
    it("Should return value equal to 123",async function(){
       expect(await constants._value()).to.equal(123);
    });
});