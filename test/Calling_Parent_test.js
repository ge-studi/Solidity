const{expect}=require("chai");
const{ethers}=require("hardhat");


describe("Calling Parent Contract",function(){
  let _A,_B,_C,_D;
  let contractA,contractB,contractC,contractD;

    beforeEach(async function(){
        _A = await ethers.getContractFactory("_A");
        _B = await ethers.getContractFactory("_B");
        _C = await ethers.getContractFactory("_C");
        _D = await ethers.getContractFactory("_D");
       
        contractA = await _A.deploy();
        contractB = await _B.deploy();
        contractC = await _C.deploy()
        contractD = await _D.deploy()
        });

        it("Should emit correct logs for foo in contract _A",async function(){
            expect(await contractA.foo()).to.emit(contractA,"Log").withArgs("_A.foo called");
        });

        it("Should emit correct logs for bar in contract _A",async function(){
            expect(await contractA.bar()).to.emit(contractA,"Log").withArgs("_A.bar called");
        });
        it("Should emit correct logs for foo in contract _B",async function(){
            expect(await contractB.foo()).to.emit(contractB,"Log").withArgs("_B.foo called").to.emit(contractA,"Log").
            withArgs("_A.foo called");
        });
        it("Should emit correct logs for bar in contract _B",async function(){
            expect(await contractB.bar()).to.emit(contractB,"Log").withArgs("_B.bar called").to.emit(contractB,"Log").
            withArgs("_A.bar called");
        });

        it("Should emit correct logs for foo in contract _C", async function () {
            await expect(contractC.foo())
              .to.emit(contractC, 'Log')
              .withArgs('_C.foo called')
              .to.emit(contractC, 'Log')
              .withArgs('_A.foo called');
          });
        
          it("Should emit correct logs for bar in contract _C", async function () {
            await expect(contractC.bar())
              .to.emit(contractC, 'Log')
              .withArgs('_C.bar called')
              .to.emit(contractC, 'Log')
              .withArgs('_A.bar called');
          });
        
          it("Should emit correct logs for foo in contract _D", async function () {
            await expect(contractD.foo())
              .to.emit(contractD, 'Log')
              .withArgs('_C.foo called')
              .to.emit(contractD, 'Log')
              .withArgs('_A.foo called');
          });
        
          it("Should emit correct logs for bar in contract _D", async function () {
            await expect(contractD.bar())
              .to.emit(contractD, 'Log')
              .withArgs('_C.bar called')
              .to.emit(contractD, 'Log')
              .withArgs('_B.bar called')
              .to.emit(contractD, 'Log')
              .withArgs('_A.bar called');
          });


    
});