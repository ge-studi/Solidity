//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;

interface IERC721 {
    function safeTransferFrom(address from, address to, uint256 tokenId)
        external;
    function transferFrom(address, address, uint256) external;
}
contract EnglishAuction{
    event Start();
    event Bid(address indexed sender,uint amount);
    event Withdraw(address indexed bidder, uint amount);
    event End(address highestBidder ,uint amount);
    IERC721 public immutable nft;
    uint public immutable nftId;
    address payable public immutable seller;
    uint32 public endAt;

    bool public started;
    bool public ended;

    address public highestBidder;
    uint public highestBid;
    mapping(address => uint) bids;
    constructor(address _nft,uint256 _nftId,uint _startingBid){
          nft =IERC721(_nft);
          nftId = _nftId;
          seller = payable(msg.sender);
          highestBid = _startingBid;

    }

    function start() external{
        require(!started,"started");
        require(msg.sender==seller,"Not seller");
        
       started = true;
       endAt = uint32(block.timestamp + 60);
       nft.transferFrom(seller,address(this),nftId);
       emit Start();
    }
        function bid()external payable {
            require(started,"not started"); //auction has started
            require(block.timestamp <endAt,"ended"); //auction has not ended yet
           require(msg.value > highestBid,"msg.value < highestBid"); //amt of ethe > current highest bid
        
          if(highestBidder !=address(0)){
          bids[highestBidder]+=highestBid;

          }
           highestBid = msg.value;
           highestBidder = msg.sender;

            emit Bid(msg.sender,msg.value);
        }
       
    function withdraw() external{
       uint bal = bids[msg.sender];
       bids[msg.sender] = 0;
       payable(msg.sender).transfer(bal);
       emit Withdraw(msg.sender,bal);
    }

    function end() external{
        require(started,"not started");
        require(block.timestamp >=endAt,"not ended");
        require(!ended,"ended");
        
        ended = true;
        if(highestBidder!=address(0)){
        nft.transferFrom(address(this),highestBidder,nftId);
        seller.transfer(highestBid);
        }

        else{
            nft.transferFrom(address(this),seller,nftId);
        }

        emit End(highestBidder,highestBid);
    }
}

