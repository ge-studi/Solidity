const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Proxy Contract", function () {
  let proxy1;
  let helper;
  let owner;
 

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    const Proxy1 = await ethers.getContractFactory("Proxy1");
    proxy1 = await Proxy1.deploy();
    await proxy1.waitForDeployment();

    const Helper = await ethers.getContractFactory("Helper");
    helper = await Helper.deploy();
    await helper.waitForDeployment();
  });

          it("should deploy TestContract1 directly and verify owner", async function () {
            const TestContract1 = await ethers.getContractFactory("TestContract1");
            const testContract1 = await TestContract1.deploy();
            await testContract1.waitForDeployment();

            console.log("Deployed address directly:", testContract1.address);
            const initialOwner = await testContract1.owner();
            console.log("Initial owner directly:", initialOwner);
            expect(initialOwner).to.equal(await owner.getAddress());
        });

          it("should deploy TestContract2 via proxy and verify constructor values", async function () {
            const x = 5;
            const y = 10;
            const deployValue = ethers.parseEther("1");

            // Get bytecode with constructor arguments from Helper
            const bytecode2 = await helper.getBytecode2(x, y);

            // Deploy TestContract2 using proxy with value (if required by constructor)
            const tx = await proxy1.deploy(bytecode2, { value: deployValue });
            const receipt = await tx.wait();

            // Extract deployed address from event logs
            let deployedAddress;
            for (const event of receipt.logs) {
              const parsedEvent = proxy1.interface.parseLog(event);
              if (parsedEvent.name === "Deploy") {
                deployedAddress = parsedEvent.args[0];
                break;
              }
            }

            // Verify deployment and constructor values
            expect(deployedAddress).to.not.be.undefined;
            const testContract2 = await ethers.getContractAt("TestContract2", deployedAddress);
            const contractX = await testContract2.x();
            const contractY = await testContract2.y();
            const contractValue = await testContract2.value();
            expect(contractX).to.equal(x);
            expect(contractY).to.equal(y);
            expect(contractValue).to.equal(deployValue);
  });
});