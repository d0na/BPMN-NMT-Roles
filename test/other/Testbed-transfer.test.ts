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
import { deployChoreographyNMTFixture, deploySupplierNMTFixture, deployAndMintFixture } from "../../helper/deployTestAssets";
import { choreography } from "../../typechain-types/contracts";

describe("Testbed scenario - [Transfer]", function () {

    describe("1. Chreography", function () {

        it("should transfer a Choreography asset from one owner to another", async function () {
            const [creator, owner1, owner2] = await ethers.getSigners();
            const { choreographyNMT, choreography } =
                await loadFixture(deployChoreographyNMTFixture);

            // Verify participant1 is the owner of the minted token
            expect(await choreographyNMT.ownerOf(choreography.tokenId)).to.equal(creator.address);

            // Step 2: Transfer the asset from participant1 to participant2
            await choreographyNMT
                .connect(creator)
                .transferFrom(creator.address, owner1.address, choreography.tokenId);

            // Verify participant2 is now the owner of the token
            expect(await choreographyNMT.ownerOf(choreography.tokenId)).to.equal(owner1.address);
        });
    });

    describe("2. Participants", function () {

        it("should transfer a Supplier asset from one owner to another", async function () {
            const [creator, owner1, owner2] = await ethers.getSigners();
            const { supplierNMT, participantTokenIds } =
                await loadFixture(deployAndMintFixture);

            // Verify participant1 is the owner of the minted token
            expect(await supplierNMT.ownerOf(participantTokenIds[0])).to.equal(creator.address);

            // Step 2: Transfer the asset from participant1 to participant2
            await supplierNMT
                .connect(creator)
                .transferFrom(creator.address, owner1.address, participantTokenIds[0]);

            // Verify participant2 is now the owner of the token
            expect(await supplierNMT.ownerOf(participantTokenIds[0])).to.equal(owner1.address);
        });
    });
});

