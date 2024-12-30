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
    struct SupplierDescriptor {
        string name;
        string bpmn;
        bytes32[] messages;
    }

    // Current state representing supplier descriptor with its attributes
    SupplierDescriptor public supplierDescriptor;

    /** Retrieves all the attributes of the descriptor Supplier
     * 
     * TODO forse visto che supplierDescriptor è public nn doverebbe servire
     */
    function getSupplierDescriptor()
        public
        view
        returns (SupplierDescriptor memory)
    {
        return (supplierDescriptor);
    }

    event StateChanged(SupplierDescriptor supplierDescriptor);

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
        supplierDescriptor.name = _name;
        setTokenURI(_tokenURI);
        emit StateChanged(supplierDescriptor);
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
        supplierDescriptor.bpmn = _bpmn;
        setTokenURI(_tokenURI);
        emit StateChanged(supplierDescriptor);
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
        supplierDescriptor.messages = _messages;
        emit StateChanged(supplierDescriptor);
    }
}
