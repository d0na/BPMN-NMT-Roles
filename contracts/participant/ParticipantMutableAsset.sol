// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

// Uncomment this line to use console.log
import "hardhat/console.sol";
import "../base/MutableAsset.sol";
import "../base/SmartPolicy.sol";

/**
 * @title Smart Asset which represents a Participant
 * @author Francesco Donini <francesco.donini@phd.unipi.it>
 * @notice This Smart Contract contains all the Participant properties and features which allows
 * it to mutate
 */
contract ParticipantMutableAsset is MutableAsset {
    /** */
    constructor(
        address _nmt,
        address _creatorSmartPolicy,
        address _holderSmartPolicy
    ) MutableAsset(_nmt, _creatorSmartPolicy, _holderSmartPolicy) {}

    // Participant descriptor
    struct ParticipantDescriptor {
        bytes32 name;
        string bpmn;
        bytes32 descriptor;
        bytes32[] messages;
    }

    // Current state representing participant descriptor with its attributes
    ParticipantDescriptor public participantDescriptor;

    /** Retrieves all the attributes of the descriptor Participant
     * 
     * TODO forse visto che participantDescriptor è public nn doverebbe servire
     */
    function getParticipantDescriptor()
        public
        view
        returns (ParticipantDescriptor memory)
    {
        return (participantDescriptor);
    }

    event StateChanged(ParticipantDescriptor participantDescriptor);

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
        participantDescriptor.name = _name;
        emit StateChanged(participantDescriptor);
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
         participantDescriptor.bpmn = _bpmn;
        emit StateChanged( participantDescriptor);
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
         participantDescriptor.messages = _messages;
        emit StateChanged( participantDescriptor);
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
}
