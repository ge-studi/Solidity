const{ethers} = require("hardhat");
const{expect} = require("chai");

let minimalProxy,targetContract;
let proxyAddress;
let deployer;
describe("Minimal Proxy Contract",function(){
    beforeEach(async function(){
        [deployer] = await ethers.getSigners();
        const TargetContract = await ethers.getContractFactory("TargetContract");
        targetContract = await TargetContract.deploy();
        await targetContract.waitForDeployment();


        const MinimalProxy = await ethers.getContractFactory("MinimalProxy");
        minimalProxy =  await MinimalProxy.deploy();
        await minimalProxy.waitForDeployment();

    });

    it("Should deploy  correct proxy clone of Target Contract",async function(){
        const tx = await minimalProxy.clone( targetContract.getAddress());
        const receipt = await tx.wait();

        //here proxy is name of variable inside event and args is object that holds event arguments
        proxyAddress = receipt.logs[0].args.proxy;

        expect (proxyAddress).to.not.equal(ethers.ZeroAddress,"Proxy address should not be zero");
    });

    it("Should interact with cloned contract",async function(){
        const proxyContract = await ethers.getContractAt(targetContract.interface, proxyAddress);
        const setValueTx = await proxyContract.connect(deployer).setValue(42);
        await setValueTx.wait();
    
        // Verify the value has been updated in the proxy contract
        const value = await proxyContract.value();
        expect(value).to.equal(42);
    })
});