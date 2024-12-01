//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;

interface IERC721 {
    function transferFrom(address _from, address _to, uint256 _nftId1)
        external;
}

contract DutchAuction{
    uint256 private constant DURATION = 7 days;
    IERC721 public immutable nft1;
    uint public immutable nftId1;
    address payable public immutable seller1;
    uint256 public immutable startingPrice;

    uint public immutable StartAt;
    uint public immutable ExpiresAt;
    uint256 public immutable discountRate;
    constructor(uint _startingPrice, uint256 _discountRate,
    address _nft1,uint _nftId1){
        seller1 = payable(msg.sender);
       startingPrice = _startingPrice;

        StartAt = block.timestamp;
         
        ExpiresAt = block.timestamp + DURATION;
       
            discountRate = _discountRate;

       require(_startingPrice >= _discountRate* DURATION, "startingPrice < discountRate");

         nft1 = IERC721(_nft1);
        nftId1 = _nftId1;


    }

    // function getPrice()public view returns(uint){
    //     uint timeElasped = block.timestamp - StartAt;
    //     uint discount = discountRate * timeElasped;
    //     return startingPrice - discount;
    // }

    function getPrice() public view returns (uint) {
    uint timeElasped = block.timestamp - StartAt;
    uint discount = discountRate * timeElasped;
    // Ensure that price does not go below 0
    return startingPrice > discount ? startingPrice - discount : 0;
}


    // function buy() external payable{
    //     require(block.timestamp < ExpiresAt,"auction expired");
    //    uint price = getPrice();
    //    require(msg.value >= price,"ETH < price");

    //    nft1.transferFrom(seller1,msg.sender,nftId1);
    //    uint refund = msg.value - price;

    //    if(refund >0){
    //    payable(msg.sender).transfer(refund);
    // }
    
    // }

    function buy() external payable {
    require(block.timestamp < ExpiresAt, "auction expired");

    uint price = getPrice();
    require(msg.value >= price, "ETH < price");

    nft1.transferFrom(seller1, msg.sender, nftId1);

    uint refund = msg.value - price;
    if (refund > 0) {
        payable(msg.sender).transfer(refund);
    }
}

}