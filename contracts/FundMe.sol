// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "contracts/PriceConvertor.sol";

contract FundMe {
    using PriceConvertor for uint256;
    uint public minimumUSD = 50 * 1e18;
    address[] public funders;
    mapping(address => uint256) public addressToamountFunded;
    address public owner;

    AggregatorV3Interface public priceFeed;

    constructor(address priceFeedAddress) {
        owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    function fund() public payable {
        require(
            msg.value.getConversionRate(priceFeed) >= minimumUSD,
            "Didnt send enough eth!!!"
        );
        funders.push(msg.sender);
        addressToamountFunded[msg.sender] += msg.value;
    }

    function withdraw() public onlyOwner {
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            addressToamountFunded[funder] = 0;
        }
        //reset array
        funders = new address[](0);

        /*actually withdraw the funds -->3 different ways
           transfer
           send
           call*/

        //transfer
        //    payable (msg.sender).transfer(address(this).balance);

        //send
        //    bool sendSucces=payable (msg.sender).send(address(this).balance);
        //    require(sendSucces,"Send Failed!!!");

        //call

        (bool callSucess /*bytes memory dataReturned*/, ) = payable(msg.sender)
            .call{value: address(this).balance}("");
        require(callSucess, "Call Failed!!!");
    }

    // function cheaperWithdraw() public payable onlyOwner {
    //     address[] memory funders = funders;
    //     for (
    //         uint256 funderIndex = 0;
    //         funderIndex < funders.length;
    //         funderIndex++
    //     ) {
    //         address funder = funders[funderIndex];
    //         addressToamountFunded[funder] = 0;
    //     }
    //     funders = new address[](0);

    //     (bool callSucess /*bytes memory dataReturned*/, ) = payable(msg.sender)
    //         .call{value: address(this).balance}("");
    //     require(callSucess, "Call Failed!!!");
    // }

    modifier onlyOwner() {
        require(msg.sender == owner, "Sender is not owner!!!");
        _;
    }
}
