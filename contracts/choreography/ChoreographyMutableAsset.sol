// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "hardhat/console.sol";
import "../base/MutableAsset.sol";
import "../base/SmartPolicy.sol";

/**
 * @title Smart Asset which represents a Choreography
 * @notice This Smart Contract contains all the Choreography properties and features which allows
 * it to mutate
 */
contract ChoreographyMutableAsset is MutableAsset {
    constructor(
        address _nmt,
        address _creatorSmartPolicy,
        address _holderSmartPolicy
    ) MutableAsset(_nmt, _creatorSmartPolicy, _holderSmartPolicy) {}

    // Choreography descriptor
    struct ChoreographyDescriptor {
        address[] participants;
        string bpmn;
    }

    // Current state representing choreography descriptor with its attributes
    ChoreographyDescriptor public choreographyDescriptor;

    /** Retrieves all the attributes of the descriptor Choreography */
    function getChoreographyDescriptor()
        public
        view
        returns (ChoreographyDescriptor memory)
    {
        return (choreographyDescriptor);
    }

    event StateChanged(ChoreographyDescriptor choreographyDescriptor);

    /**
     * USERS ACTIONS with attached policy
     */

    fallback() external {}

    function setParticipants(
        address[] memory _participants,
        string memory _tokenURI
    )
        public
        evaluatedBySmartPolicies(
            msg.sender,
            abi.encodeWithSignature(
                "setParticipants(address[],string)",
                _participants,
                _tokenURI
            ),
            address(this)
        )
    {
        choreographyDescriptor.participants = _participants;
        setTokenURI(_tokenURI);
        emit StateChanged(choreographyDescriptor);
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
        choreographyDescriptor.bpmn = _bpmn;
        setTokenURI(_tokenURI);
        emit StateChanged(choreographyDescriptor);
    }
}
