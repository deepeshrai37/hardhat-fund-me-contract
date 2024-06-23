const { ethers } = require("hardhat");

async function main(){
  const deployer= await ethers.provider.getSigner();
  const fundMe=await ethers.getContractAt("FundMe",deployer);
  console.log("Funding............");

  const transactionResponse=await fundMe.withdraw();
  await transactionResponse.wait(1);
  console.log("Got it back!!!!");
}
main()
.then(()=> process.exit(0))
.catch((error)=>{
  console.log(error);
  process.exit(1);
});