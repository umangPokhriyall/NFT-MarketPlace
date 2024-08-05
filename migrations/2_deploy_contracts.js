
const MintNFT = artifacts.require("MyNFT");
const Market = artifacts.require("Marketplace");

module.exports = async function (deployer) {
  await deployer.deploy(MintNFT);
  await deployer.deploy(Market);
};
