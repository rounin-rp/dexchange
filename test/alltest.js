// const Dex = artifacts.require("Dex");
// const Link = artifacts.require("Link");
// const truffleAssert = require("truffle-assertions")

// contract("Dex",accounts => {
//     it("should work", async() => {
//         const dex = await Dex.deployed();
//         const link = await Link.deployed();
//         const ticker = web3.utils.fromUtf8("LNK");
//         const eth = web3.utils.fromUtf8("ETH");

//         await dex.addToken(ticker,link.address);

//         await dex.depositEth({value:10000}); //buyer eth balance

//         await link.transfer(accounts[1],100);
//         await link.approve(dex.address,1000,{from:accounts[1]});
//         await dex.deposit(ticker,50,{from:accounts[1]}); //seller token balance

//         var tickerBalanceOfBuyer = (await dex.balances(accounts[0],ticker)).toNumber();
//         var ethBalanceOfBuyer = (await dex.balances(accounts[0],eth)).toNumber();
//         var tickerBalanceOfSeller = (await dex.balances(accounts[1],ticker)).toNumber();
//         var ethBalanceOfSeller = (await dex.balances(accounts[1],eth)).toNumber();
//         console.log("buyer ka ticker balance aur eth balance = ",tickerBalanceOfBuyer," -- ",ethBalanceOfBuyer);
//         console.log("seller ka ticker balance aur eth balance = ",tickerBalanceOfSeller," -- ",ethBalanceOfSeller);

//         //create a limitOrder sell
//         await dex.createLimitOrder(1,ticker,10,2,{from:accounts[1]});
//         var len = (await dex.getOrderBook(ticker,1)).length;
//         //create a market order buy
//         console.log("length of orderbook = ",len);
//         await dex.createMarketOrder(0,ticker,10);
//         len = (await dex.getOrderBook(ticker,1)).length;
//         console.log("length of orderbook = ",len);

//         tickerBalanceOfBuyer = (await dex.balances(accounts[0],ticker)).toNumber();
//         ethBalanceOfBuyer = (await dex.balances(accounts[0],eth)).toNumber();
//         tickerBalanceOfSeller = (await dex.balances(accounts[1],ticker)).toNumber();
//         ethBalanceOfSeller = (await dex.balances(accounts[1],eth)).toNumber();

//         console.log("buyer ka ticker balance aur eth balance = ",tickerBalanceOfBuyer," -- ",ethBalanceOfBuyer);
//         console.log("seller ka ticker balance aur eth balance = ",tickerBalanceOfSeller," -- ",ethBalanceOfSeller);

//         await dex.createLimitOrder(1,ticker,10,3,{from:accounts[1]});
//         await dex.createMarketOrder(0,ticker,15);

//         tickerBalanceOfBuyer = (await dex.balances(accounts[0],ticker)).toNumber();
//         ethBalanceOfBuyer = (await dex.balances(accounts[0],eth)).toNumber();
//         tickerBalanceOfSeller = (await dex.balances(accounts[1],ticker)).toNumber();
//         ethBalanceOfSeller = (await dex.balances(accounts[1],eth)).toNumber();

//         console.log("buyer ka ticker balance aur eth balance = ",tickerBalanceOfBuyer," -- ",ethBalanceOfBuyer);
//         console.log("seller ka ticker balance aur eth balance = ",tickerBalanceOfSeller," -- ",ethBalanceOfSeller);


//         await dex.createLimitOrder(1,ticker,10,3,{from:accounts[1]});
//         await dex.createLimitOrder(1,ticker,2,4,{from:accounts[1]});
//         await dex.createLimitOrder(1,ticker,8,5,{from:accounts[1]});
//         await dex.createMarketOrder(0,ticker,15);
//         tickerBalanceOfBuyer = (await dex.balances(accounts[0],ticker)).toNumber();
//         ethBalanceOfBuyer = (await dex.balances(accounts[0],eth)).toNumber();
//         tickerBalanceOfSeller = (await dex.balances(accounts[1],ticker)).toNumber();
//         ethBalanceOfSeller = (await dex.balances(accounts[1],eth)).toNumber();

//         console.log("buyer ka ticker balance aur eth balance = ",tickerBalanceOfBuyer," -- ",ethBalanceOfBuyer);
//         console.log("seller ka ticker balance aur eth balance = ",tickerBalanceOfSeller," -- ",ethBalanceOfSeller);
//     })
// })