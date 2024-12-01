const{expect}=require("chai");
const{ethers}=require("hardhat");


describe("Functions",function(){
    let Functions,functions;
   
    before(async function(){
       Functions = await ethers.getContractFactory("Functions");
       functions = await Functions.deploy();
       await functions.waitForDeployment();
    });

    it("Should return multiple values",async function(){
         const[val1,val2,val3] = await functions.return_multiple();
         expect(val1).to.equal(89);
         expect(val2).to.equal(true);
         expect(val3).to.equal(789);
    });

    it("Should return named values",async function(){
        const{val1,val2,val3} = await functions.returnNamedValues();
         expect(val1).to.equal(890);
         expect(val2).to.equal(false);
         expect(val3).to.equal(567);
    });

    it("Should return parameterized values",async function(){
        const{val1,val2,val3} = await functions.returnParameterizedValues();
        expect(val1).to.equal(890);
        expect(val2).to.equal(false);
        expect(val3).to.equal(567);
   });

   it("Should fail if incorrect multiple values returned",async function(){
    const{val1,val2,val3} = await functions.return_multiple();
    expect(val1).to.not.equal(100);
    expect(val2).to.not.equal(false);
    expect(val3).to.not.equal(500);
   });

   it("Should not return default values",async function(){
    const{val1,val2,val3} = await functions.return_multiple();
    expect(val1).to.not.equal(0);
    expect(val2).to.not.equal(false);
    expect(val3).to.not.equal(0);
   });
    });


