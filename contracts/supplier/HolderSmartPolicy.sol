// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "hardhat/console.sol";
import "../base/SmartPolicy.sol";
import "../base/MutableAsset.sol";

contract HolderSmartPolicy is SmartPolicy {
    constructor() {}

    // Condition
    function _isOwner(
        address _subject,
        address _resource
    ) private view returns (bool) {
        return MutableAsset(_resource).getHolder() == _subject;
    }

    function _isCreator(address _subject) private pure returns (bool) {
        return 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 == _subject;
    }

    // municipality 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

    function getSetDescriptorParam(
        bytes calldata _payload
    ) public pure returns (bytes32) {
        return abi.decode(_payload[4:], (bytes32));
    }

    bytes4 internal constant ACT_SET_DESCRIPTOR =
        bytes4(keccak256("setDescriptor(bytes32)"));

    bytes4 internal constant ACT_SET_MESSAGES =
        bytes4(keccak256("setMessages(bytes32[])"));

    function evaluate(
        address _subject,
        bytes memory _action,
        address _resource
    ) public view virtual override returns (bool) {
        bytes4 _signature = this.decodeSignature(_action);

        if (_signature == ACT_SET_DESCRIPTOR) {
            // perform conditions evaluation (AND | OR)
            return _isOwner(_subject, _resource) || _isCreator(_subject);
        }

        if (_signature == ACT_SET_MESSAGES) {
            return _isCreator(_subject);
        }

        return false; // Deny
    }

    fallback() external {
        // console.log("Fallback HolderSmartPolicy");
    }
}
