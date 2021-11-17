const Dex = artifacts.require("Dex");
const Link = artifacts.require("Link");
const truffleAssert = require("truffle-assertions");

contract("Dex", accounts => {
    it("The eth balance of the buyer should decrease and the token balance should increase with the filled amount", async() => {
        let dex = await Dex.deployed();
        let link = await Link.deployed();
        const ticker = web3.utils.fromUtf8("LNK");
        const ethticker = web3.utils.fromUtf8("ETH");

        await dex.addToken(ticker,link.address);
        await link.approve(dex.address,500);
        await dex.deposit(ticker,1);

        //depositing eth into buyer account
        await dex.depositEth({value:1000});

        //send link to accounts 1,2 and 3 from account 0
        await link.transfer(accounts[1],50);
        await link.transfer(accounts[2],50);
        await link.transfer(accounts[3],50);

        //approve DEX for accounts 1,2 and 3
        await link.approve(dex.address,200,{from:accounts[1]});
        await link.approve(dex.address,200,{from:accounts[2]});
        await link.approve(dex.address,200,{from:accounts[3]});

        //approve dex from account 1
        await link.approve(dex.address,100,{from:accounts[1]});
        await dex.deposit(ticker,5,{from:accounts[1]});

        //create sell order
        await dex.createLimitOrder(1,ticker,5,5,{from:accounts[1]});

        // //get the eth balance of the buyer before the trade
        const balanceBeforeEth = (await dex.balances(accounts[0],ethticker)).toNumber();
        const balanceBeforeToken = (await dex.balances(accounts[0],ticker)).toNumber();;

        // //create market order
        await dex.createMarketOrder(0,ticker,5);

        // //get the balance of the buyer after the trade
        const balanceAfterEth = (await dex.balances(accounts[0],ethticker)).toNumber();
        const balanceAfterToken = (await dex.balances(accounts[0],ticker)).toNumber();

        //check balance conistency
        assert(balanceAfterEth == balanceBeforeEth - 25,"buyer eth balance should decrease");
        assert(balanceAfterToken == balanceBeforeToken + 5,"buyer token balance should increase");

    })
})
    
    