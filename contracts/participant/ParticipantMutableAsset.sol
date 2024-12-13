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
        string name;
        string bpmn;
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
        participantDescriptor.name = _name;
        setTokenURI(_tokenURI);
        emit StateChanged(participantDescriptor);
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
        participantDescriptor.bpmn = _bpmn;
        setTokenURI(_tokenURI);
        emit StateChanged(participantDescriptor);
    }
}
