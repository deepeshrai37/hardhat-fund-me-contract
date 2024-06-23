const { assert , expect} = require("chai");
const {deployments, ethers, getNamedAccounts} =require("hardhat"); 
// describe("FundMe",async function(){
//   let fundMe
//   let deployer
//   let mockV3Aggregator
//   beforeEach(async function(){
//       deployer=(await getNamedAccounts()).deployer;
//       await deployments.fixture(["all"]);
//       fundMe=await ethers.getContractAt("FundMe", deployer)
//       mockV3Aggregator=await ethers.getContractAt("MockV3Aggregator",deployer)
//   })
//   describe("constructor", async function(){

//     it("sets the aggregator addresses correctly",async function(){
//       const response= await fundMe.priceFeed();
//       assert.equal(response,mockV3Aggregator.address)
//     })

//   })
// })
describe("FundMe", () => {
  let fundMe,
      deployer,
      mockV3Aggregator;
      const sendValue=ethers.parseEther("1");
  beforeEach(async function () {
      // deploy our fundme contract 
      // using hardhat deploy
      // const accounts = await ethers.getSigners()
      deployer = await ethers.provider.getSigner();
      await deployments.fixture(["all"]); // deploy with tags
      fundMe = await ethers.getContractAt("FundMe", (await deployments.get("FundMe")).address, deployer); // most recently deployed fundme contract
      mockV3Aggregator = await ethers.getContractAt("MockV3Aggregator", (await deployments.get("MockV3Aggregator")).address, deployer);
  });

  describe("constructor", () => {
      it("sets the aggregator addresses correctly", async function () {
          const response = await fundMe.priceFeed();
          assert.equal(response, await mockV3Aggregator.getAddress());
      });
  });

  describe("fund", ()=>{
    it("fails if you dont send enough eth", async function(){
      await expect(fundMe.fund()).to.be.revertedWith("Didnt send enough eth!!!")
    })
    it("updates the amount funded data structure",async function(){
      await fundMe.fund({value:sendValue});
      const response=await fundMe.addressToamountFunded(deployer);
      assert.equal(response.toString(),sendValue.toString());
    })

    it("adds funders to array", async function(){
      await fundMe.fund({value:sendValue});
      const response= await fundMe.funders(0);
      assert.equal(response,deployer.address);
    })
  })

  describe("withdraw",()=>{
    beforeEach(async function(){
      await fundMe.fund({value:sendValue});

    })

    it("withdraw ETH from single funder",async function(){
      //arrange
      const startingFundMeBalance= await ethers.provider.getBalance(fundMe.getAddress());
      const startingDeployerBalance=await ethers.provider.getBalance(deployer);
      //act
      const transactionResponse=await fundMe.withdraw();
      const transactionReceipt=await transactionResponse.wait(1);
      const {fee}=transactionReceipt;
      const endingFundBalance= await ethers.provider.getBalance(fundMe.getAddress());
      const endingDeployerBalance= await ethers.provider.getBalance(deployer);
      //assert

      assert.equal(endingFundBalance,0);
      assert.equal(
      startingFundMeBalance+startingDeployerBalance,
      endingDeployerBalance+fee
    );
    })
  })
});