// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "../base/NMT.sol";
import "./SupplierMutableAsset.sol";
import "./CreatorSmartPolicy.sol";
import "./HolderSmartPolicy.sol";

/**
 * @title Supplier Mutable NFT
 * @author 
 * @notice Mutable NFT contract which maintains the association with the Supplier Asset
 */
contract SupplierNMT is NMT {
    constructor(
        address to
    )
        NMT()
        ERC721(
            "Mutable Supplier for a PUB Decentraland UniPi Project",
            "PUBMNTPARTICIPANT"
        )
    {}

    fallback() external {
        //console.log("Fallback SupplierNMT");
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
        SupplierMutableAsset supplier = new SupplierMutableAsset(
            address(this),
            address(creatorSmartPolicy),
            address(holderSmartPolicy)
        );

        // Retrieving the tokenID and calling the ERC721 contract minting function
        uint tokenId = uint160(address(supplier));

        _safeMint(to, tokenId);

        return (address(supplier), tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        // Retrieving the contract address of the asset
        address asset_contract = _intToAddress(tokenId);

        // Retrieving the URI describing the asset's current state from the asset contract
        SupplierMutableAsset asset = SupplierMutableAsset(asset_contract);
        return asset.tokenURI();
    }
}
