const{expect} = require("chai");
const{ethers} = require("hardhat");

describe("Sending ether",function(){
    let ReceiveEther,receiveEther;
    let SendEther,sendEther;
    let owner,recipient;
    beforeEach(async function(){
         [owner,recipient] = await ethers.getSigners();

        ReceiveEther = await ethers.getContractFactory("ReceiveEther");
        receiveEther = await ReceiveEther.deploy();
        await receiveEther.waitForDeployment();
        SendEther = await ethers.getContractFactory("SendEther");
        sendEther = await SendEther.deploy();
        await sendEther.waitForDeployment();
    });
    describe("ReceiveEther Contract",function(){
    it("Should return ether via receive()",async function(){
        expect(ethers.isAddress(await receiveEther.getAddress())).to.be.true;
        const tx = await owner.sendTransaction({
            to: receiveEther.target,
            value: ethers.parseUnits("1"),
        });
        await tx.wait();

        const balance = await receiveEther.getBalance();
        expect(balance).to.equal(ethers.parseUnits("1"));
    });
    it("Should receive ether via fallback()",async function(){
        expect(ethers.isAddress(receiveEther.getAddress())).to.be.false;
        const tx = await owner.sendTransaction({
            to: receiveEther.target,
            value: ethers.parseUnits("1"),
            data: "0x1234", // Random data to trigger the fallback function
          });
          await tx.wait();
    
          const balance = await receiveEther.getBalance();
          expect(balance).to.equal(ethers.parseUnits("1"));
    });
 });
   describe("Sending Contract",function(){
    it("Should send ether using Transfer",async function(){
      const tx = await  sendEther.SendViaTransfer(
          receiveEther.getAddress(),
          {value: ethers.parseUnits("1"),
          });
        await tx.wait();
  
        const balance = await receiveEther.getBalance();
        expect(balance).to.equal(ethers.parseUnits("1"));
    });
    it("Should send ether using send()",async function(){
      const tx = await  sendEther.sendViaSend(
          receiveEther.getAddress(),
          {value: ethers.parseUnits("1"),
          });
        await tx.wait();
  
        const balance = await receiveEther.getBalance();
        expect(balance).to.equal(ethers.parseUnits("1"));
    });

    it("Should send ether using call()",async function(){
      const tx = await  sendEther.sendViaCall(
          receiveEther.getAddress(),
          {value: ethers.parseUnits("1"),
          });
        await tx.wait();
  
        const balance = await receiveEther.getBalance();
        expect(balance).to.equal(ethers.parseUnits("1"));
    });
   });
  });
