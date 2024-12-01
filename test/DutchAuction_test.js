const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Dutch Auction", function () {
    let dutchAuction;
    let nft;
    const nftId1 = 1; // NFT token ID
    let seller;
    let buyer;

    // Set initial values for the auction
    const startingPrice = ethers.parseEther("5"); // 5 ETH
    const discountRate = ethers.parseEther("0.00000001"); // Small discount rate per second

    beforeEach(async function () {
        // Deploy the NFT contract and mint an NFT to the seller
        const NFT = await ethers.getContractFactory("MyToken721");
        nft = await NFT.deploy();
        await nft.waitForDeployment();

        [seller, buyer] = await ethers.getSigners();
        await nft.mint(seller.address); // Mint NFT to seller

        // Deploy Dutch Auction contract with the starting price and discount rate
        const DutchAuction = await ethers.getContractFactory("DutchAuction");
        dutchAuction = await DutchAuction.deploy(startingPrice, discountRate, nft.getAddress(), nftId1);
        await dutchAuction.waitForDeployment();

        // Approve the Dutch Auction contract to transfer the NFT
        await nft.connect(seller).approve(dutchAuction.getAddress(), nftId1);
    });

    it("should initialize parameters correctly", async function () {
        expect(await dutchAuction.nftId1()).to.equal(nftId1);
        expect(await dutchAuction.seller1()).to.equal(await seller.getAddress());
        expect(await dutchAuction.startingPrice()).to.equal(startingPrice);
        expect(await dutchAuction.discountRate()).to.equal(discountRate);
    });

    it("should calculate price correctly", async function () {
        // Fetch the auction's start time
        const startAt = BigInt(await dutchAuction.StartAt());
        
        // Get the current block's timestamp
        const currentBlock = await ethers.provider.getBlock('latest');
        const currentTime = BigInt(currentBlock.timestamp);
        
        // Calculate time elapsed since the auction started
        const timeElapsed = currentTime - startAt;
    
        // Fetch starting price and discount rate, ensuring they're BigInt
        const startingPrice = BigInt(await dutchAuction.startingPrice());
        const discountRate = BigInt(await dutchAuction.discountRate());
    
        // Calculate the expected price based on time elapsed
        const expectedPrice = startingPrice - (discountRate * timeElapsed);
    
        // Get the actual price from the contract
        const actualPrice = BigInt(await dutchAuction.getPrice());
    
        // Compare the expected and actual price, ensuring both are BigInt
        expect(actualPrice).to.equal(expectedPrice);
    });
    

    it("should allow buyer to purchase NFT", async function () {
        await ethers.provider.send("evm_increaseTime", [24 * 60 * 60]); // Fast forward 1 day
        await ethers.provider.send("evm_mine");

        const price = await dutchAuction.getPrice(); // Get current price

        await dutchAuction.connect(buyer).buy({ value: price }); // Buyer purchases NFT

        expect(await nft.ownerOf(nftId1)).to.equal(await buyer.getAddress()); // Check NFT ownership
    });

    it("should refund excess ETH", async function () {
        await ethers.provider.send("evm_increaseTime", [24 * 60 * 60]); // Fast forward 1 day
        await ethers.provider.send("evm_mine");

        const price = await dutchAuction.getPrice();
        const excessEth = ethers.parseEther("9.999"); // Buyer sends more than required

        const initialBalance = await ethers.provider.getBalance(buyer.address);

        // Buyer purchases NFT
        const tx = await dutchAuction.connect(buyer).buy({ value: excessEth });
        const receipt = await tx.wait();

        // Calculate gas cost
        const gasCost = receipt.gasUsed * tx.gasPrice;
        const finalBalance = await ethers.provider.getBalance(buyer.address);

        // Check that the ETH spent is close to the price + gas cost
        const spentEth = initialBalance - finalBalance;
        expect(spentEth).to.be.closeTo(price + gasCost, ethers.parseEther("0.0001"));

        // Check that excess ETH is refunded
        expect(finalBalance).to.be.above(initialBalance - price - gasCost);
    });

    it("should not allow buying after auction expiration", async function () {
        await ethers.provider.send("evm_increaseTime", [8 * 24 * 60 * 60]); // Fast forward 8 days (auction expired)
        await ethers.provider.send("evm_mine");

        const price = await dutchAuction.getPrice();

        await expect(
            dutchAuction.connect(buyer).buy({ value: price })
        ).to.be.revertedWith("auction expired"); // Expect revert if auction expired
    });

    it("should revert if buyer sends less ETH than the price", async function () {
        await ethers.provider.send("evm_increaseTime", [24 * 60 * 60]); // Fast forward 1 day
        await ethers.provider.send("evm_mine");

        const price = await dutchAuction.getPrice();
        const insufficientAmount = price - ethers.parseEther("0.1"); // Buyer sends less than required

        await expect(
            dutchAuction.connect(buyer).buy({ value: insufficientAmount })
        ).to.be.revertedWith("ETH < price"); // Expect revert if insufficient ETH is sent
    });
});
