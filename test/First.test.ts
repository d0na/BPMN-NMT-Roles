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
import { deployChoreographyNMT } from "../helper/deployTestAssets";
import { BigNumber } from "ethers";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const TOKEN_ID1_STRING = "1158808384137004768675244516077074077445013636396";
const TOKEN_ID2_STRING = "908326538895415626116914244041615655093740059278";


const ASSET_ADDRESS1 = "0xCafac3dD18aC6c6e92c921884f9E4176737C052c";
const ASSET_ADDRESS2 = "0x9f1ac54BEF0DD2f6f3462EA0fa94fC62300d3a8e";

describe("Choreography NMT tests", function () {

    describe("Minting-related tests", function () {

        it("should allow a Creator to mint and own a new Choreography NMT", async function () {
            const { choreographyNMT, creator, creatorSmartPolicy } =
                await loadFixture(deployChoreographyNMT);

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