const {expect} = require("chai");
const{ethers} = require("hardhat");

describe("Primitive",function(){
    let Primitive,primitive;

    before(async function(){
        Primitive = await ethers.getContractFactory("Primitive");
        primitive= await Primitive.deploy();
        await primitive.waitForDeployment();
    });
    it("Should initialize boolean to true",async function(){
        expect(await primitive.boo()).to.equal(true);
    });

    it("Should initialize uint8 to one",async function(){
        expect(await primitive.u8()).to.equal(1);
    });

    it("Should initialize uint256 to 456",async function(){
        expect(await primitive.u256()).to.equal(456);
    });

    it("Should initialize u to 123",async function(){
        expect(await primitive.u()).to.equal(123);
    });

    it("Should initialize int8 to minus one",async function(){
        expect(await primitive.i8()).to.equal(-1);
    });

    it("Should initialize int256 to 456",async function(){
        expect(await primitive.i256()).to.equal(456);
    });

    it("Should initialize i to minus 123",async function(){
        expect(await primitive.i()).to.equal(-123);
    });

    it("Should initialize minInt to correct minimum value",async function(){
      const value = -(2n ** 255n);
        expect(await primitive.minInt()).to.equal(BigInt(value));
});
    it("Should initialize maxInt to correct maximum value",async function(){
    const value= 2n ** 255n - 1n;
     expect(await primitive.maxInt()).to.equal(BigInt(value));
});

it("Should initialize address to correct value",async function(){
    expect(await primitive.addr()).to.equal("0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c");
    });

it("Should initialize bytes1 to correct value of a",async function(){
  expect(await  primitive.a()).to.equal("0xb5");
});

it("Should initialize bytes1 to correct value of b",async function(){
    expect(await  primitive.b()).to.equal("0x56");
  });

  it("Should have default boolean value as false",async function(){
    expect(await  primitive.defaultBoo()).to.equal(false);
  });

  it("Should have default uint256 value value as 0",async function(){
    expect(await  primitive.defaultUint()).to.equal(0);
  });

  it("Should have default int256 value as 0",async function(){
    expect(await  primitive.defaultInt()).to.equal(0);
  });

  it("Should have default address value as 0 address",async function(){
    expect(await  primitive.defaultAddr()).to.equal("0x0000000000000000000000000000000000000000");
  });
});