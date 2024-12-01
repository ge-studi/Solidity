const {expect} = require("chai");
const{ethers} = require("hardhat");


describe("Advance Events contract",function(){
    let AdvancedEvents,advancedEvents;
    let owner,addr1,addr2;

    beforeEach(async function(){
        AdvancedEvents = await ethers.getContractFactory("AdvancedEvents");
        [owner,addr1,addr2] = await ethers.getSigners();
        advancedEvents = await  AdvancedEvents.deploy();
        await advancedEvents.waitForDeployment();
    });

    it("Should initiate transfer correctly",async function(){
        await expect(advancedEvents.initiateTransfer(addr1.address,100)).
        to.emit(advancedEvents,"TransferInitiated").
        withArgs(owner.address,addr1.address,100);
    });
  

        it("Should confirm transfer",async function(){
          console.log("Owner Address: ",await owner.getAddress());
            const transferId = "0x7472616e73666572496431000000000000000000000000000000000000000000";

            await expect(advancedEvents.confirmTransfer(transferId)).to.emit(advancedEvents,"TransferConfirmed").withArgs(await owner.getAddress(),await advancedEvents.getAddress(),0);
            expect(await advancedEvents.TransferConfirmations(transferId)).to.be.true;
        });

      it("Should revert when trying to confirm transfer",async function(){
            const transferId = "0x7472616e73666572496431000000000000000000000000000000000000000000";
            await advancedEvents.confirmTransfer(transferId);

            await expect(advancedEvents.confirmTransfer(transferId)).to.be.revertedWith("Transfer already confirmed");
        
        });

    });

    describe("EventSubscription", function () {
        let EventSubscription, eventSubscription, owner, addr1, addr2;
      
        beforeEach(async function () {
          [owner, addr1, addr2] = await ethers.getSigners();
          EventSubscription = await ethers.getContractFactory("EventSubscription");
          eventSubscription = await EventSubscription.deploy();
          await eventSubscription.waitForDeployment();
        });
      
        it("should allow a user to subscribe", async function () {
          await eventSubscription.connect(addr1).subscribe();
          expect(await eventSubscription.subscribers(addr1.address)).to.be.true;
        });
      
        it("should not allow a user to subscribe twice", async function () {
          await eventSubscription.connect(addr1).subscribe();
          await expect(eventSubscription.connect(addr1).subscribe()).to.be.revertedWith(
            "Already subscribed"
          );
        });
      
        it("should allow a user to unsubscribe", async function () {
          await eventSubscription.connect(addr1).subscribe();
          await eventSubscription.connect(addr1).unsubscribe();
          expect(await eventSubscription.subscribers(addr1.address)).to.be.false;
        });
      
        it("should not allow a non-subscribed user to unsubscribe", async function () {
          await expect(eventSubscription.connect(addr1).unsubscribe()).to.be.revertedWith(
            "Not subscribed"
          );
        });
      
    });
      