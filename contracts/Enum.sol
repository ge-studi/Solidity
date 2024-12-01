//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;
contract Enum{
    enum Status{
        Shipped,
        Accepted,
        Rejected,
        Canceled,
        Pending
    }

    Status public status;

    function get() public view returns(Status){
        return status;
    }

    function set(Status _status)public{
        status = _status;
    }

    function cancel() public{
        status = Status.Canceled;
    }
}