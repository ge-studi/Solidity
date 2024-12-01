const { expect } = require("chai");
const { ethers, network } = require("hardhat");
const { keccak256, toUtf8Bytes, concat, parseEther } = require("ethers");

describe("PermitToken", function () {
    let permitToken;
    let admin;
    let user;
    let salt;
    let amount;
    let signature;
    
    // Updated Permit Withdraw TypeHash based on the contract
    const PERMIT_WITHDRAW_TYPEHASH = keccak256(toUtf8Bytes("PermitWithdraw(address user,uint256 amount,bytes32 salt)"));

    function getDomainSeparator(contractAddress, chainId) {
        return keccak256(
            ethers.AbiCoder.defaultAbiCoder().encode(
                ["bytes32", "bytes32", "bytes32", "uint256", "address"],
                [
                    keccak256(toUtf8Bytes("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)")),
                    keccak256(toUtf8Bytes("Valid Sign")),  // Contract name
                    keccak256(toUtf8Bytes("1")),           // Contract version
                    chainId,                               // Chain ID
                    contractAddress                        // Contract address
                ]
            )
        );
    }

    beforeEach(async function () {
        [admin, user] = await ethers.getSigners();

        const PermitToken = await ethers.getContractFactory("PermitToken");
        permitToken = await PermitToken.deploy({ value: parseEther("10") }); // Deploy with some ETH
        await permitToken.waitForDeployment();
        salt = ethers.encodeBytes32String(Math.random().toString());
    });

    it("should deploy with initial ETH balance", async function () {
        const contractBalance = await ethers.provider.getBalance(await permitToken.getAddress());
        expect(contractBalance).to.equal(parseEther("10"));
    });

    it("should allow admin to deposit ETH", async function () {
        const depositAmount = parseEther("1");
        await admin.sendTransaction({
            to: await permitToken.getAddress(),
            value: depositAmount
        });

        const newBalance = await ethers.provider.getBalance(await permitToken.getAddress());
        expect(newBalance).to.equal(parseEther("11"));
    });

    it("should prevent non-admin from depositing", async function () {
        await expect(
            user.sendTransaction({
                to: await permitToken.getAddress(),
                value: parseEther("1")
            })
        ).to.be.revertedWith("Only admin can deposit");
    });


     it("should allow admin to withdraw ETH with a valid signature", async function () {
             const amount = parseEther("0.5");
        
   // Create the signature
   const domain = {
     name: "validate",
     version: "1",
     chainId: await ethers.provider.getNetwork().then((n) => n.chainId),
     verifyingContract: permitToken.target.toString()
   };
  
   const types = {
     PermitWithdraw: [
       { name: "user", type: "address" },
       { name: "amount", type: "uint256" },
       { name: "salt", type: "bytes32" },
     ],
   };
  

   const message = {
     user: await user.getAddress(),
     amount: amount,
     salt: salt,
   };
   

        const sign = await admin.signTypedData(domain, types, message);
     
  
        const initialBalance = await ethers.provider.getBalance(user.address);
          
          console.log("Initial Balance",initialBalance);
          
        // Withdraw with the correct signature
         const tx =await permitToken.connect(user).withdraw(amount, salt, sign);
         const receipt =await tx.wait();

         const gasUsed = receipt.gasUsed;
         const gasPrice = tx.gasPrice;
         const gasCost = gasUsed*gasPrice;
          
          
        const finalBalance = await ethers.provider.getBalance(await user.address);
        console.log("Final Balance",finalBalance);
         const diff = finalBalance - initialBalance +  gasCost;
         console.log("Print difference",diff);
        expect(diff).to.equal(amount);
     });


    it("Should revert if the same salt is reused", async () => {
        const amount = parseEther("0.5");
        // salt = keccak256(toUtf8Bytes("salt1"));
        // Admin deposits 1 ETH
       await admin.sendTransaction({ to: permitToken.target, value: parseEther("1") });
            console.log("bbhhh",await ethers.provider.getBalance(permitToken.target));
        // Create the signature
        const domain = {
          name: "validate",
          version: "1",
          chainId: await ethers.provider.getNetwork().then((n) => n.chainId),
          verifyingContract: permitToken.target.toString()
        };
        console.log("ddddd",await ethers.provider.getNetwork().then((n) => n.chainId));
    
        const types = {
          PermitWithdraw: [
            { name: "user", type: "address" },
            { name: "amount", type: "uint256" },
            { name: "salt", type: "bytes32" },
          ],
        };
        console.log("jjjjj");
    
        const message = {
          user: await user.getAddress(),
          amount: amount,
          salt: salt,
        };
        console.log("kkkk")
    
        const sign = await admin.signTypedData(domain, types, message);
          console.log("iiii",sign);
        // First successful withdrawal
        await permitToken.connect(user).withdraw(amount, salt, sign);
            console.log("hhhhh")
        // Try again with the same salt (should revert)
        await expect(permitToken.connect(user).withdraw(amount, salt, sign))
          .to.be.revertedWith("Signature already used");
          
      });


    it("should revert if contract balance is insufficient", async function () {
        amount = parseEther("100"); // More than available

        salt = keccak256(toUtf8Bytes("salt1"));

        // Get the chain ID from the provider
        const { chainId } = await ethers.provider.getNetwork();
        const domainSeparator = getDomainSeparator(await permitToken.getAddress(), chainId);

        // Hash the permit withdrawal structure
        const structHash = keccak256(
            ethers.AbiCoder.defaultAbiCoder().encode(
                ["bytes32", "address", "uint256", "bytes32"],
                [PERMIT_WITHDRAW_TYPEHASH, user.address, amount, salt]
            )
        );

        // Create the full EIP712 hash
        const hash = keccak256(
            concat([toUtf8Bytes("\x19\x01"), domainSeparator, structHash])
        );

        // Admin signs the hash
        signature = await admin.signMessage(ethers.getBytes(hash));

        await expect(
            permitToken.connect(user).withdraw(amount, salt, signature)
        ).to.be.revertedWith("Insufficient balance");
    });
});

