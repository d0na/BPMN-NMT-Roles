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
import * as _ from "../typechain-types";
import { deployChoreographyNMTFixture, deployParticipantNMTFixture } from "../helper/deployTestAssets";

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

describe("Participant NMT tests", function () {

    describe("Minting-related tests", function () {

        it("should allow a Creator to mint and own a new Participant NMT", async function () {
            const { participantNMT, creator, creatorSmartPolicy } =
                await loadFixture(deployParticipantNMTFixture);

            // Simulate the mint call to retrieve the asset address and token ID
            const mintResponse = await participantNMT.callStatic.mint(
                creator.address,
                creatorSmartPolicy.address,
                creatorSmartPolicy.address
            );

            const assetAddress = mintResponse[0]; // Address of the created asset
            const tokenId = mintResponse[1]; // Token ID returned as a BigNumber

            // console.log("assetAddress:", assetAddress);
            // console.log("tokenId:", tokenId.toString()); // Log tokenId as a readable string

            // Execute the mint transaction
            await participantNMT.mint(
                creator.address,
                creatorSmartPolicy.address,
                creatorSmartPolicy.address
            );

            // Verify that the creator is the owner of the token
            expect(await participantNMT.ownerOf(tokenId)).to.equal(creator.address);
        });
    });
});
