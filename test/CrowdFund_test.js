const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CrowdFund Contract", function () {
  let token, crowdFund, owner, addr1;
  let addr2,addr3;

  beforeEach(async function () {
    const MyToken = await ethers.getContractFactory("MyToken");
    token = await MyToken.deploy("Geetanjali", "Mtk");
    await token.waitForDeployment();

    const CrowdFund = await ethers.getContractFactory("CrowdFund");
    crowdFund = await CrowdFund.deploy(token.target); // Pass token address here
    await crowdFund.waitForDeployment();

    [owner, addr1, addr2, addr3] = await ethers.getSigners();

  });
    async function setCurrentTime(timestamp) {

      //console.log(`Setting current time to: ${timestamp}`);
      const provider = network.provider;
  
      await provider.send("evm_setNextBlockTimestamp", [timestamp]);
      
      await provider.send("evm_mine");
    }
  

  describe("Launch Campaign", function () {
    it("should launch a campaign successfully", async function () {
      const goal = ethers.parseUnits("100", 18);
      const startAt = Math.floor(Date.now() / 1000) + 1000; // start in the future
      const endAt = startAt + 3600; // end in 1 hour

      await expect(crowdFund.launch(goal, startAt, endAt))
        .to.emit(crowdFund, "Launch")
        .withArgs(1, owner.address, goal, startAt, endAt);
    });

    it("should fail to launch a campaign if start time is in the past", async function () {
      const goal = ethers.parseUnits("100", 18);
      const startAt = Math.floor(Date.now() / 1000) - 1000; // start in the past
      const endAt = startAt + 3600; // end in 1 hour

      await expect(crowdFund.launch(goal, startAt, endAt))
        .to.be.revertedWith("start at < now");
    });

    it("should fail to launch a campaign if end time is before start time", async function () {
      const goal = ethers.parseUnits("100", 18);
      const startAt = Math.floor(Date.now() / 1000) + 1000;
      const endAt = startAt - 1000; // end before start

      await expect(crowdFund.launch(goal, startAt, endAt))
        .to.be.revertedWith("end at < start at");
    });

    it("should fail to launch a campaign if end time is more than 90 days in the future", async function () {
      const goal = ethers.parseUnits("100", 18);
      const startAt = Math.floor(Date.now() / 1000) + 1000;
      const endAt = startAt + 100 * 24 * 60 * 60; // more than 90 days

      await expect(crowdFund.launch(goal, startAt, endAt))
        .to.be.revertedWith("end at > max duration");
    });
  });

  describe("Cancel Campaign", function () {
    it("should cancel a campaign successfully if not started", async function () {
      const goal = ethers.parseUnits("100", 18);
      const startAt = Math.floor(Date.now() / 1000) + 1000;
      const endAt = startAt + 3600;

      await crowdFund.launch(goal, startAt, endAt);
      await expect(crowdFund.cancel(1))
        .to.emit(crowdFund, "Cancel")
        .withArgs(1);
    });

    it("should fail to cancel if not the creator", async function () {
      const goal = ethers.parseUnits("100", 18);
      const startAt = Math.floor(Date.now() / 1000) + 1000;
      const endAt = startAt + 3600;

      await crowdFund.launch(goal, startAt, endAt);
      await expect(crowdFund.connect(addr1).cancel(1))
        .to.be.revertedWith("not creator");
    });
  });

  describe("Pledge", function () {
    it("should allow pledging successfully", async function () {
      const goal = ethers.parseUnits("100", 18);
      const startAt = Math.floor(Date.now() / 1000) + 500;
      const endAt = startAt + 1000;
    
      // Launch the campaign
      await crowdFund.launch(goal, startAt, endAt);
    
      // Increase time to start the campaign
      await ethers.provider.send("evm_increaseTime", [500]);
      await ethers.provider.send("evm_mine");
    
      const pledgeAmount = ethers.parseUnits("50", 18);
    
      // Mint tokens to addr1
      await token.connect(owner).mint(addr1.address, pledgeAmount); // Ensure addr1 has enough tokens
    
      // Approve the crowdFund contract to spend addr1's tokens
      await token.connect(addr1).approve(crowdFund.target, pledgeAmount);
    
      // Pledge tokens
      await expect(crowdFund.connect(addr1).pledge(1, pledgeAmount))
        .to.emit(crowdFund, "Pledge")
        .withArgs(1, addr1.address, pledgeAmount);
    
      // Check balances
      expect(await token.balanceOf(crowdFund.target)).to.equal(pledgeAmount);
      expect(await crowdFund.pledgedAmount(1, addr1.address)).to.equal(pledgeAmount);
    });
    

          it("should fail to pledge if the campaign has not started", async function () {
            const goal = ethers.parseUnits("100", 18);
            const startAt = Math.floor(Date.now() / 1000) + 1000; // Start in the future
            const endAt = startAt + 3600;

            // Launch the campaign
            await crowdFund.launch(goal, startAt, endAt);

            // Mint and approve tokens
            const pledgeAmount = ethers.parseUnits("50", 18);
            await token.connect(owner).mint(addr1.address, pledgeAmount);
            await token.connect(addr1).approve(crowdFund.target, pledgeAmount); // Allow spending

            // Attempt to pledge
            await expect(crowdFund.connect(addr1).pledge(1, pledgeAmount))
                .to.be.revertedWith("not started"); // Ensure it reverts because the campaign has not started
          });
});


describe("Unpledge",function(){
  it("should allow to unpledge successfully", async function () {
    const goal = ethers.parseUnits("100", 18);
    const startAt = Math.floor(Date.now() / 1000) + 1000; // Future start time
    const endAt = startAt + 3600; // End time 1 hour after start

    // Launch the campaign
    await crowdFund.launch(goal, startAt, endAt);

    // Simulate the time passing to reach the campaign start time
    await setCurrentTime(startAt);

    const amount = ethers.parseUnits("50", 18);

    // Mint and approve tokens
    await token.connect(owner).mint(addr1.address, amount);
    await token.connect(addr1).approve(crowdFund.target, amount);

    // Pledge tokens
    await crowdFund.connect(addr1).pledge(1, amount);

    const amt1 = ethers.parseUnits("30", 18);

    // Unpledge tokens
    await expect(crowdFund.connect(addr1).unpledge(1, amt1))
      .to.emit(crowdFund, "Unpledge")
      .withArgs(1, addr1.address, amt1);
  });
  


  it("should fail to unpledge if the campaign has ended", async function () {
    const goal = ethers.parseUnits("100", 18);
    
    // Get the latest block's timestamp
    const latestBlock = await ethers.provider.getBlock("latest");
    const currentTime = latestBlock.timestamp;

    const startAt = currentTime + 1000; // Start in the future
    const endAt = startAt + 3600; // End time 1 hour after start

    // Launch the campaign with dynamic time
    await crowdFund.launch(goal, startAt, endAt);

    // Move the blockchain time to after the campaign start time
    await ethers.provider.send("evm_increaseTime", [startAt - currentTime + 1]);
    await ethers.provider.send("evm_mine", []);

    await token.connect(owner).mint(addr1.address, ethers.parseUnits("50", 18));
    await token.connect(addr1).approve(crowdFund.target, ethers.parseUnits("50", 18));
    await crowdFund.connect(addr1).pledge(1, ethers.parseUnits("50", 18));

    // Move the blockchain time to after the campaign end time
    await ethers.provider.send("evm_increaseTime", [endAt - startAt + 1]);
    await ethers.provider.send("evm_mine", []);

    // Attempt to unpledge after the campaign has ended
    await expect(crowdFund.connect(addr1).unpledge(1, ethers.parseUnits("30", 18))).to.be.revertedWith("ended");
});




});





    describe("Claim", function () {
      it("should allow claiming successfully if goal is met", async function () {
        const goal = ethers.parseUnits("100", 18);
        const currentBlock = await ethers.provider.getBlock("latest");
        const currentTimestamp = currentBlock.timestamp;
    
        const startAt = currentTimestamp + 10; // Set startAt in the near future
        const endAt = startAt + 1000;
    
        await crowdFund.launch(goal, startAt, endAt);
    
        // Move time to after startAt
        await ethers.provider.send("evm_setNextBlockTimestamp", [startAt]);
        await ethers.provider.send("evm_mine");
    
        await token.connect(owner).mint(addr1.address, ethers.parseUnits("150", 18)); // Mint sufficient tokens
        await token.connect(addr1).approve(crowdFund.target, ethers.parseUnits("150", 18));
        
        await crowdFund.connect(addr1).pledge(1, ethers.parseUnits("150", 18)); // Meet the goal
    
        // Move time to after endAt
        await ethers.provider.send("evm_setNextBlockTimestamp", [endAt]);
        await ethers.provider.send("evm_mine");
    
        await expect(crowdFund.claim(1)).to.emit(crowdFund, "Claim").withArgs(1);
      });
    
      it("should fail to claim if goal is not met", async function () {
        const goal = ethers.parseUnits("100", 18);
        const currentBlock = await ethers.provider.getBlock("latest");
        const startAt = currentBlock.timestamp + 10; // Set startAt in the near future
        const endAt = startAt + 1000;
    
        await crowdFund.launch(goal, startAt, endAt);
    
        // Move time to after startAt
        await ethers.provider.send("evm_setNextBlockTimestamp", [startAt]);
        await ethers.provider.send("evm_mine");
    
        await token.connect(owner).mint(addr1.address, ethers.parseUnits("50", 18)); // Not enough to meet the goal
        await token.connect(addr1).approve(crowdFund.target, ethers.parseUnits("50", 18)); 
        await crowdFund.connect(addr1).pledge(1, ethers.parseUnits("50", 18));
    
        // Move time to after endAt
        await ethers.provider.send("evm_setNextBlockTimestamp", [endAt]);
        await ethers.provider.send("evm_mine");
    
        await expect(crowdFund.claim(1)).to.be.revertedWith("pledged < goal");
      });
    });
  
    describe("Refund", function () {
      it("should allow refunding if the goal is not met", async function () {
        const goal = ethers.parseUnits("100", 18);
        const currentBlock = await ethers.provider.getBlock("latest");
        const currentTime = currentBlock.timestamp;
        const startAt = currentTime + 500; // Future start time
        const endAt = startAt + 1000; // End time
    
        await crowdFund.launch(goal, startAt, endAt);
    
        // Increase time to the start time of the campaign
        await ethers.provider.send("evm_increaseTime", [startAt - currentTime]);
        await ethers.provider.send("evm_mine");
    
        await token.connect(owner).mint(addr1.address, ethers.parseUnits("50", 18));
        await token.connect(addr1).approve(crowdFund.target, ethers.parseUnits("50", 18));
        await crowdFund.connect(addr1).pledge(1, ethers.parseUnits("50", 18));
    
        // Increase time to after the campaign end time
        await ethers.provider.send("evm_increaseTime", [endAt - (await ethers.provider.getBlock("latest")).timestamp + 1]);
        await ethers.provider.send("evm_mine");
    
        // Refund should be possible if the goal is not met
        await expect(crowdFund.connect(addr1).refund(1))
          .to.emit(crowdFund, "Refund")
          .withArgs(1, addr1.address, ethers.parseUnits("50", 18));
    
        expect(await token.balanceOf(addr1.address)).to.equal(ethers.parseUnits("50", 18)); // Balance restored
      });
    
      it("should fail to refund if the goal is met", async function () {
        const goal = ethers.parseUnits("100", 18);
        const currentBlock = await ethers.provider.getBlock("latest");
        const currentTime = currentBlock.timestamp;
        const startAt = currentTime + 500; // Future start time
        const endAt = startAt + 1000; // End time
    
        await crowdFund.launch(goal, startAt, endAt);
        await ethers.provider.send("evm_increaseTime", [startAt - currentTime]);
        await ethers.provider.send("evm_mine");
        await token.connect(owner).mint(addr1.address,ethers.parseUnits("150",18));
        // Addr1 pledges more than the goal to meet it
        await token.connect(addr1).approve(crowdFund.target, ethers.parseUnits("150", 18));
        await crowdFund.connect(addr1).pledge(1, ethers.parseUnits("150", 18));
    
        // Fast-forward to after the campaign has ended
        await ethers.provider.send("evm_increaseTime", [endAt - (await ethers.provider.getBlock("latest")).timestamp + 1]);
        await ethers.provider.send("evm_mine");
    
        // Attempt to refund after the goal is met should fail
        await expect(crowdFund.connect(addr1).refund(1)).to.be.revertedWith("pledged >=goal");
      });
    });
  });