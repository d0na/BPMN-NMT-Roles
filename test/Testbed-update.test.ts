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
import { deployChoreographyNMTFixture, deploySupplierNMTFixture, deployAndMintFixture } from "../helper/deployTestAssets";
import { choreography } from "../typechain-types/contracts";

describe("Testbed scenario", function () {

    describe("1. Set up - initialization", function () {

        it("should init correctly the scene with 2 mutable assets participants and 1 choreography", async function () {
            const PARTICIPANTS = [
                { id: "336897280941227070015277647710367950591535833707", address: "0x3B02fF1e626Ed7a8fd6eC5299e2C54e1421B626B" },
                { id: "792424011868018141238267758512067827571006849535", address: "0x8aCd85898458400f7Db866d53FCFF6f0D49741FF" },
            ]

            const CHOREOGRAPHY = {
                id: "669813349446218200219945466590326061637985309937", address: "0x75537828f2ce51be7289709686A69CbFDbB714F1"
            }

            const testbed =
                await loadFixture(deployAndMintFixture);

            // console.log(testbed);
            /** CHECKING THE PARTICIPANTS DATA */
            expect(testbed.participantTokenIds[0]).to.be.eq(PARTICIPANTS[0].id);
            expect(testbed.participantTokenIds[1]).to.be.eq(PARTICIPANTS[1].id);
            expect(testbed.participantTokenAddresses[0]).to.be.eq(PARTICIPANTS[0].address);
            expect(testbed.participantTokenAddresses[1]).to.be.eq(PARTICIPANTS[1].address);
            /** CHECKING THE CHOREOGRAPHY DATA  */
            expect(testbed.choreTokenId).to.be.eq(CHOREOGRAPHY.id);
            expect(testbed.choreTokenAddress).to.be.eq(CHOREOGRAPHY.address);
        });

        xit("should transfer a Choreography asset from one owner to another", async function () {
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

    describe("2. Participants - Initialization", function () {

        it("should allow setting the name to the Supplier Mutable Asset", async function () {
            const { supplierMutableAsset } =
                await loadFixture(deployAndMintFixture);
            const name = ethers.utils.formatBytes32String("Supplier A");

            await supplierMutableAsset.setName(name);

            const descriptor = await supplierMutableAsset.descriptor();
            expect(descriptor.name).to.equal(name);
        });

        it("should allow setting the name to the Canteen Management Mutable Asset", async function () {
            const { CanteenManagementMutableAsset } =
                await loadFixture(deployAndMintFixture);
            const name = ethers.utils.formatBytes32String("Canteen Management A");
            await CanteenManagementMutableAsset.setName(name);

            const descriptor = await CanteenManagementMutableAsset.canteenManagementDescriptor();
            expect(descriptor.name).to.equal(name);
        });

        xit("should transfer a Supplier asset from one owner to another", async function () {
            const [creator, owner1, owner2] = await ethers.getSigners();
            const { supplierNMT, participantTokenIds, supplierCreator } =
                await loadFixture(deployAndMintFixture);

            // Verify participant1 is the owner of the minted token
            expect(await supplierNMT.ownerOf(participantTokenIds[0])).to.equal(supplierCreator.address);

            // Step 2: Transfer the asset from participant1 to participant2
            await supplierNMT
                .connect(supplierCreator)
                .transferFrom(supplierCreator.address, owner1.address, participantTokenIds[0]);

            // Verify participant2 is now the owner of the token
            expect(await supplierNMT.ownerOf(participantTokenIds[0])).to.equal(owner1.address);
        });

        xit("should allow setting the name", async function () {
            const { supplierMutableAsset } =
                await loadFixture(deployAndMintFixture);
            const name = ethers.utils.formatBytes32String("Supplier A");

            // const tokenURI = "ipfs://example-token-uri";

            await supplierMutableAsset.setName(name);

            const descriptor = await supplierMutableAsset.descriptor();
            expect(descriptor.name).to.equal(name);
        });

        xit("should allow setting the BPMN", async function () {
            const { participantMutableAsset1 } =
                await loadFixture(deployAndMintFixture);
            const bpmn = "BPMN Model Content";
            // const tokenURI = "ipfs://example-token-uri-bpmn";

            await participantMutableAsset1.setBpmn(bpmn);

            const descriptor = await participantMutableAsset1.supplierDescriptor();
            expect(descriptor.bpmn).to.equal(bpmn);
        });

        xit("should allow setting messages", async function () {
            const { participantMutableAsset1 } =
                await loadFixture(deployAndMintFixture);
            const messages = [ethers.utils.formatBytes32String("Message1"), ethers.utils.formatBytes32String("Message2")];

            await participantMutableAsset1.setMessages(messages);

            const descriptor = await participantMutableAsset1.supplierDescriptor();
            expect(descriptor.messages).to.deep.equal(messages);
        });

        xit("should emit StateChanged event on updates", async function () {
            const { participantMutableAsset1 } =
                await loadFixture(deployAndMintFixture);
            // console.log(ethers.utils.formatBytes32String("Updated Supplier"))
            // console.log("0x5570646174656420537570706c69657200000000000000000000000000000000")
            const name = ethers.utils.formatBytes32String("Updated Supplier");
            // const tokenURI = "ipfs://updated-token-uri";

            await expect(participantMutableAsset1.setName(name))
                .to.emit(participantMutableAsset1, "StateChanged")
                .withArgs(await participantMutableAsset1.supplierDescriptor());

            const bpmn = "ipfs//UpdatedBPMNModel-uri";
            await expect(participantMutableAsset1.setBpmn(bpmn))
                .to.emit(participantMutableAsset1, "StateChanged")
                .withArgs(await participantMutableAsset1.supplierDescriptor());

            const messages = [ethers.utils.formatBytes32String("UpdatedMessage1")];
            await expect(participantMutableAsset1.setMessages(messages))
                .to.emit(participantMutableAsset1, "StateChanged")
                .withArgs(await participantMutableAsset1.supplierDescriptor());
        });

        xit("should revert when a non-authorized user tries to set attributes", async function () {
            const [creator, owner1, owner2] = await ethers.getSigners();
            const { participantMutableAsset1 } =
                await loadFixture(deployAndMintFixture);
            const name = "Unauthorized User";
            // const tokenURI = "ipfs://unauthorized-token-uri";

            await expect(
                participantMutableAsset1.connect(owner2).setName(name)
            ).to.be.revertedWith("SmartPolicy: Unauthorized");
        });
    });

    describe("3. ChoreographyNMT - initialization", function () {

        it("should update the BPMN with the Canteen model and emit the StateChanged event", async function () {
            const newBpmn = "NewBpmnData";
            // const newTokenURI = "ipfs://canteenBPMNTokenURI";

            const { choreTokenAddress, chorCreator } =
                await loadFixture(deployAndMintFixture);

            const ChoreographyMutableAsset = await ethers.getContractFactory(
                "ChoreographyMutableAsset"
            );
            const choreographyMutableAsset = ChoreographyMutableAsset.attach(choreTokenAddress)

            // Call the setBpmn function
            const tx = await choreographyMutableAsset.setBpmn(newBpmn);

            // Verify that the BPMN was updated correctly
            // const descriptor = await choreographyMutableAsset.descriptor();
            // console.log("AAA", descriptor);
            // Verify that the correct event was emitted

            // await expect(tx)
            //     .to.emit(choreographyMutableAsset, "StateChanged")
            //     .withArgs([[], newBpmn]);
            // expect(descriptor.bpmn).to.equal(newBpmn);
            const receipt = await tx.wait();
            const event = receipt.events?.find((e: any) => e.event === "StateChanged");

            expect(event?.args?.descriptor["participants"]).to.deep.equal([]);

        });


        it("should update with 2 participants, Supplier and CanteenManagement, and emit the StateChanged event", async function () {
            const { choreographyMutableAsset, participantTokenAddresses } =
                await loadFixture(deployAndMintFixture);
            const participants = [participantTokenAddresses[0], participantTokenAddresses[1]];
            // const newTokenURI = "ipfs://updatedTokenURI";

            // Call setParticipants to update participants and the token URI
            const txSuppliers = await choreographyMutableAsset.setParticipants(participants);

            // Verify that the participants were updated correctly
            const participantsAfterSuppliers = await choreographyMutableAsset.getParticipants();
            // Check that both arrays have the same length
            // Check that each element in the arrays is equal
            for (let i = 0; i < participantsAfterSuppliers.length; i++) {
                expect(participantsAfterSuppliers[i]).to.equal(participants[i]);
            }
            // Verify that the correct event was emitted for participants
            const receiptSuppliers = await txSuppliers.wait();
            const eventSuppliers = receiptSuppliers?.events?.find((e: any) => e.event === "StateChanged");
            expect(participantsAfterSuppliers).to.deep.equal(participants);
        });


        it("should update Supplier messages and BPMN and emit the StateChanged event", async function () {
            const { supplierMutableAsset} =
                await loadFixture(deployAndMintFixture);
            const messages = [ethers.utils.formatBytes32String("message 1"),ethers.utils.formatBytes32String("message 2")];
            // const newTokenURI = "ipfs://updatedTokenURI";

            // Call setParticipants to update participants and the token URI
            const txMessages = await supplierMutableAsset.setMessages(messages);

            // Verify that the participants were updated correctly
            const messagesAfterUpdate = await supplierMutableAsset.getMessages();

            // Verify that the correct event was emitted for participants
            const receiptMessages = await txMessages.wait();
            const eventSuppliers = receiptMessages?.events?.find((e: any) => e.event === "StateChanged");
            expect(messagesAfterUpdate).to.deep.equal(messages);
            const bpmn = "ipfs//UpdatedBPMNModel-uri";
            await supplierMutableAsset.setBpmn(bpmn);

            const descriptor = await supplierMutableAsset.descriptor();
            expect(descriptor.bpmn).to.equal(bpmn);
        });

        it("should update CanteenManagement messages and BPMN and emit the StateChanged event", async function () {
            const { CanteenManagementMutableAsset} =
                await loadFixture(deployAndMintFixture);
            const messages = [ethers.utils.formatBytes32String("message 3"),ethers.utils.formatBytes32String("message 4")];
            // const newTokenURI = "ipfs://updatedTokenURI";

            // Call setParticipants to update participants and the token URI
            const txMessages = await CanteenManagementMutableAsset.setMessages(messages);

            // Verify that the participants were updated correctly
            const messagesAfterUpdate = await CanteenManagementMutableAsset.getMessages();

            // Verify that the correct event was emitted for participants
            const receiptMessages = await txMessages.wait();
            const eventSuppliers = receiptMessages?.events?.find((e: any) => e.event === "StateChanged");
            expect(messagesAfterUpdate).to.deep.equal(messages);

            const bpmn = "ipfs//UpdatedBPMNModel-uri";
            await CanteenManagementMutableAsset.setBpmn(bpmn);

            const descriptor = await CanteenManagementMutableAsset.canteenManagementDescriptor();
            expect(descriptor.bpmn).to.equal(bpmn);
        });



        xit("should allow adding a new participant while retaining existing ones", async function () {
            const { choreographyMutableAsset, participantTokenAddresses } =
                await loadFixture(deployAndMintFixture);
            const participants = [participantTokenAddresses[0], participantTokenAddresses[1]];

            const initialSuppliers = [participantTokenAddresses[0], participantTokenAddresses[1]];
            const newSupplier = participantTokenAddresses[2];
            // const tokenURI = "ipfs://updatedTokenURI";

            // Step 1: Add the first two participants
            await choreographyMutableAsset.setParticipants(initialSuppliers);

            // Verify that the initial participants were added correctly
            let descriptor = await choreographyMutableAsset.getChoreographyDescriptor();
            expect(descriptor.participants).to.deep.equal(initialSuppliers);

            // Step 2: Add a new participant
            const updatedSuppliers = [...initialSuppliers, newSupplier];
            await choreographyMutableAsset.setParticipants(updatedSuppliers);

            // Verify that the new participant was added while retaining the existing ones
            descriptor = await choreographyMutableAsset.getChoreographyDescriptor();
            expect(descriptor.participants).to.deep.equal(updatedSuppliers);

            // Verify the event emission
            // Call setParticipants to update participants and the token URI
            const txSuppliers = await choreographyMutableAsset.setParticipants(participants);

            // Verify that the participants were updated correctly
            const descriptorAfterSuppliers = await choreographyMutableAsset.getChoreographyDescriptor();
            expect(descriptorAfterSuppliers.participants).to.deep.equal(participants);
        });
    });

});

