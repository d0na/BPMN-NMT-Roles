// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

// Uncomment this line to use console.log
import "hardhat/console.sol";
import "../base/MutableAsset.sol";
import "../base/SmartPolicy.sol";

/**
 * @title Smart Asset which represents a Supplier
 * @author Francesco Donini <francesco.donini@phd.unipi.it>
 * @notice This Smart Contract contains all the Supplier properties and features which allows
 * it to mutate
 */
contract SupplierMutableAsset is MutableAsset {
    /** */
    constructor(
        address _nmt,
        address _creatorSmartPolicy,
        address _holderSmartPolicy
    ) MutableAsset(_nmt, _creatorSmartPolicy, _holderSmartPolicy) {}

    // Supplier descriptor
    struct Descriptor {
        bytes32 name;
        string bpmn;
        bytes32 descriptor;
        bytes32[] messages;
    }

    // Current state representing supplier descriptor with its attributes
    Descriptor public descriptor;

    /** Retrieves all the attributes of the descriptor Supplier
     * 
     * TODO forse visto che supplierDescriptor è public nn doverebbe servire
     */
    function getDescriptor()
        public
        view
        returns (Descriptor memory)
    {
        return (descriptor);
    }

    event StateChanged(Descriptor descriptor);

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
        descriptor.name = _name;
        emit StateChanged(descriptor);
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
        descriptor.bpmn = _bpmn;
        emit StateChanged(descriptor);
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
        descriptor.messages = _messages;
        emit StateChanged(descriptor);
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
