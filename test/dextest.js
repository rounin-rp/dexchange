//The user must have eth deposited such that deposited ETH >= buy order value
//The user must have enought token balance such that token balance >= sell order value
//The first order([0]) in the buy order book should have the highest price

const Dex = artifacts.require("Dex");
const Link = artifacts.require("Link");
const truffleAssert = require("truffle-assertions");

contract("Dex", accounts => {

    it("should have eth deposited such that deposited eth >= buy order value", async()=> {
        let dex = await Dex.deployed();
        var ticker = web3.utils.fromUtf8("LNK");
        await truffleAssert.reverts(
            dex.createLimitOrder(0,ticker,1,10)
        )
        await dex.depositEth({value:10});
        await truffleAssert.passes(
            dex.createLimitOrder(0,ticker,1,6),
            dex.createLimitOrder(0,ticker,1,4)
        )
    })
    it("should be in such a way that buy order is in descending order", async() => {
        let dex = await Dex.deployed();
        var ticker = web3.utils.fromUtf8("LNK");
        await dex.depositEth({value:10})
        await dex.createLimitOrder(0,ticker,1,1);
        await dex.createLimitOrder(0,ticker,1,2);
        await dex.createLimitOrder(0,ticker,1,3);
        var orderBook = await dex.getOrderBook(ticker,0);
        for(var i=0; i<orderBook.length - 1; i++){
            assert(orderBook[i].price >= orderBook[i+1].price,"not the right order in buy book");
        }
    })
    it("should be in such a way that sell order is in ascending order",async() => {
        let dex = await Dex.deployed();
        let link = await Link.deployed();
        var ticker = web3.utils.fromUtf8("LNK");
        await dex.addToken(ticker, link.address);
        await link.approve(dex.address,10000);
        await dex.deposit(ticker,10);
        await dex.createLimitOrder(1,ticker,1,3);
        await dex.createLimitOrder(1,ticker,1,2);
        await dex.createLimitOrder(1,ticker,1,1);
        var orderBook = await dex.getOrderBook(ticker,1);
        for(var i=0; i<orderBook.length - 1; i++){
            assert(orderBook[i].price <= orderBook[i+1].price,"not the right order in sell book");
        }
    })
})

//when creating a sell market order, the seller needs to have enough tokens for the trade
//when creating a BUY market order, the buyer needs to have enough eth for the trade
//market orders can be submitted even if the order book is empty
//market order should be filled until the order book is empty or the market order is 100% fulfilled
//the eth balance of the buyer should decrease with the filled amount
//the token balance of the seller should decrease with the filled amounts
//filled limit orders should be removed from the orderbook
 