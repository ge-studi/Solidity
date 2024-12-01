const{expect} = require("chai");
const {ethers}=require("hardhat");
describe("ERC721 Contract",async function(){
    let MyToken721;
    let initialMint =[];
    let signers;
    let tx;
    let tokenId;

    beforeEach(async function(){

        signers = await ethers.getSigners();
        initialMint = [];
        contractOwner = signers[0];
        collector = signers[1]; 
        anotherOwner = signers[2];
       MyToken721 = await ethers.deployContract("MyToken721");
      
    });

    it("Should deploy with correct name and symbol",async function(){
         expect(await MyToken721.name()).to.equal("Geetanjali");
         expect(await MyToken721.symbol()).to.equal("MTk");
    });

    it("Should be able to mint tokens for minter role",async function(){
        initialMintAmount =10;
        for(let i=0;i<initialMint;i++){
          tx =await MyToken721.safeMint(signers[0].getAddress(),i.toString());
          await tx.wait();
          initialMint.push(i.toString());
        }
        
         });  
        //  function approve(address to, uint256 tokenId) public virtual {
        //     _approve(to, tokenId, _msgSender());
        // }
         it("Should approve an operator wallet to spend owner NFT",async function(){
            // console.log('Initial Mint:', this.initialMint);
            //   tokenId = this.initialMint[0];
              
            //   await MyToken721.approve(this.collector,tokenId);
            //   expect(await MyToken721.ownerOf(tokenId)).to.equal(this.collector);
            tokenId =0;
            await MyToken721.safeMint(contractOwner.getAddress(),tokenId);
              
            await expect(MyToken721.connect(contractOwner).approve(collector.getAddress(),tokenId))
                        .to.emit(MyToken721, "Approval")
                        .withArgs(contractOwner.getAddress(),collector.getAddress(),tokenId);

                        expect(await MyToken721.getApproved(tokenId)).to.equal(await collector.getAddress());
         });

         it("Should allow user to revoke approval",async function(){
            tokenId =2;
            await MyToken721.safeMint(contractOwner.getAddress(),tokenId);
              
            await expect(MyToken721.connect(contractOwner).approve(ethers.ZeroAddress,tokenId))
                        .to.emit(MyToken721, "Approval")
                        .withArgs(contractOwner.getAddress(),ethers.ZeroAddress,tokenId);

                        expect(await MyToken721.getApproved(tokenId)).to.equal(await ethers.ZeroAddress);
         });

         it("Should allow user to transfer tokens correctly",async function(){
            tokenId = 0;
            await MyToken721.safeMint(contractOwner.getAddress(),tokenId);
              
            //   await MyToken721.transferFrom(contractOwner.getAddress(),collector.getAddress(),tokenId);
            await MyToken721.connect(contractOwner).transferFrom(contractOwner.getAddress(),collector.getAddress(),tokenId);

             expect (await MyToken721.ownerOf(tokenId)).to.equal(await collector.getAddress());
         });

         it("Should revert when user transfers token to zero address",async function(){
            tokenId = 2;
            await MyToken721.safeMint(contractOwner.getAddress(),tokenId);
              
            //   await MyToken721.transferFrom(contractOwner.getAddress(),collector.getAddress(),tokenId);
            // await MyToken721.connect(contractOwner).transferFrom(contractOwner.getAddress(),ethers.ZeroAddress,tokenId);

              expect (MyToken721.transferFrom(contractOwner.getAddress(),ethers.ZeroAddress,tokenId)).
                                        to.be.revertedWithCustomError(MyToken721,"ERC721InvalidReceiver");
         });

         it("Should revert if owner changed",async function(){
             tokenId = 3;
             await MyToken721.safeMint(contractOwner.getAddress(),tokenId);           

             expect (MyToken721.transferFrom(anotherOwner.getAddress(),contractOwner.getAddress(),tokenId)).to.
             revertedWithCustomError(MyToken721,"ERC721IncorrectOwner");
         }) ;

         it("Should return owner of token correctly",async function(){
              
                await MyToken721.safeMint(contractOwner.getAddress(),1);   
                expect (await MyToken721.testOwnerOf(1)).to.equal(await contractOwner.getAddress());
         });
         it("Should not revert if token does not exist",async function(){
          await MyToken721.safeMint(contractOwner.getAddress(),0);   
          expect (await MyToken721.testOwnerOf(0)).to.equal(await contractOwner.getAddress()).not.be.revertedWith("Token doesn't exist");
         });

       it("Should return approved address of tokenId",async function(){
             await MyToken721.safeMint(contractOwner.getAddress(),1);
             await MyToken721.connect(contractOwner).approve(collector.getAddress(),1);
             expect(await MyToken721.getApprovedOf(1)).to.equal(await collector.getAddress());
       });
       it("Should check if spender has zero address",async function(){
        const tokenId = 1;
        await MyToken721.safeMint(contractOwner.getAddress(),tokenId);
          await MyToken721.connect(contractOwner).approve(ethers.ZeroAddress,tokenId);
          expect(await MyToken721.isAuthorizedOf(contractOwner,ethers.ZeroAddress,tokenId)).to.be.false;
       });
        it("Should return if spender is allowed to manage tokenId",async function(){
          const tokenId = 1;
          await MyToken721.safeMint(contractOwner.getAddress(),tokenId);
          await MyToken721.connect(contractOwner).approve(collector.getAddress(),tokenId);
          expect(await MyToken721.isAuthorizedOf(contractOwner,collector,tokenId)).to.be.true;
        });
        it("should return if spender is allowed to manage owner's token",async function(){
          const tokenId =1;
          await MyToken721.safeMint(collector.getAddress(),tokenId);
          await MyToken721.connect(collector).approve(anotherOwner.getAddress(),tokenId);
          expect(await MyToken721.isAuthorizedOf(collector,anotherOwner,tokenId)).to.be.true;
        });
        it("Should check if balance is increased",async function(){
          const increaseAmount = 100;
          const initialBalance = await MyToken721.balanceOf(contractOwner.getAddress());
          expect (initialBalance).to.equal(0);
          await MyToken721.increaseBalanceOf(contractOwner.getAddress(),increaseAmount);
          const finalBalance = await MyToken721.balanceOf(contractOwner.getAddress());
          expect(finalBalance).to.equal(increaseAmount);
});
       it("Should check authorization correctly",async function(){
        const tokenId =1;
        await MyToken721.safeMint(contractOwner.getAddress(),tokenId);
          await MyToken721.connect(contractOwner).approve(anotherOwner.getAddress(), tokenId);

      
          await MyToken721.connect(contractOwner).updateOf(collector.getAddress(), tokenId, ethers.ZeroAddress);

    
           expect(await MyToken721.getApproved(tokenId)).to.equal(ethers.ZeroAddress);
  });
            it("Should update token ownership", async function () {
              const tokenId =1;
                await MyToken721.safeMint(collector.getAddress(),tokenId);
              await MyToken721.connect(contractOwner).updateOf(collector.getAddress(), tokenId, ethers.ZeroAddress);

              
              expect(await MyToken721.ownerOf(tokenId)).to.equal(await collector.getAddress());
    });

            it("Should check authorization when 'auth' is not zero", async function () {
              const tokenId =1;
                await MyToken721.safeMint(collector.getAddress(),tokenId);
              await expect(
                MyToken721.connect(contractOwner).updateOf(collector.getAddress(), tokenId, anotherOwner.getAddress())).be.reverted;
            });
  
                  it("Should update balances correctly after transfer", async function () {
                    const tokenId =1;
                await MyToken721.safeMint(contractOwner.getAddress(),tokenId);
                    const initialBalanceFrom = await MyToken721.balanceOf(contractOwner.getAddress());
                    const initialBalanceTo = await MyToken721.balanceOf(collector.getAddress());
                
                    await MyToken721.connect(contractOwner).updateOf(collector.getAddress(), tokenId, ethers.ZeroAddress);
                
                    const finalBalanceFrom = await MyToken721.balanceOf(contractOwner.getAddress());
                    const finalBalanceTo = await MyToken721.balanceOf(collector.getAddress());
                
                   
                    expect(finalBalanceFrom).to.equal(initialBalanceFrom - 1n);
                    expect(finalBalanceTo).to.equal(initialBalanceTo + 1n);
                  });
                
                  it("Should emit Transfer event after token transfer", async function () {
                    const tokenId =1;
                await MyToken721.safeMint(contractOwner.getAddress(),tokenId);
                    await expect(MyToken721.connect(contractOwner).updateOf(collector.getAddress(), tokenId, ethers.ZeroAddress))
                      .to.emit(MyToken721, "Transfer")
                      .withArgs(contractOwner.getAddress(), collector.getAddress(), tokenId);
                  });
                    it("Should burn tokens correctly",async function(){
                      const tokenId =1;
                      await MyToken721.safeMint(contractOwner.getAddress(),tokenId);
                      await expect(MyToken721.connect(contractOwner).burnOf(tokenId))
                      .to.emit(MyToken721,"Transfer")
                      .withArgs(contractOwner.getAddress(), ethers.ZeroAddress, tokenId);

                      await expect(MyToken721.ownerOf(tokenId)).to.be.revertedWithCustomError(MyToken721,"ERC721NonexistentToken");
                    });
                  it("Should revert if tokens not burnt correctly",async function(){
                    
                    await expect(MyToken721.burnOf(999)).to.be.revertedWithCustomError(MyToken721,"ERC721NonexistentToken");
                  });

                  it("Should approve the token with authorization and emit event", async function () {
                    const tokenId = 1;
                
                    
                    await MyToken721.safeMint(contractOwner.getAddress(), tokenId);
                    await expect(MyToken721.connect(contractOwner).approveOf(collector.getAddress(), tokenId, contractOwner.getAddress(), true))
                        .to.emit(MyToken721, "Approval")
                        .withArgs(contractOwner.getAddress(), collector.getAddress(), tokenId);
                
                    
                    expect(await MyToken721.getApproved(tokenId)).to.equal( await collector.getAddress());
                });

                it("Should revert if unauthorized address tries to approve",async function(){
                  const tokenId = 1;
                
                    
                    await MyToken721.safeMint(contractOwner.getAddress(), tokenId);

                                    await expect(MyToken721.connect(anotherOwner).approveOf(collector.getAddress(), tokenId, anotherOwner.getAddress(), true))
                                    .to.be.revertedWithCustomError(MyToken721, "ERC721InvalidApprover");

                                expect(await MyToken721.getApproved(tokenId)).to.equal(ethers.ZeroAddress);
                });

                it("Should approve the token without emitting an event when emitEvent is false", async function () {
                  const tokenId = 1;
              
                  await MyToken721.safeMint(contractOwner.address, tokenId);

                  await expect(MyToken721.connect(contractOwner).approveOf(collector.getAddress(), tokenId, contractOwner.getAddress(), false))
                      .to.not.emit(MyToken721, "Approval");

                  expect(await MyToken721.getApproved(tokenId)).to.equal(await collector.getAddress());
              });
              
              it("Should approve the token without checking authorization if auth is address(0)", async function () {
                const tokenId = 1;
            
                await MyToken721.safeMint(contractOwner.getAddress(), tokenId);
                await MyToken721.connect(contractOwner).approveOf(collector.getAddress(), tokenId, ethers.ZeroAddress, true);
                expect(await MyToken721.getApproved(tokenId)).to.equal(await collector.getAddress());
            });

            it("Should revert if tokenId doesn't have current owner",async function(){
              const tokenId = 1;
                await expect(MyToken721.requireOwnedOf(tokenId))
                              .to.be.revertedWithCustomError(MyToken721, "ERC721NonexistentToken");

            });                         
            it("should return the correct owner for an existing token", async function () {
              const tokenId = 1; 
              await MyToken721.safeMint(collector.getAddress(), tokenId);
            expect(await MyToken721.requireOwnedOf(tokenId)).to.equal(await collector.getAddress());
            });
                
  });
