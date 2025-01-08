// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "hardhat/console.sol";
import "../base/SmartPolicy.sol";

contract HolderSmartPolicy is SmartPolicy {
    constructor() {}

    function evaluate(
        address _subject,
        bytes memory _action,
        address _resource
    ) public view virtual override returns (bool) {
        // Example logic: Allow actions only if the subject is the current holder
        // Check if the subject is the current holder (simplified logic here)
        // Replace this with actual holder-check logic
        address currentHolder = _resource; // Assuming resource stores holder's address

        // if (_subject == currentHolder) {
        //     return true; // Allow
        // }

        // return false; // Deny
        return true;
    }

    fallback() external {
        // console.log("Fallback HolderSmartPolicy");
    }
}
