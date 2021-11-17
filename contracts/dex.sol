pragma solidity ^0.8.0;
import "./wallet.sol";

contract Dex is Wallet{

    using SafeMath for uint256;
    enum Type{
        BUY,
        SELL
    }


    struct Order{
        uint id;
        address trader;
        Type orderType;
        bytes32 ticker;
        uint amount;
        uint price;
    }

    mapping(bytes32 => mapping(uint => Order[])) orderBook;

    function _sort(bytes32 _ticker,uint _type)private{
        if(orderBook[_ticker][_type].length > 1){
            Order[] storage array = orderBook[_ticker][_type];
            if(_type == 0 ){
                uint index = orderBook[_ticker][_type].length - 1;
                while(index > 0 && array[index].price > array[index - 1].price){
                    Order storage temp = array[index];
                    array[index] = array[index - 1];
                    array[index - 1 ] = temp;
                    index--;
                }
            }
            else if(_type == 1 ){
                uint index = orderBook[_ticker][_type].length - 1;
                while(index > 0 && array[index].price < array[index - 1].price){
                    Order storage temp = array[index];
                    array[index] = array[index - 1];
                    array[index - 1 ] = temp;
                    index--;
                }
            }
        }
    }

    function getOrderBook(bytes32 _ticker, Type _order) public view returns(Order[] memory){
        return orderBook[_ticker][uint(_order)];
    }

    function createLimitOrder(uint _orderType, bytes32 _ticker, uint _amount, uint _price)external {
        if(_orderType == 0){
            require(balances[msg.sender][ethTicker] >= _amount.mul(_price),"Not enough ETH for the order");
        }
        else{
            require(balances[msg.sender][_ticker] >= _amount,"Not enough token for the order");
        }
        Order memory _temp;
        _temp.id = orderBook[_ticker][_orderType].length;
        _temp.trader = msg.sender;
        _temp.orderType = _orderType == 0?Type.BUY:Type.SELL;
        _temp.ticker = _ticker;
        _temp.amount = _amount;
        _temp.price = _price;
        orderBook[_ticker][_orderType].push(_temp);
        _sort(_ticker,_orderType);
    }

    function getOrderBook(bytes32 _ticker, uint _type)public view returns(Order[] memory){
        return orderBook[_ticker][_type];
    }

    function createMarketOrder(uint _orderType, bytes32 _ticker, uint _amount)external returns(bool result){
        uint otype = _orderType ^ 1;
        Order[] storage orders = orderBook[_ticker][otype];
        if(otype == 1){
            uint index = 0;
            uint totalCost = 0;
            uint totalToken = 0;
            uint buyerEth = balances[msg.sender][ethTicker];
            uint sellerToken = 0;
            while(index < orders.length && _amount > 0){
                Order storage order = orders[index];
                sellerToken = balances[order.trader][_ticker];
                if(sellerToken < _amount){
                    index++;
                    continue;
                }
                if(order.amount >= _amount){
                    if(buyerEth >= _amount * order.price){
                        balances[order.trader][_ticker]-= _amount;
                        balances[order.trader][ethTicker]+= _amount * order.price;
                        order.amount = order.amount - _amount;
                        totalCost+= _amount * order.price;
                        totalToken+= _amount;
                        buyerEth-=_amount * order.price;
                        _amount = 0;
                        result = true;
                        break;
                    }
                }
                else{
                    if(buyerEth >= order.amount * order.price){
                        balances[order.trader][_ticker]-=order.amount;
                        balances[order.trader][ethTicker]+= order.amount * order.price;
                        _amount-= order.amount;
                        totalCost+= order.amount * order.price;
                        totalToken+= order.amount;
                        buyerEth-= order.amount * order.price;
                        order.amount = 0;
                    }
                }
                index++;
            }
            balances[msg.sender][ethTicker]-= totalCost;
            balances[msg.sender][_ticker]+= totalToken;
            _delete(_ticker,otype);
        }
    }

    function _delete(bytes32 _ticker, uint _type)private{
        Order[] storage orders = orderBook[_ticker][_type];
        int index = -1;
        for(uint i=0; i<orders.length; i++){
            if(orders[i].amount == 0){
                index = int(i);
            }
        }
        if(index >= 0){
            uint k = 0;
            for(uint i = uint(index)+1; i<orders.length; i++){
                orders[k++] = orders[i];
            }
            k = uint(index);
            for(uint i=0; i<=k; i++){
                orders.pop();
            }
        }
    }
}