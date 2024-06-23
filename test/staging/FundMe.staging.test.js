const {deployments, ethers, getNamedAccounts, network} =require("hardhat");
const {developmentChains} = require("../../helper-hardahat-config");
const { assert } = require("chai");
developmentChains.includes(network.name)
?describe.skip
: describe("FundMe",()=>{
  let fundMe,
      deployer;
      const sendValue=ethers.parseEther("1");
      beforeEach(async function () {
        // deploy our fundme contract 
        // using hardhat deploy
        // const accounts = await ethers.getSigners()
        deployer = await ethers.provider.getSigner();
        fundMe = await ethers.getContractAt("FundMe", deployer); // most recently deployed fundme contract
       
    });

    it("allows people to fund and withdraw", async function(){
      await fundMe.fund({value:sendValue});
      await fundMe.withdraw();
      const endingBalance= await ethers.provider.getBalance(fundMe.getAddress());
      assert.equal(endingBalance.toString(),"0");

    })
})