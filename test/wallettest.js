const Link = artifacts.require("Link");
const Dex = artifacts.require("Dex");
const truffleAssert = require("truffle-assertions");

contract("Dex", accounts => {
    it("Should only be possible for the owner to add tokens", async () => {
        let dex = await Dex.deployed();
        let link = await Link.deployed();
        var ticker = web3.utils.fromUtf8("LNK");

        await truffleAssert.passes(
            dex.addToken(ticker,link.address,{from: accounts[0]})
        )
        // await truffleAssert.reverts(
        //     dex.addToken(ticker, link.address, {from: accounts[1]})
        // )
    })

    it("should handle deposit", async () => {
        let dex = await Dex.deployed();
        let link = await Link.deployed();
        var ticker = web3.utils.fromUtf8("LNK");
        link.approve(dex.address,1000);
        await dex.deposit(ticker,100);
        var balance = await dex.balances(accounts[0], ticker);
        assert(balance.toNumber() == 100);
    })

    it("Should let withdraw correctly", async () => {
        let dex = await Dex.deployed();
        let link = await Link.deployed();
        var ticker = web3.utils.fromUtf8("LNK");
        link.approve(dex.address,1000);
        dex.deposit(ticker,20);
        await truffleAssert.passes(
            dex.withdraw(ticker, 2)
        )
    })
    // it("Should not let invalid withdraw ", async () => {
    //     let dex = await Dex.deployed();
    //     let link = await Link.deployed();
    //     var ticker = web3.utils.fromUtf8("LNK");
    //     await truffleAssert.reverts(
    //         dex.withdraw(ticker, 2000)
    //     )
    // })
})