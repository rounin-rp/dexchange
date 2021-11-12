const Link = artifacts.require("Link");

module.exports = function (deployer,network, accounts) {
  deployer.deploy(Link);
  // let dex = await Dex.deployed();
  // let link = await Link.deployed();

  // await link.approve(wallet.address, 1000);


};
