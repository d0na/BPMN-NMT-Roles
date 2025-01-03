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
        bytes32 name;
        string bpmn;
        bytes32 descriptor;
        bytes32[] messages;
    }

    // Current state representing canteenManagement descriptor with its attributes
    CanteenManagementDescriptor public canteenManagementDescriptor;

    /** Retrieves all the attributes of the descriptor CanteenManagement
     * 
     * TODO forse visto che canteenManagementDescriptor è public nn doverebbe servire
     */
    function getDescriptor()
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
        bytes32  _name
    )
        public
        evaluatedBySmartPolicies(
            msg.sender,
            abi.encodeWithSignature(
                "setName(bytes32)",
                _name
            ),
            address(this)
        )
    {
         canteenManagementDescriptor.name = _name;
        emit StateChanged( canteenManagementDescriptor);
    }

    function setBpmn(
        string memory _bpmn
    )
        public
        evaluatedBySmartPolicies(
            msg.sender,
            abi.encodeWithSignature(
                "setBpmn(string)",
                _bpmn
            ),
            address(this)
        )
    {
          canteenManagementDescriptor.bpmn = _bpmn;
        emit StateChanged(  canteenManagementDescriptor);
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
        emit StateChanged(  canteenManagementDescriptor);
    }

    function setTokenURI(
        string memory _uri
    )
        public
        evaluatedBySmartPolicies(
            msg.sender,
            abi.encodeWithSignature(
                "setTokenURI(string)"),
            address(this)
        )
    {
        _setTokenURI(_uri);
    }

    function getMessages() public view returns (bytes32[] memory) {
        return canteenManagementDescriptor.messages;
    }    
}
