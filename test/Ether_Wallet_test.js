const{expect} = require("chai");
const{ethers} = require("hardhat");

describe("Ether Wallet Contract",function(){
    let EtherWallet;
     let addr1;
    beforeEach(async function(){
        [addr1] = await ethers.getSigners();
        EtherWallet=await ethers.deployContract("EtherWallet")
       
    });

    
    it("Should get ether wallet function correctly",async function(){
    
     
    //console.log("Address of addr1", await ethers.provider.getBalance(EtherWallet.target));
    
   
    //  it("Should withdraw amount correctly",async function(){
    //     console.log(EtherWallet.target);
    //     console.log(await ethers.provider.getBalance(EtherWallet.target));
    //  });

    
    //const nativeaddr1 = await ethers.provider.getBalance(addr1.address);
    
    //const nativeaddr2 = await ethers.provider.getBalance(addr2.address);
    

        await addr1.sendTransaction({
            to:EtherWallet.target,
            value:ethers.parseUnits("100",18),

 });
     //console.log("Address of addr2 after",await ethers.provider.getBalance(EtherWallet.target));
              
    });
   
});

