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
    struct Descriptor {
        address[] participants;
        string bpmn;
    }

    function getParticipants() public view returns (address[] memory) {
        return descriptor.participants;
    }
    // Current state representing choreography descriptor with its attributes
    Descriptor public descriptor;

    event StateChanged(Descriptor descriptor);

    /**
     * USERS ACTIONS with attached policy
     */

    fallback() external {}

    function setParticipants(
        address[] memory _participants
    )
        public
        evaluatedBySmartPolicies(
            msg.sender,
            abi.encodeWithSignature(
                "setParticipants(address[])",
                _participants
            ),
            address(this)
        )
    {
        descriptor.participants = _participants;
        emit StateChanged(descriptor);
    }

    function setBpmn(
        string memory _bpmn
    )
        public
        evaluatedBySmartPolicies(
            msg.sender,
            abi.encodeWithSignature("setBpmn(string,string)", _bpmn),
            address(this)
        )
    {
        descriptor.bpmn = _bpmn;
        emit StateChanged(descriptor);
    }

    function setTokenURI(
        string memory _uri
    )
        public
        evaluatedBySmartPolicies(
            msg.sender,
            abi.encodeWithSignature("setTokenURI(string)"),
            address(this)
        )
    {
        _setTokenURI(_uri);
    }
}
