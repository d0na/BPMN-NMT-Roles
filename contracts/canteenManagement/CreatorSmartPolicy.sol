// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "hardhat/console.sol";
import "../base/SmartPolicy.sol";
import "../base/MutableAsset.sol";

contract CreatorSmartPolicy is SmartPolicy {
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

    function _isWinner(address _subject) private pure returns (bool) {
        return
            _subject == 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 ||
            _subject == 0x90F79bf6EB2c4f870365E785982E1f101E93b906;
    }

    function getTrasnferFromParam(
        bytes calldata _payload
    ) public pure returns (address, address) {
        return abi.decode(_payload[4:], (address, address));
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

    bytes4 internal constant ACT_TRANSFER_FROM =
        bytes4(keccak256("transferFrom(address,address)"));

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

        if (_signature == ACT_TRANSFER_FROM) {
            (address from, address to) = this.getTrasnferFromParam(_action);
            return _isWinner(to);
        }

        if (_signature == ACT_SET_MESSAGES) {
            return _isCreator(_subject);
        }

        return false; // Deny
    }

    fallback() external {
        // console.log("Fallback CreatorSmartPolicy");
    }
}
