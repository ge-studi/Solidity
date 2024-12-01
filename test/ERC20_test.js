const{ethers}=require("hardhat");
const{expect} = require("chai");



describe("MyToken",function(){
 let MyToken, myToken;
 let owner, addr1,addr2;
 let zeroAddress = "0x0000000000000000000000000000000000000000";

 beforeEach(async function () {
  [owner, addr1, addr2] = await ethers.getSigners();
  const MyTokenFactory = await ethers.getContractFactory("MyToken");
  myToken = await MyTokenFactory.deploy("MyToken", "MTK");
  await myToken.waitForDeployment();
});


 it("Should deploy with the correct name and symbol", async function () {
  expect(await myToken.name()).to.equal("MyToken");
  expect(await myToken.symbol()).to.equal("MTK");
});

it("Should mint 1 million tokens to deployer",async function(){
  const oneMillionToken = 1000000n;
  
  const balance = BigInt(await myToken.balanceOf(owner.address));
  expect(balance).to.equal(oneMillionToken* 10n**18n);
});


it("Should transfer tokens correctly",async function(){
  const amount = 100;
  await myToken.transfer(addr1.address,amount);
  expect(await myToken.balanceOf(addr1.address)).to.equal(amount);
});

it("Should transfer tokens from address",async function(){
  const amountApproved=  100n;
  const amountTransfer = 50n;
 
  
  
  // await myToken.mint(owner.address, amountApproved);
  
  await myToken.connect(owner).approve(addr1.address,amountApproved);
 
  await expect(myToken.connect(addr1).transferFrom(owner.address,addr2.address,amountTransfer))
                     .to.emit(myToken,"Transfer").withArgs(owner.address,addr2.address,amountTransfer);
                     
                     
//check owner's balance
const oneMillionToken = 1000000n;
  const ownerBalance = await myToken.balanceOf(owner.address);
  //console.log("HI", ownerBalance);
  expect(ownerBalance).to.equal((oneMillionToken* 10n**18n) - amountTransfer);

  //check addr2 balance
  const addr2Balance = await myToken.balanceOf(addr2.address);
  expect(addr2Balance).to.equal(amountTransfer);
   
  //check addr1 balance
  const allowance = await myToken.allowance(owner.address,addr1.address);
  expect(allowance).to.equal(amountApproved - amountTransfer);
});


it("Should revert on transfer to zero address", async function() {
  const amount = 100;
  await expect(myToken.transfer(zeroAddress, amount))
    .to.be.revertedWithCustomError(myToken,"ERC20InvalidReceiver");
});


it("Should emit transfer event on successful transfer",async function(){
  await expect(myToken.transfer (addr1.address,100)).to.emit(myToken,"Transfer").withArgs(owner.address,addr1.address,100);
});

it("Should mint tokens to an address", async function () {
  const amount = 100;
  await myToken.mint(addr1.address, amount);
  expect(await myToken.balanceOf(addr1.address)).to.equal(amount);
});

it("Should burn tokens from specified address", async function(){
  const amount=100;
  const amount1=50;
  await myToken.mint(addr1.address, amount);
  await myToken.burn(addr1.address, amount1);
  expect(await myToken.balanceOf(addr1.address)).to.equal(amount1);
});


it("Should approve and transfer correctly",async function(){
  const amount =100;
  await myToken.approve(addr1.address,amount);
  await myToken.connect(addr1).transferFrom(owner.address,addr2.address,amount);
  expect(await myToken.balanceOf(addr2.address)).to.equal(amount);
});


});


