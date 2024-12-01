const{expect} = require("chai");
const{ethers} = require("hardhat");

describe("New Contract",function(){
  let CarFactory,carFactory;
  let otherAccount;
   beforeEach(async function(){
    [otherAccount] = await ethers.getSigners();
    CarFactory = await ethers.getContractFactory("CarFactory");
    carFactory = await CarFactory.deploy();
    carFactory.waitForDeployment();
  })

 describe("CarFactory contract", function () {
    it("should create a Car contract and push it to the cars array", async function () {
      await carFactory.create(otherAccount.address, "Toyota");

      const cars = await carFactory.cars(0);
      const carContract = await ethers.getContractAt("Car", cars);

      const model = await carContract.model();
      const owner = await carContract.owner();
      const carAddr = await carContract.carAddr();

      expect(model).to.equal("Toyota");
      expect(owner).to.equal(otherAccount.address);
      expect(carAddr).to.equal(cars);
    });

    it("should create a Car contract with ether and push it to the cars array", async function () {
      const etherAmount = ethers.parseEther("1.0");

      await carFactory.createAndSendEther(otherAccount.address, "Honda", { value: etherAmount });

      const cars = await carFactory.cars(0);
      const carContract = await ethers.getContractAt("Car", cars);

      const model = await carContract.model();
      const owner = await carContract.owner();
      const carAddr = await carContract.carAddr();

      expect(model).to.equal("Honda");
      expect(owner).to.equal(otherAccount.address);
      expect(carAddr).to.equal(cars);

   
      const carBalance = await ethers.provider.getBalance(cars);
      expect(carBalance).to.equal(etherAmount);
    });
  });
});
