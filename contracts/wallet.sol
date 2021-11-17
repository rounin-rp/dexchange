pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Wallet{

    using SafeMath for uint256;

    struct Token{
        bytes32 ticker;
        address tokenAddress;
    }

    bytes32 ethTicker = bytes32(bytes("ETH"));

    mapping(bytes32 => Token) public tokenMapping;
    bytes32[] public tokenList;

    mapping(address => mapping(bytes32 => uint256)) public balances;

    modifier tokenExists(bytes32 _ticker){
        require(tokenMapping[_ticker].tokenAddress != address(0),"Token does not exists");
        _;
    }
    function depositEth() payable external{
        balances[msg.sender][ethTicker] = balances[msg.sender][ethTicker].add(msg.value);
    }

    function addToken(bytes32 _ticker, address _tokenAddress) external{
        tokenMapping[_ticker] = Token(_ticker,_tokenAddress);
        tokenList.push(_ticker);
    }
    //function transfers the amount from token contract to this contract
    function deposit(bytes32 _ticker, uint256 _amount)tokenExists(_ticker) external{
        IERC20(tokenMapping[_ticker].tokenAddress).transferFrom(msg.sender, address(this), _amount);
        uint balance = balances[msg.sender][_ticker];
        balances[msg.sender][_ticker] = balances[msg.sender][_ticker].add(_amount);
        assert(balances[msg.sender][_ticker] == balance + _amount);
    }
    // function transfers amount from this contract to the token contract 
    function withdraw(bytes32 _ticker, uint256 _amount)tokenExists(_ticker) external{
        require(balances[msg.sender][_ticker] >= _amount,"Insufficient balance!");
        balances[msg.sender][_ticker] = balances[msg.sender][_ticker].sub(_amount);
        IERC20(tokenMapping[_ticker].tokenAddress).transfer(msg.sender, _amount);
    }
}