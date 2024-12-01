const {expect} = require("chai");
const{ethers} = require("hardhat");

describe("Array",function(){
    let Array,array;
    let owner;

    before(async function(){
        [owner] = await ethers.getSigners();
        Array = await ethers.getContractFactory("Array");
        array= await Array.deploy();
        await array.waitForDeployment();
    });

    it("Should initialize with default values",async function(){
            const arr1First = await array.arr1(0);
            expect(arr1First).to.equal(4);
            
            const arr1Second = await array.arr1(1);
            expect(arr1Second).to.equal(5);
            
            const arr1Third = await array.arr1(2);
            expect(arr1Third).to.equal(6);
        
            // Check the length of Fixedarr manually
            let fixedArrLength = 0;
            for (let i = 0; i < 100; i++) {
                const value = await array.Fixedarr(i);
                expect(value).to.equal(0);
                fixedArrLength++;
        }
    
        expect(fixedArrLength).to.equal(100);
        
    });

    it("Should push values correctly",async function(){
        await array.push(10);
        await array.push(20);

        const length = await array.getLength();
        expect(length).to.equal(2);

        const value1= await array.get(0);
        const value2 = await array.get(1);

        expect(value1).to.equal(10);
        expect(value2).to.equal(20);
    });

    it("Should pop values correctly",async function(){
        await array.push(3);
        await array.push(40);
        await array.pop();

        const length = await array.getLength();
        expect(length).to.equal(3);
    });

    it("Should remove values correctly by index",async function(){
        await array.push(50);
        await array.push(60);
        await array.push(0);

        await array.remove(1);

        const length = await array.getLength();
        expect(length).to.equal(6);

        const value1 = await array.get(1);
        expect(value1).to.equal(0);
    });

    it("Should return correct length",async function(){
        await array.push(80);
        await array.push(90);

        const length = await array.getLength();
        expect(length).to.equal(8);
    });
});
