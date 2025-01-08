// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "hardhat/console.sol";
import "../base/SmartPolicy.sol";

contract CreatorSmartPolicy is SmartPolicy {
    constructor() {}

    function evaluate(
        address _subject,
        bytes memory _action,
        address _resource
    ) public view virtual override returns (bool) {
        // Example logic: Allow only the creator of the resource to perform actions
        // Check if the subject is the creator (simplified logic here)
        // Replace this with actual creator-check logic
        // address creator = _resource; // Assuming resource stores creator's address
        if (_subject == 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266) {
            return true;
        }

        
        return false; // Deny
    }

    fallback() external {
        // console.log("Fallback CreatorSmartPolicy");
    }
}
