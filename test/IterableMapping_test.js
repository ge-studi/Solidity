const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TestMap Contract", function () {
    let iterableMapping;
    let testMap;

    beforeEach(async function () {
        // Deploy the IterableMapping library
        const IterableMapping = await ethers.getContractFactory("IterableMapping");
        iterableMapping = await IterableMapping.deploy();
        await iterableMapping.waitForDeployment();

        // Link the IterableMapping library to the TestMap contract
        const TestMap = await ethers.getContractFactory("TestMap", {
            libraries: {
                IterableMapping: iterableMapping.target,
            },
        });

        // Deploy the TestMap contract
        testMap = await TestMap.deploy();
        await testMap.waitForDeployment();
    });

    it("should set and get values correctly", async function () {
        // Run the testIterable function
        const tx = await testMap.testIterable();
        await tx.wait();

        // Check the size of the map after calling testIterable
        const size = await testMap.mapSize();
        expect(size).to.equal(3);

        // Validate the keys in the map
        const key0 = await testMap.getKeyAtIndex(0);
        const key1 = await testMap.getKeyAtIndex(1);
        const key2 = await testMap.getKeyAtIndex(2);

        expect(key0).to.equal(ethers.ZeroAddress);
        expect(key1).to.equal("0x0000000000000000000000000000000000000003");
        expect(key2).to.equal("0x0000000000000000000000000000000000000002");

        // Validate the values associated with each key
        const value0 = await testMap.getValueAtKey(ethers.ZeroAddress);
        const value1 = await testMap.getValueAtKey("0x0000000000000000000000000000000000000003");
        const value2 = await testMap.getValueAtKey("0x0000000000000000000000000000000000000002");

        expect(value0).to.equal(0);
        expect(value1).to.equal(300);
        expect(value2).to.equal(200);
    });
});
