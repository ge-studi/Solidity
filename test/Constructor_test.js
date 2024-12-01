const {expect} = require("chai");
const{ethers} = require("hardhat");

describe("Constructor contract",function(){
    let One,Two,X,Y,Z;
    let one,two,x,y,z;

    this.beforeEach(async function(){
        One = await ethers.getContractFactory("One");
        Two = await ethers.getContractFactory("Two");
        X = await ethers.getContractFactory("X");
        Y = await ethers.getContractFactory("Y");
        Z = await ethers.getContractFactory("Z");

        one = await One.deploy("Name in One");
        two = await Two.deploy("Text in Two");
        x = await X.deploy();
        y = await Y.deploy("Name for Y", "Text for Y");
        z = await Z.deploy();
    });

        it("Should deploy contract X with correct arguments",async function(){
            expect(await x.name()).to.equal("Input to one");
            expect(await x.text()).to.equal("Input to two");
        });

        it("Should deploy contract Y with correct arguments",async function(){
            expect(await y.name()).to.equal("Name for Y");
            expect(await y.text()).to.equal("Text for Y");
        });

        it("Should deploy contract Z with correct arguments",async function(){
            expect(await z.name()).to.equal("One was called");
            expect(await z.text()).to.equal("Two was called");
        });
    });
