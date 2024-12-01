//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;
import "hardhat/console.sol";
interface IERC20{
     function transfer(address, uint256) external returns (bool);
     function transferFrom(address, address, uint256) external returns (bool);
}

 contract CrowdFund{
    event Launch(uint256 id,address indexed creator, uint256 goal, uint32 startAt, uint32 endAt);
    event Cancel(uint256 id);
    event Pledge(uint256 indexed id, address indexed caller, uint256 amount);
    event Unpledge(uint256 indexed id, address indexed caller, uint256 amount);
    event Claim(uint256 id);
    event Refund(uint256 id, address indexed caller, uint256 amount);

    struct Campaign{
        address creator;
        uint256 goal;
        uint256 pledged;
        uint32 startAt;
        uint32 endAt;
        bool claimed;
    }

    IERC20 public immutable token;
    uint256 public count;
    mapping(uint256 => Campaign)public campaigns; //mapping of campaign id to campaign details
    mapping(uint256 =>mapping(address =>uint256))public pledgedAmount; // nested mapping for how much address has pledged to campaign

    constructor(address _token){
        token = IERC20(_token);
    }

    function launch(uint256 _goal, uint32 _startAt,uint32 _endAt)external{
        require(_startAt>= block.timestamp,"start at < now"); //start activity cannot be set in past
        require(_endAt >=_startAt,"end at < start at");

        //time at which contract ends does not exceeds max duration from current time.
        require(_endAt <=block.timestamp + 90 days,"end at > max duration"); 

        count+=1;
        
        campaigns[count] = Campaign({
            creator:msg.sender,
            goal: _goal,
            pledged: 0,
            startAt: _startAt,
            endAt: _endAt,
            claimed:false
        });
        
        emit Launch(count,msg.sender,_goal,_startAt,_endAt);
            }

            //Cancel campaign before it starts
      function cancel(uint256 _id)external{
        Campaign memory campaign = campaigns[_id];
        require(campaign.creator == msg.sender,"not creator");
        require(block.timestamp < campaign.startAt,"started"); // current blockchain time is before the start time of camapign

        delete campaigns[_id];
        emit Cancel(_id);
      }

      function pledge(uint256 _id,uint256 _amount)external{
        //By using storage data permanently stored in blockchain and data referenced directly in storage

        Campaign storage campaign = campaigns[_id]; 
        require(block.timestamp >= campaign.startAt,"not started");
        require(block.timestamp<= campaign.endAt,"ended");

        campaign.pledged +=_amount; // total amount pledged to specific campaign
        pledgedAmount[_id][msg.sender]+=_amount; // updates amt pledged to specific user
         //here msg.sender is the user who is pledging tokens and this refers to address of current contract
         token.transferFrom(msg.sender,address(this),_amount);
        emit Pledge(_id,msg.sender,_amount);
      }
   
   //allows user to unpledge tokens from campaign before it ends
      function unpledge(uint256 _id,uint256 _amount)external{
        Campaign storage campaign = campaigns[_id];
        require(block.timestamp <= campaign.endAt,"ended");
        campaign.pledged -=_amount;
        token.transfer(msg.sender,_amount);

        emit Unpledge(_id,msg.sender,_amount);
      }
       //claim tokens if goal is met
      function claim(uint256 _id)external{
        Campaign storage campaign = campaigns[_id];
        require(campaign.creator == msg.sender,"not creator"); // only creator can claim funds
        require(block.timestamp > campaign.endAt,"not ended"); //campaign ended before claiming
        require(campaign.pledged >= campaign.goal,"pledged < goal"); // pledged amount exceeds or meets goal
        require(!campaign.claimed,"claimed"); // checks funds have already not claimed

        campaign.claimed = true;
        token.transfer(campaign.creator,campaign.pledged);

        emit Claim(_id);
      }

      //allow users to get back their tokens if goal not met
      function refund(uint256 _id)external{
            Campaign memory campaign = campaigns[_id];
            require(block.timestamp > campaign.endAt,"not ended");
            require(campaign.pledged < campaign.goal,"pledged >=goal");

            uint256 bal = pledgedAmount[_id][msg.sender];
            pledgedAmount[_id][msg.sender] = 0;
            token.transfer(msg.sender,bal);

            emit Refund(_id,msg.sender,bal);
      }
 }