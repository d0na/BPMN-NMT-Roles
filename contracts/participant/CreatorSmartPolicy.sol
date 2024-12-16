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
        address creator = _resource; // Assuming resource stores creator's address
       
        return true; // Deny
    }

    fallback() external {
        // console.log("Fallback CreatorSmartPolicy");
    }
}
