//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;
contract Multisig{
    event Deposit(address indexed sender, uint amount);
    event Submit(uint indexed transaction_id);
    event Approve(address indexed owner, uint indexed transaction_id);
    event Revoke(address indexed owner, uint indexed transaction_id);
    event Execute(uint indexed transaction_id);

    struct Transaction{
         address to;
         uint value;
         bytes data;
         bool executed;

    }
    address[] public owners;
    mapping(address => bool) isOwner;
    uint public required;

    Transaction[] public transactions;
    mapping(uint =>mapping(address => bool)) public approved;

    modifier onlyOwner(){
        require(isOwner[msg.sender],"not owner");
        _;
    }

    modifier transactionExists(uint _transaction_id){
        require(_transaction_id < transactions.length,"transaction not exist");
        _;
    }

    modifier notApproved(uint _transaction_id){
        require(!approved[_transaction_id][msg.sender],"Transaction already approved");
        _;
    }

    modifier notExecuted(uint _transaction_id){
        require(!transactions[_transaction_id].executed,"Transaction already executed");
        _;
    }

    constructor(address[] memory _owners, uint _required)
    {
        require(_owners.length>0,"owners required");
        require(
            _required >0 && _required<=_owners.length,"invalid required number of owners");

        for(uint i=0;i<_owners.length;i++){
            address owner=_owners[i];

            require(owner!=address(0),"invalid error");
            require(!isOwner[owner],"owner not unique");

            isOwner[owner]=true;

            owners.push(owner);
        }
        required=_required;

         
    }

    receive() external payable{
        emit Deposit(msg.sender,msg.value);
    }
    function submit(address _to,uint _value, bytes calldata _data) external
        onlyOwner{
              transactions.push(Transaction({
               to: _to,
               value: _value,
               data: _data,
               executed: false

              }));

              emit Submit(transactions.length -1);

        }
        function approve(uint _transaction_id)
        external 
        onlyOwner
        transactionExists(_transaction_id)
        notApproved(_transaction_id)
        notExecuted(_transaction_id){
                approved[_transaction_id][msg.sender]=true;
                emit Approve(msg.sender,_transaction_id);
        }

        function _getApprovalCount(uint _transaction_id)private view returns(uint count){
            for(uint i;i<owners.length;i++){
                if(approved[_transaction_id][owners[i]]){
                    count+=1;
                }
                
            }
        }

        function execute(uint _transaction_id)external transactionExists(_transaction_id)notExecuted(_transaction_id){
            require(_getApprovalCount(_transaction_id)>=required,"approvals<required");
            Transaction storage transaction = transactions[_transaction_id];

            transaction.executed=true;
            (bool success,)= transaction.to.call{value: transaction.value}(
                transaction.data
            );
            require(success,"Transaction failed");
            emit Execute(_transaction_id);
}
        function revoke(uint _transaction_id)
        external 
        onlyOwner
        transactionExists(_transaction_id)
        notExecuted(_transaction_id){
            require(approved[_transaction_id][msg.sender],"Transaction not approved");
            approved[_transaction_id][msg.sender]=false;
            emit Revoke(msg.sender,_transaction_id);
        }
    }

    