// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

// Uncomment this line to use console.log
import "hardhat/console.sol";
import "../base/MutableAsset.sol";
import "../base/SmartPolicy.sol";

/**
 * @title Smart Asset which represents a CanteenManagement
 * @author Francesco Donini <francesco.donini@phd.unipi.it>
 * @notice This Smart Contract contains all the CanteenManagement properties and features which allows
 * it to mutate
 */
contract CanteenManagementMutableAsset is MutableAsset {
    /** */
    constructor(
        address _nmt,
        address _creatorSmartPolicy,
        address _holderSmartPolicy
    ) MutableAsset(_nmt, _creatorSmartPolicy, _holderSmartPolicy) {}

    // CanteenManagement descriptor
    struct CanteenManagementDescriptor {
        string name;
        string bpmn;
        bytes32[] messages;
    }

    // Current state representing canteenManagement descriptor with its attributes
    CanteenManagementDescriptor public canteenManagementDescriptor;

    /** Retrieves all the attributes of the descriptor CanteenManagement
     * 
     * TODO forse visto che canteenManagementDescriptor è public nn doverebbe servire
     */
    function getCanteenManagementDescriptor()
        public
        view
        returns (CanteenManagementDescriptor memory)
    {
        return (canteenManagementDescriptor);
    }

    event StateChanged(CanteenManagementDescriptor canteenManagementDescriptor);

    /**
     * USERS ACTIONS with attached policy
     * */

    fallback() external {}

    function setName(
        string memory _name,
        string memory _tokenURI
    )
        public
        evaluatedBySmartPolicies(
            msg.sender,
            abi.encodeWithSignature(
                "setName(string,string)",
                _name,
                _tokenURI
            ),
            address(this)
        )
    {
        canteenManagementDescriptor.name = _name;
        setTokenURI(_tokenURI);
        emit StateChanged(canteenManagementDescriptor);
    }

    function setBpmn(
        string memory _bpmn,
        string memory _tokenURI
    )
        public
        evaluatedBySmartPolicies(
            msg.sender,
            abi.encodeWithSignature(
                "setBpmn(string,string)",
                _bpmn,
                _tokenURI
            ),
            address(this)
        )
    {
        canteenManagementDescriptor.bpmn = _bpmn;
        setTokenURI(_tokenURI);
        emit StateChanged(canteenManagementDescriptor);
    }

    function setMessages(
        bytes32[] memory _messages
    )
        public
        evaluatedBySmartPolicies(
            msg.sender,
            abi.encodeWithSignature(
                "setMessagese(bytes32[])",
                _messages
            ),
            address(this)
        )
    {
        canteenManagementDescriptor.messages = _messages;
        emit StateChanged(canteenManagementDescriptor);
    }
}
