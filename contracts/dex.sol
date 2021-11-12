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

    function _sort(bytes32 _ticker, uint _type, Order memory _temp)private{
        if(_type == 0 ){
            for(uint i=0; i<orderBook[_ticker][_type].length-1; i++){
                if(orderBook[_ticker][_type][i].price < _temp.price){
                    Order memory _swap = orderBook[_ticker][_type][i];
                    orderBook[_ticker][_type][i] = _temp;
                    _temp = _swap;
                }
            }
            orderBook[_ticker][_type][orderBook[_ticker][_type].length - 1] = _temp; // swapping the last element to its place

        }
        else if(_type == 1 ){
            for(uint i=0; i<orderBook[_ticker][_type].length-1; i++){
                if(orderBook[_ticker][_type][i].price > _temp.price){
                    Order memory _swap = orderBook[_ticker][_type][i];
                    orderBook[_ticker][_type][i] = _temp;
                    _temp = _swap;
                }
            }
            orderBook[_ticker][_type][orderBook[_ticker][_type].length - 1] = _temp;
        }
    }

    function getOrderBook(bytes32 _ticker, Type _order) public view returns(Order[] memory){
        return orderBook[_ticker][uint(_order)];
    }

    function createLimitOrder(uint _orderType, bytes32 _ticker, uint _amount, uint _price)public {
        if(_orderType == 0){
            require(balances[msg.sender][ethTicker] >= _amount.mul(_price),"Not enough ether for the order");
        }
        else{
            require(balances[msg.sender][_ticker] >= _amount.mul(_price),"Not enough tokens for the order");
        }
        Order memory _temp;
        _temp.id = orderBook[_ticker][_orderType].length;
        _temp.trader = msg.sender;
        _temp.orderType = _orderType == 0?Type.BUY:Type.SELL;
        _temp.ticker = _ticker;
        _temp.amount = _amount;
        _temp.price = _price;
        orderBook[_ticker][_orderType].push(_temp);
        _sort(_ticker,_orderType,_temp);
    }

    function getOrderBook(bytes32 _ticker, uint _type)public view returns(Order[] memory){
        return orderBook[_ticker][_type];
    }
}