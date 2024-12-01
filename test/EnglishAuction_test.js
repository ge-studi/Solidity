const{expect}=require("chai");
const{ethers}=require("hardhat");

describe("English Auction",function(){
    let auction;
    let seller;
    let bidder1,bidder2;
    const nft_id =1;
    const bid_starting = ethers.parseEther("1");

    let nft;
    beforeEach(async function(){
        const NFT = await ethers.getContractFactory("MyToken721");
        nft = await NFT.deploy();
        await nft.waitForDeployment();

        [seller,bidder1,bidder2] = await ethers.getSigners();
        await nft.mint(seller.address);
        //console.log("Minting",nft.mint);


        const EnglishAuction = await ethers.getContractFactory("EnglishAuction");
        auction = await EnglishAuction.deploy(nft.getAddress(), nft_id, bid_starting);
        auction.waitForDeployment();
    });
    it("Should initialize parameters correctly",async function(){
      expect(await auction.nft()).to.equal(await nft.getAddress());
      expect(await auction.nftId()).to.equal(await nft_id);
      expect(await auction.seller()).to.equal(await seller.getAddress());
      expect(await auction.highestBid()).to.equal(await bid_starting);
    });
    it("Should start bidding correctly",async function(){
      await nft.connect(seller).approve(auction.getAddress(),nft_id);
      await expect(auction.connect(seller).start())
      .to.emit(auction,"Start");

    expect(await auction.started()).to.equal(true);
    expect(await auction.endAt()).to.be.gt(0);
    expect(await nft.ownerOf(nft_id)).to.equal(await auction.getAddress());
    });
    it("Should not allow non auction to start the bid",async function(){
        await expect(auction.connect(bidder1).start()).to.be.revertedWith("Not seller");
    });

    it("Should allow bids higher than starting bid",async function(){
        await nft.connect(seller).approve(auction.getAddress(),nft_id);
        await auction.connect(seller).start();
        const bidAmount = ethers.parseEther("2");

        expect(await auction.connect(bidder1).bid({value:bidAmount})).to.emit(auction,"Bid").withArgs(bidder1.getAddress(),bidAmount);
        expect(await auction.highestBid()).to.equal(await bidAmount);
        expect(await auction.highestBidder()).to.equal(await bidder1.getAddress());

    });

    it("Should reject bids lower than starting bid",async function(){
        await nft.connect(seller).approve(auction.getAddress(),nft_id);
        await auction.connect(seller).start();
        const lowBid = ethers.parseEther("0.5");

        await expect(auction.connect(bidder1).bid({value:lowBid})).to.be.revertedWith("msg.value < highestBid");
    });

    it("Should allow the previous bidder to withdraw their bid", async function () {
        await nft.connect(seller).approve(auction.getAddress(), nft_id);
        await auction.connect(seller).start();

        await auction.connect(bidder1).bid({ value: ethers.parseEther("2") });

        await auction.connect(bidder2).bid({ value: ethers.parseEther("3") });
    
        const bidder1BalanceBefore = await ethers.provider.getBalance(bidder1.getAddress());
        await expect(auction.connect(bidder1).withdraw())
          .to.emit(auction, "Withdraw").withArgs(bidder1.getAddress(), ethers.parseEther("2"));
    
        const bidder1BalanceAfter = await ethers.provider.getBalance(bidder1.getAddress());
        expect(bidder1BalanceAfter).to.be.gt(bidder1BalanceBefore);
      });
    
      it("Should end the auction and transfer NFT and funds correctly", async function () {
        await nft.connect(seller).approve(auction.getAddress(), nft_id);
        await auction.connect(seller).start();

        await auction.connect(bidder1).bid({value: ethers.parseEther("2")});
        await ethers.provider.send("evm_increaseTime", [61]);
        await ethers.provider.send("evm_mine");
    
        const sellerBalanceBefore = await ethers.provider.getBalance(seller.getAddress());
        await expect(auction.connect(seller).end())
          .to.emit(auction, "End").withArgs(bidder1.getAddress(), ethers.parseEther("2"));
    
        const sellerBalanceAfter = await ethers.provider.getBalance(seller.getAddress());
        expect(await nft.ownerOf(nft_id)).to.equal(await bidder1.getAddress());
        expect(sellerBalanceAfter).to.be.gt(sellerBalanceBefore);
      });
    
      it("Should return the NFT to the seller if there are no bids", async function () {
        await nft.connect(seller).approve(auction.getAddress(), nft_id);
        await auction.connect(seller).start();
 
        await ethers.provider.send("evm_increaseTime", [61]);
        await ethers.provider.send("evm_mine");
    
        await expect(auction.connect(seller).end())
          .to.emit(auction,"End").withArgs(ethers.ZeroAddress, ethers.parseEther("1"));
    
        expect(await nft.ownerOf(nft_id)).to.equal(await seller.getAddress());
      });
    });
