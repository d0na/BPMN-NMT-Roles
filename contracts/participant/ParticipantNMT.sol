// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "../base/NMT.sol";
import "./ParticipantMutableAsset.sol";
import "./CreatorSmartPolicy.sol";
import "./HolderSmartPolicy.sol";

/**
 * @title Participant Mutable NFT
 * @author 
 * @notice Mutable NFT contract which maintains the association with the Participant Asset
 */
contract ParticipantNMT is NMT {
    constructor(
        address to
    )
        NMT()
        ERC721(
            "Mutable Participant for a PUB Decentraland UniPi Project",
            "PUBMNTPARTICIPANT"
        )
    {}

    fallback() external {
        //console.log("Fallback ParticipantNMT");
    }

    /**
     * Real Token mint implementation
     * @param to  address of the new holder
     */
    function _mint(
        address to,
        address creatorSmartPolicy,
        address holderSmartPolicy
    ) internal override returns (address, uint) {
        // Asset creation by specifying the creator's address and smart Policies (creator and owner)
        ParticipantMutableAsset participant = new ParticipantMutableAsset(
            address(this),
            address(creatorSmartPolicy),
            address(holderSmartPolicy)
        );

        // Retrieving the tokenID and calling the ERC721 contract minting function
        uint tokenId = uint160(address(participant));

        _safeMint(to, tokenId);

        return (address(participant), tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        // Retrieving the contract address of the asset
        address asset_contract = _intToAddress(tokenId);

        // Retrieving the URI describing the asset's current state from the asset contract
        ParticipantMutableAsset asset = ParticipantMutableAsset(asset_contract);
        return asset.tokenURI();
    }
}
