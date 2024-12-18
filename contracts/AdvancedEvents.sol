//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;
contract AdvancedEvents{
    event TransferInitiated(
        address indexed from,address indexed to,uint256 value
    );
    event TransferConfirmed(
        address indexed from,address indexed to,uint256 value
    );

    mapping(bytes32 => bool)public TransferConfirmations;

    function initiateTransfer(address to,uint256 value)public{
        emit TransferInitiated(msg.sender,to,value);
    }

    function confirmTransfer(bytes32 transferId)public{
        require(!TransferConfirmations[transferId],"Transfer already confirmed");
        TransferConfirmations[transferId] = true;
        emit TransferConfirmed(msg.sender,address(this),0);

    }
}

interface eventSubscriber{
    function handleTransferEvent(address from,address to,uint256 value)external;
}

contract EventSubscription{
    event LogTransfer(address indexed from,address indexed to,uint256 value);

    mapping(address =>bool)public subscribers;
    address[] public subscriberList;

    function subscribe() public{
        require(!subscribers[msg.sender],"Already subscribed");
        subscribers[msg.sender] = true;
        subscriberList.push(msg.sender);
    }

    function unsubscribe() public{
        require(subscribers[msg.sender],"Not subscribed");
        subscribers[msg.sender]=false;
        for(uint256 i=0;i<subscriberList.length;i++){
            if(subscriberList[i]==msg.sender){
                subscriberList[i] = subscriberList[subscriberList.length -1];
                subscriberList.pop();
                break;
            }
        }    
        
        }

        function transfer(address to, uint256 value)public{
            emit LogTransfer(msg.sender,to,value);

            for(uint256 i=0;i<subscriberList.length;i++){
                eventSubscriber(subscriberList[i]).handleTransferEvent(msg.sender,to,value);
                
            }
        }

}



