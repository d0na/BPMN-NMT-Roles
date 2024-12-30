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

    describe("Initialization", function () {

        it("should init correctly the scene with 3 mutable assets participants and 1 choreography", async function () {
            const PARTICIPANTS = [
                { id: "336897280941227070015277647710367950591535833707", address: "0x3B02fF1e626Ed7a8fd6eC5299e2C54e1421B626B" },
                { id: "792424011868018141238267758512067827571006849535", address: "0x8aCd85898458400f7Db866d53FCFF6f0D49741FF" },
                { id: "179488605541745556890669495909881143792961313405", address: "0x1F708C24a0D3A740cD47cC0444E9480899f3dA7D" }
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
            expect(testbed.participantTokenIds[2]).to.be.eq(PARTICIPANTS[2].id);
            expect(testbed.participantTokenAddresses[0]).to.be.eq(PARTICIPANTS[0].address);
            expect(testbed.participantTokenAddresses[1]).to.be.eq(PARTICIPANTS[1].address);
            expect(testbed.participantTokenAddresses[2]).to.be.eq(PARTICIPANTS[2].address);
            /** CHECKING THE CHOREOGRAPHY DATA  */
            expect(testbed.choreTokenId).to.be.eq(CHOREOGRAPHY.id);
            expect(testbed.choreTokenAddress).to.be.eq(CHOREOGRAPHY.address);
        });

        it("should transfer a Choreography asset from one owner to another", async function () {
            const [creator, owner1, owner2] = await ethers.getSigners();
            const { choreographyNMT,choreography } =
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
    describe("ChoreographyNMT", function () {

        it("should update the BPMN and emit the StateChanged event", async function () {
            const newBpmn = "NewBpmnData";
            const newTokenURI = "ipfs://newTokenURI";

            const { choreTokenAddress, chorCreator } =
                await loadFixture(deployAndMintFixture);
            const ChoreographyMutableAsset = await ethers.getContractFactory(
                "ChoreographyMutableAsset"
            );
            const choreographyMutableAsset = ChoreographyMutableAsset.attach(choreTokenAddress)

            // Call the setBpmn function
            const tx = await choreographyMutableAsset.setBpmn(newBpmn, newTokenURI);

            // Verify that the BPMN was updated correctly
            const descriptor = await choreographyMutableAsset.getChoreographyDescriptor();
            // console.log("AAA", descriptor);
            // Verify that the correct event was emitted

            // await expect(tx)
            //     .to.emit(choreographyMutableAsset, "StateChanged")
            //     .withArgs([[], newBpmn]);
            // expect(descriptor.bpmn).to.equal(newBpmn);
            const receipt = await tx.wait();
            const event = receipt.events.find((e: any) => e.event === "StateChanged");

            expect(event.args.choreographyDescriptor.participants).to.deep.equal([]);
            expect(event.args.choreographyDescriptor.bpmn).to.equal(newBpmn);

        });

        it("should update with 2 participants, and emit the StateChanged event", async function () {
            const { choreographyMutableAsset, participantTokenAddresses } =
                await loadFixture(deployAndMintFixture);
            const participants = [participantTokenAddresses[0], participantTokenAddresses[1]];
            const newTokenURI = "ipfs://updatedTokenURI";

            // Call setParticipants to update participants and the token URI
            const txSuppliers = await choreographyMutableAsset.setParticipants(participants, newTokenURI);

            // Verify that the participants were updated correctly
            const descriptorAfterSuppliers = await choreographyMutableAsset.getChoreographyDescriptor();
            expect(descriptorAfterSuppliers.participants).to.deep.equal(participants);

            // Verify that the correct event was emitted for participants
            const receiptSuppliers = await txSuppliers.wait();
            const eventSuppliers = receiptSuppliers.events.find((e: any) => e.event === "StateChanged");
            expect(eventSuppliers.args.choreographyDescriptor.participants).to.deep.equal(participants);
        });

        it("should allow adding a new participant while retaining existing ones", async function () {
            const { choreographyMutableAsset, participantTokenAddresses } =
                await loadFixture(deployAndMintFixture);
            const participants = [participantTokenAddresses[0], participantTokenAddresses[1]];

            const initialSuppliers = [participantTokenAddresses[0], participantTokenAddresses[1]];
            const newSupplier = participantTokenAddresses[2];
            const tokenURI = "ipfs://updatedTokenURI";

            // Step 1: Add the first two participants
            await choreographyMutableAsset.setParticipants(initialSuppliers, tokenURI);

            // Verify that the initial participants were added correctly
            let descriptor = await choreographyMutableAsset.getChoreographyDescriptor();
            expect(descriptor.participants).to.deep.equal(initialSuppliers);

            // Step 2: Add a new participant
            const updatedSuppliers = [...initialSuppliers, newSupplier];
            await choreographyMutableAsset.setParticipants(updatedSuppliers, tokenURI);

            // Verify that the new participant was added while retaining the existing ones
            descriptor = await choreographyMutableAsset.getChoreographyDescriptor();
            expect(descriptor.participants).to.deep.equal(updatedSuppliers);

            // Verify the event emission
            // Call setParticipants to update participants and the token URI
            const txSuppliers = await choreographyMutableAsset.setParticipants(participants, tokenURI);

            // Verify that the participants were updated correctly
            const descriptorAfterSuppliers = await choreographyMutableAsset.getChoreographyDescriptor();
            expect(descriptorAfterSuppliers.participants).to.deep.equal(participants);
        });
    });
    describe("ParticipantsNMT", function () {

        it("should transfer a Supplier asset from one owner to another", async function () {
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

        it("should allow setting the name", async function () {
            const { participantMutableAsset1 } =
            await loadFixture(deployAndMintFixture);
            const name = "Supplier A";
            const tokenURI = "ipfs://example-token-uri";
        
            await participantMutableAsset1.setName(name, tokenURI);
        
            const descriptor = await participantMutableAsset1.supplierDescriptor();
            expect(descriptor.name).to.equal(name);
          });
        
          it("should allow setting the BPMN", async function () {
            const { participantMutableAsset1 } =
            await loadFixture(deployAndMintFixture);
            const bpmn = "BPMN Model Content";
            const tokenURI = "ipfs://example-token-uri-bpmn";
        
            await participantMutableAsset1.setBpmn(bpmn, tokenURI);
        
            const descriptor = await participantMutableAsset1.supplierDescriptor();
            expect(descriptor.bpmn).to.equal(bpmn);
          });
        
          it("should allow setting messages", async function () {
            const { participantMutableAsset1 } =
            await loadFixture(deployAndMintFixture);
            const messages = [ethers.utils.formatBytes32String("Message1"), ethers.utils.formatBytes32String("Message2")];
        
            await participantMutableAsset1.setMessages(messages);
        
            const descriptor = await participantMutableAsset1.supplierDescriptor();
            expect(descriptor.messages).to.deep.equal(messages);
          });
        1
          it("should emit StateChanged event on updates", async function () {
            const { participantMutableAsset1 } =
            await loadFixture(deployAndMintFixture);
            const name = "Updated Supplier";
            const tokenURI = "ipfs://updated-token-uri";
        
            await expect(participantMutableAsset1.setName(name, tokenURI))
              .to.emit(participantMutableAsset1, "StateChanged")
              .withArgs(await participantMutableAsset1.supplierDescriptor());
        
            const bpmn = "Updated BPMN Model";
            await expect(participantMutableAsset1.setBpmn(bpmn, tokenURI))
              .to.emit(participantMutableAsset1, "StateChanged")
              .withArgs(await participantMutableAsset1.supplierDescriptor());
        
            const messages = [ethers.utils.formatBytes32String("UpdatedMessage1")];
            await expect(participantMutableAsset1.setMessages(messages))
              .to.emit(participantMutableAsset1, "StateChanged")
              .withArgs(await participantMutableAsset1.supplierDescriptor());
          });
        
          it("should revert when a non-authorized user tries to set attributes", async function () {
            const [creator, owner1, owner2] = await ethers.getSigners();
            const { participantMutableAsset1 } =
            await loadFixture(deployAndMintFixture);
            const name = "Unauthorized User";
            const tokenURI = "ipfs://unauthorized-token-uri";
        
            await expect(
                participantMutableAsset1.connect(owner2).setName(name, tokenURI)
            ).to.be.revertedWith("SmartPolicy: Unauthorized");
          });
    });         
});

