const Dex = artifacts.require("Dex");
const Link = artifacts.require("Link");
const truffleAssert = require("truffle-assertions");

contract("Dex", accounts => {

    it("Filled limit orders should be removed from the order book", async() =>{
        let dex = await Dex.deployed();
        let link = await Link.deployed();
        const ticker = web3.utils.fromUtf8("LNK");
        //adding token to dex
        await dex.addToken(ticker,link.address);
        //adding eth to buyer account 
        await dex.depositEth({value:1000});
        //transfer link to account[1] balance
        await link.transfer(accounts[1],100);
        await link.approve(dex.address,500,{from: accounts[1]});
        //deposit link to dex from account 1
        await dex.deposit(ticker,10,{from:accounts[1]});
        //creating limit order
        await dex.createLimitOrder(1,ticker,1,500,{from:accounts[1]});
        const orderBookLengthBefore = (await dex.getOrderBook(ticker,1)).length
        await dex.createMarketOrder(0,ticker,1);
        const orderBookLengthAfter = (await dex.getOrderBook(ticker,1)).length
        assert(orderBookLengthAfter == orderBookLengthBefore - 1,"Order book length should decrease");
    })
})