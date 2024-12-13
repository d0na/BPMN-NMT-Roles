// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "../base/NMT.sol";
import "./ChoreographyMutableAsset.sol";
import "./CreatorSmartPolicy.sol";
import "./HolderSmartPolicy.sol";

/**
 * @title Choreography Mutable NFT
 * @author
 * @notice Mutable NFT contract which maintains the association with the Choreography Asset
 */
contract ChoreographyNMT is NMT {
    constructor(
        address to,
        address principalSmartPolicy
    )
        NMT(principalSmartPolicy)
        ERC721(
            "Mutable Choreography for a PUB Decentraland UniPi Project",
            "PUBMNTCHOREO"
        )
    {}

    fallback() external {}

    /**
     * Real Token mint implementation
     * @param to  address of the new holder
     */
    function _mint(
        address to,
        address creatorSmartPolicy,
        address holderSmartPolicy
    ) internal override returns (address, uint) {
        // Asset creation by specifying the creator's address and smart policies (creator and holder)
        ChoreographyMutableAsset choreography = new ChoreographyMutableAsset(
            address(this),
            address(creatorSmartPolicy),
            address(holderSmartPolicy)
        );

        // Retrieving the tokenID and calling the ERC721 contract minting function
        uint tokenId = uint160(address(choreography));

        _safeMint(to, tokenId);

        return (address(choreography), tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        // Retrieving the contract address of the asset
        address assetContract = _intToAddress(tokenId);

        // Retrieving the URI describing the asset's current state from the asset contract
        ChoreographyMutableAsset asset = ChoreographyMutableAsset(assetContract);
        return asset.tokenURI();
    }
}
