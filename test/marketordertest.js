
const Dex = artifacts.require("Dex");
const Link = artifacts.require("Link");
const truffleAssert = require("truffle-assertions");

contract("Dex", accounts => {
    
    it("Market order should be filled until the market order is 100% fulfilled", async() => {
        let dex = await Dex.deployed();
        let link = await Link.deployed();
        const ticker = web3.utils.fromUtf8("LNK");
        await dex.addToken(ticker,link.address);
        await link.approve(dex.address,500);

        let orderBook = await dex.getOrderBook(ticker,1);
        assert(orderBook.length == 0, "Initially oderbook should be empty");

        //depositing eth into buyer account
        await dex.depositEth({value:10000});
        
        //send link to accounts 1,2 and 3 from account 0
        await link.transfer(accounts[1],50);
        await link.transfer(accounts[2],50);
        await link.transfer(accounts[3],50);

        //approve DEX for accounts 1,2 and 3
        await link.approve(dex.address,200,{from:accounts[1]});
        await link.approve(dex.address,200,{from:accounts[2]});
        await link.approve(dex.address,200,{from:accounts[3]});

        //deposit links into dex from accounts 1,2 and 3
        await dex.deposit(ticker,50,{from:accounts[1]});
        await dex.deposit(ticker,50,{from:accounts[2]});
        await dex.deposit(ticker,50,{from:accounts[3]});

        //fill up the sell order book
        await dex.createLimitOrder(1,ticker,5,300,{from:accounts[1]});
        await dex.createLimitOrder(1,ticker,5,400,{from:accounts[2]});
        await dex.createLimitOrder(1,ticker,5,500,{from:accounts[3]});

        //create market order that should fill 2/3 of the sell order

        await dex.createMarketOrder(0,ticker,10);

        orderBook = await dex.getOrderBook(ticker,1); // get orderbook

        assert(orderBook.length == 1, "sell side orderbook should have only one order left");
    })

    it("Market order should fill until the order book is empty",async () => {
        let dex = await Dex.deployed();
        const ticker = web3.utils.fromUtf8("LNK");

        const orderBook = await dex.getOrderBook(ticker,1);
        assert(orderBook.length == 1,"Order book length should not be greater than 1");

        //fill up the sell order book again
        await dex.createLimitOrder(1,ticker,5,200,{from:accounts[1]});
        await dex.createLimitOrder(1,ticker,5,300,{from:accounts[2]});

        //get buyer link balance before the trade
        const balanceBefore = await dex.balances(accounts[0],ticker);

        //create market buy order that will exhaust the sell order list completely
        await dex.createMarketOrder(0,ticker,20);

        //get buyer link balance after the trade
        const balanceAfter = await dex.balances(accounts[0],ticker);
        //compare the balances
        assert(balanceAfter.toNumber() == balanceBefore.toNumber() + 10,"there is some inconsistency with the balance");
    })

    

    
})

//when creating a sell market order, the seller needs to have enough tokens for the trade
//when creating a BUY market order, the buyer needs to have enough eth for the trade
//market orders can be submitted even if the order book is empty
//market order should be filled until the order book is empty or the market order is 100% fulfilled
//the eth balance of the buyer should decrease with the filled amount
//the token balance of the seller should decrease with the filled amounts
//filled limit orders should be removed from the orderbook
