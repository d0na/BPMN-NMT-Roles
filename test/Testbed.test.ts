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
import { deployChoreographyNMTFixture, deployParticipantNMTFixture, deployAndMintFixture } from "../helper/deployTestAssets";
import { choreography } from "../typechain-types/contracts";

describe("Testbed scenario", function () {

    describe("Initialization", function () {

        it("should init correctly the scene with 3 mutable assets participants and 1 choreography", async function () {
            const PARTICIPANTS = [
                { id: "558130032094690731733874505575102638784315995105", address: "0x61c36a8d610163660E21a8b7359e1Cac0C9133e1" },
                { id: "204704989530607081745330947688586125522717815614", address: "0x23dB4a08f2272df049a4932a4Cc3A6Dc1002B33E" },
                { id: "816253975297965843894876292431442714180448216066", address: "0x8EFa1819Ff5B279077368d44B593a4543280e402" }
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
            const txParticipants = await choreographyMutableAsset.setParticipants(participants, newTokenURI);

            // Verify that the participants were updated correctly
            const descriptorAfterParticipants = await choreographyMutableAsset.getChoreographyDescriptor();
            expect(descriptorAfterParticipants.participants).to.deep.equal(participants);

            // Verify that the correct event was emitted for participants
            const receiptParticipants = await txParticipants.wait();
            const eventParticipants = receiptParticipants.events.find((e: any) => e.event === "StateChanged");
            expect(eventParticipants.args.choreographyDescriptor.participants).to.deep.equal(participants);
        });

        it("should allow adding a new participant while retaining existing ones", async function () {
            const { choreographyMutableAsset, participantTokenAddresses } =
                await loadFixture(deployAndMintFixture);
            const participants = [participantTokenAddresses[0], participantTokenAddresses[1]];

            const initialParticipants = [participantTokenAddresses[0], participantTokenAddresses[1]];
            const newParticipant = participantTokenAddresses[2];
            const tokenURI = "ipfs://updatedTokenURI";

            // Step 1: Add the first two participants
            await choreographyMutableAsset.setParticipants(initialParticipants, tokenURI);

            // Verify that the initial participants were added correctly
            let descriptor = await choreographyMutableAsset.getChoreographyDescriptor();
            expect(descriptor.participants).to.deep.equal(initialParticipants);

            // Step 2: Add a new participant
            const updatedParticipants = [...initialParticipants, newParticipant];
            await choreographyMutableAsset.setParticipants(updatedParticipants, tokenURI);

            // Verify that the new participant was added while retaining the existing ones
            descriptor = await choreographyMutableAsset.getChoreographyDescriptor();
            expect(descriptor.participants).to.deep.equal(updatedParticipants);

            // Verify the event emission
            // Call setParticipants to update participants and the token URI
            const txParticipants = await choreographyMutableAsset.setParticipants(participants, tokenURI);

            // Verify that the participants were updated correctly
            const descriptorAfterParticipants = await choreographyMutableAsset.getChoreographyDescriptor();
            expect(descriptorAfterParticipants.participants).to.deep.equal(participants);
        });
    });
    describe("PartipantNMT", function () {

        it("should transfer a Participant asset from one owner to another", async function () {
            const [creator, owner1, owner2] = await ethers.getSigners();
            const { participantNMT, participantTokenIds, partCreator } =
                await loadFixture(deployAndMintFixture);

            // Verify participant1 is the owner of the minted token
            expect(await participantNMT.ownerOf(participantTokenIds[0])).to.equal(partCreator.address);

            // Step 2: Transfer the asset from participant1 to participant2
            await participantNMT
                .connect(partCreator)
                .transferFrom(partCreator.address, owner1.address, participantTokenIds[0]);

            // Verify participant2 is now the owner of the token
            expect(await participantNMT.ownerOf(participantTokenIds[0])).to.equal(owner1.address);
        });
    });
});

