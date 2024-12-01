const {expect} = require("chai");
const{ethers} = require("hardhat");

describe("Structs",function(){
    let Structs,structsContract;
    let owner;

    before(async function(){
        [owner] = await ethers.getSigners();
        Structs= await ethers.getContractFactory("Structs");
        structsContract= await Structs.deploy();
        await structsContract.waitForDeployment();
    });

    it("Should create a new todo item",async function(){
        const todoText ="Learning solidity";
        await structsContract.create(todoText);

        const todo =await structsContract.get(0);
        expect(todo.text).to.equal(todoText);
        expect(todo.completed).to.equal(false);
    });

    it("Should create multiple todo items",async function(){
        const todoText1 = "Learning solidity";
        const todoText2 = "Building a project";

        await structsContract.create(todoText1);
        await structsContract.create(todoText2);

        const todo1 = await structsContract.get(0);
        expect(todo1.text).to.equal(todoText1);
        expect(todo1.completed).to.equal(false);
        
        const todo2 = await structsContract.get(1);
        expect(todo2.text).to.equal(todoText1);
       
        
        const todo3 = await structsContract.get(2);
        expect(todo3.text).to.equal(todoText1);

    });

    it("Should update the text of an existing item",async function(){
        const todoText = "Learning Solidity";
        await structsContract.create(todoText);

        const newText ="Learn Bitcoin";
        await structsContract.Update(0,newText);

        const todo =await structsContract.get(0);
        expect(todo.text).to.equal(newText);
        expect(todo.completed).to.equal(false);
    });

    it("Should toggle completion status",async function(){
        const todoText ="Learning Solidity";
        await structsContract.create(todoText);

        let todo =await structsContract.get(0);
        expect(todo.completed).to.equal(false);

        await structsContract.UpdateCompleted(0);
        todo = await structsContract.get(0);
        expect(todo.completed).to.equal(true);

        await structsContract.UpdateCompleted(0);
        todo = await structsContract.get(0);
        expect(todo.completed).to.equal(false);
    });
});