const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("UpgradeableProxy Contract", function () {
  let proxy, proxyAdmin, counterV1, counterV2, owner, newAdmin;
  let buggyProxy;
  beforeEach(async function () {
    [owner, newAdmin, user] = await ethers.getSigners();

    // Deploy CounterV1 contract
    const CounterV1 = await ethers.getContractFactory("CounterV1");
    counterV1 = await CounterV1.deploy();
    await counterV1.waitForDeployment();

    // Deploy CounterV2 contract
    const CounterV2 = await ethers.getContractFactory("CounterV2");
    counterV2 = await CounterV2.deploy();
    await counterV2.waitForDeployment();

    // Deploy Proxy contract and ProxyAdmin contract
    const Proxy = await ethers.getContractFactory("Proxy");
    proxy = await Proxy.deploy();
    await proxy.waitForDeployment();

    const BuggyProxy = await ethers.getContractFactory("BuggyProxy");
    buggyProxy = await BuggyProxy.deploy();
    await buggyProxy.waitForDeployment();

    const ProxyAdmin = await ethers.getContractFactory("ProxyAdmin");
    proxyAdmin = await ProxyAdmin.deploy();
    await proxyAdmin.waitForDeployment();
  });

  it("Should delegate call correctly", async function () {
    // Upgrade proxy to use CounterV1 as implementation
    await proxy.connect(owner).upgradeTo(await counterV1.getAddress());

    // Get proxy with CounterV1 interface
    const proxyWithCounterV1 = await ethers.getContractAt("CounterV1", await proxy.getAddress());

    // Increment count through proxy
    await proxyWithCounterV1.connect(owner).inc();
    
    // Expect the count to be 1
    expect(await proxyWithCounterV1.count()).to.equal(1);

    // Upgrade proxy to use CounterV2 as implementation
    await proxy.connect(owner).upgradeTo(await counterV2.getAddress());

    // Get proxy with CounterV2 interface
    const proxyWithCounterV2 = await ethers.getContractAt("CounterV2", await proxy.getAddress());

    // Decrement count through proxy
    await proxyWithCounterV2.connect(owner).dec();
    
    // Expect the count to be 0 (because CounterV1 had incremented it to 1)
    expect(await proxyWithCounterV2.count()).to.equal(0);
  });

        //changing admin of proxy and setting new admin
        it("should set and get admin", async function () {
        await proxy.changeAdmin(await newAdmin.getAddress());
        const currentAdmin =await proxy._getAdmin();

          // Log the current admin for debugging
          //console.log("Current admin address:", currentAdmin);

          // Compare the current admin address with newAdmin's address
          expect(currentAdmin).to.equal(await newAdmin.getAddress());
        });


            it("should upgrade to a new implementation", async function () {
              // Upgrade to CounterV1
              await buggyProxy.connect(owner).upgradeTo(counterV1.getAddress());
            
              // Check if the implementation is set correctly
              let implementationAddress = await buggyProxy.implementation();
              
              expect(implementationAddress).to.equal( await counterV1.getAddress());
            
              // Upgrade to CounterV2
              await buggyProxy.connect(owner).upgradeTo(counterV2.getAddress());
            
              //Check if the implementation is set correctly
              implementationAddress = await buggyProxy.implementation();
              //console.log("New implementation address: ${implementationAddress}");
              expect(implementationAddress).to.equal( await counterV2.getAddress());
            });

            it("Should fail when upgrading to non address",async function(){
              await expect (proxy.connect(owner).upgradeTo(owner.getAddress())).to.be.revertedWith("implementation is not contract");
            });


            it("should fail if non-admin tries to upgrade implementation", async function () {
              // Attempt to upgrade the implementation using a non-admin account
              await expect(
                buggyProxy.connect(user).upgradeTo(await counterV1.getAddress())
              ).to.be.revertedWith("not authorized");
            });
            
  
      it("should fail if trying to set admin to zero address", async function () {
        // Attempting to change the admin to address(0) should fail
        await expect(
          proxy.connect(owner).changeAdmin(ethers.ZeroAddress)
        ).to.be.revertedWith("admin = zero address");
      });
     
      it("should preserve state between upgrades", async function () {
        // Upgrade to CounterV1 and increment the count
        await proxy.connect(owner).upgradeTo(await counterV1.getAddress());
        const proxyWithCounterV1 = await ethers.getContractAt("CounterV1", await proxy.getAddress());
        await proxyWithCounterV1.connect(owner).inc();
        expect(await proxyWithCounterV1.count()).to.equal(1);
      
       // Upgrade to CounterV2 and ensure the count is still 1
        await proxy.connect(owner).upgradeTo(await counterV2.getAddress());
        const proxyWithCounterV2 = await ethers.getContractAt("CounterV2", await proxy.getAddress());
        expect(await proxyWithCounterV2.count()).to.equal(1);
      });
      

      it("should correctly delegate calls between implementations", async function () {
        // Upgrade to CounterV1 and call `inc()`
        await proxy.connect(owner).upgradeTo(await counterV1.getAddress());
        const proxyWithCounterV1 = await ethers.getContractAt("CounterV1", await proxy.getAddress());
        
        await proxyWithCounterV1.connect(owner).inc();
        expect(await proxyWithCounterV1.count()).to.equal(1);
    
        // Upgrade to CounterV2 and call `dec()`
        await proxy.connect(owner).upgradeTo(await counterV2.getAddress());
        const proxyWithCounterV2 = await ethers.getContractAt("CounterV2", await proxy.getAddress());
        
        await proxyWithCounterV2.connect(owner).dec();
        expect(await proxyWithCounterV2.count()).to.equal(0);
      });
    });
    
