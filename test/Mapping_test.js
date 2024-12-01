const {expect} = require("chai");
const{ethers} = require("hardhat");

describe("Mapping",function(){
    let Mapping,mapping;
    let owner;

    before(async function(){
        [owner] = await ethers.getSigners();
        Mapping = await ethers.getContractFactory("Mapping");
        mapping= await Mapping.deploy();
        await mapping.waitForDeployment();
    });

    it("Should set and get values correctly",async function(){
        const addr = owner.address;
        const value = 56;
        await mapping.set(addr,value);
        const storedValue = await mapping.get(addr);

        expect(storedValue).to.equal(value);
            });

           it("Should remove values correctly",async function(){
            const addr = owner.address;
            const value = 56;
            await mapping.set(addr,value);
            await mapping.remove(addr);
            const storedValue = await mapping.get(addr);

            expect(storedValue).to.equal(0);
                
           });
        
        });

        describe("Nested Mapping",function(){
            let NestedMapping,nestedMapping;
            let owner;

            this.beforeEach(async function(){
                [owner] = await ethers.getSigners();
                NestedMapping = await ethers.getContractFactory("NestedMapping");
                nestedMapping = await NestedMapping.deploy();
                await nestedMapping.waitForDeployment();
            });

            it("Should set and get nested values correctly",async function(){
                const addr = owner.address;
                const key =1;
                const value = true;

                await nestedMapping.set(addr,key,value);
                await nestedMapping.remove(addr,key);
                const storedValue = await nestedMapping.get(addr,key);

                expect (storedValue).to.equal(false);
            });

        });