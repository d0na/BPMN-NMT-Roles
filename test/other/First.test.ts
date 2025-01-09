import {
    time,
    loadFixture,
    mine,
    impersonateAccount,
} from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { string } from "hardhat/internal/core/params/argumentTypes";
import * as _ from "../../typechain-types";
import { deployChoreographyNMTFixture, deploySupplierNMTFixture ,deployCanteenManagementNMTFixture} from "../../helper/deployTestAssets";

const BPMN_IPFS_HASH = "QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq";

describe("Choreography NMT tests", function () {

    describe("Minting-related tests", function () {

        it("should allow a Creator to mint and own a new Choreography NMT", async function () {
            const { choreographyNMT, creator, creatorSmartPolicy } =
                await loadFixture(deployChoreographyNMTFixture);

            // Simulate the mint call to retrieve the asset address and token ID
            const mintResponse = await choreographyNMT.callStatic.mint(
                creator.address,
                creatorSmartPolicy.address,
                creatorSmartPolicy.address
            );

            const assetAddress = mintResponse[0]; // Address of the created asset
            const tokenId = mintResponse[1]; // Token ID returned as a BigNumber

            // console.log("assetAddress:", assetAddress);
            // console.log("tokenId:", tokenId.toString()); // Log tokenId as a readable string

            // Execute the mint transaction
            await choreographyNMT.mint(
                creator.address,
                creatorSmartPolicy.address,
                creatorSmartPolicy.address
            );

            // Verify that the creator is the owner of the token
            expect(await choreographyNMT.ownerOf(tokenId)).to.equal(creator.address);
        });
    });
});

describe("Participants NMT tests", function () {

    describe("Minting-related tests", function () {

        it("should allow a Creator to mint and own a new Supplier Mutable Asset", async function () {
            const { supplierNMT, creator, creatorSmartPolicy } =
                await loadFixture(deploySupplierNMTFixture);

            // Simulate the mint call to retrieve the asset address and token ID
            const mintResponse = await supplierNMT.callStatic.mint(
                creator.address,
                creatorSmartPolicy.address,
                creatorSmartPolicy.address
            );

            const assetAddress = mintResponse[0]; // Address of the created asset
            const tokenId = mintResponse[1]; // Token ID returned as a BigNumber

            // console.log("assetAddress:", assetAddress);
            // console.log("tokenId:", tokenId.toString()); // Log tokenId as a readable string

            // Execute the mint transaction
            await supplierNMT.mint(
                creator.address,
                creatorSmartPolicy.address,
                creatorSmartPolicy.address
            );

            // Verify that the creator is the owner of the token
            expect(await supplierNMT.ownerOf(tokenId)).to.equal(creator.address);
        });

        it("should allow a Creator to mint and own a new CanteenManagement Mutable Asset", async function () {
            const { canteenManagementNMT, creator, creatorSmartPolicy } =
                await loadFixture(deployCanteenManagementNMTFixture);

            // Simulate the mint call to retrieve the asset address and token ID
            const mintResponse = await canteenManagementNMT.callStatic.mint(
                creator.address,
                creatorSmartPolicy.address,
                creatorSmartPolicy.address
            );

            const assetAddress = mintResponse[0]; // Address of the created asset
            const tokenId = mintResponse[1]; // Token ID returned as a BigNumber

            // console.log("assetAddress:", assetAddress);
            // console.log("tokenId:", tokenId.toString()); // Log tokenId as a readable string

            // Execute the mint transaction
            await canteenManagementNMT.mint(
                creator.address,
                creatorSmartPolicy.address,
                creatorSmartPolicy.address
            );

            // Verify that the creator is the owner of the token
            expect(await canteenManagementNMT.ownerOf(tokenId)).to.equal(creator.address);
        });

    });
});
