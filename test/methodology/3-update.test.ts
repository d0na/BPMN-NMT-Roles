import { participant } from "../typechain-types/contracts";

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ChorNMT - Testbed Assets Evolution", function () {
    let ChoreographyNMT, SupplierNMT, CanteenManagementNMT;
    let choreographyNMT: any, supplierNMT: any, canteenManagementNMT: any;
    let ChoreographyMutableAsset, SupplierMutableAsset, CanteenManagementMutableAsset;
    let choreCreatorSmartPolicy: any, choreHolderSmartPolicy: any;
    let supplierCreatorSmartPolicy: any, supplierHolderSmartPolicy: any, allowMunicipalitySmartPolicy: any;
    let canteenManagementCreatorSmartPolicy: any, canteenManagementHolderSmartPolicy: any;
    let municipality: any, supplier1: any, canteen: any, supplier2: any, school: any, participant: any;
    let choreTokenId: any, supplierTokenId: any, canteenTokenId: any;
    let chorAssetContract: any, supplierAssetContract: any, canteenAssetContract: any;

    before(async function () {
        // Deploy dependencies
        [municipality, supplier1, canteen, supplier2, school, participant] = await ethers.getSigners();

        // console.log("municipality", municipality.address);
        // console.log("supplier1", supplier1.address);
        // console.log("canteen", canteen.address);
        // console.log("supplier2", supplier2.address);
        // console.log("school", school.address);
        // console.log("participant", participant.address);

        // ** Choreography **
        ChoreographyNMT = await ethers.getContractFactory("ChoreographyNMT");
        choreographyNMT = await ChoreographyNMT.deploy(municipality.address);
        await choreographyNMT.deployed(municipality.address);

        const ChoreCreatorSmartPolicy = await ethers.getContractFactory("contracts/choreography/CreatorSmartPolicy.sol:CreatorSmartPolicy");
        choreCreatorSmartPolicy = await ChoreCreatorSmartPolicy.deploy();
        await choreCreatorSmartPolicy.deployed();

        const ChoreHolderSmartPolicy = await ethers.getContractFactory("contracts/choreography/HolderSmartPolicy.sol:HolderSmartPolicy");
        choreHolderSmartPolicy = await ChoreHolderSmartPolicy.deploy();
        await choreHolderSmartPolicy.deployed();

        // Mint token once and retrieve the asset contract
        const txChore = await choreographyNMT
            .connect(municipality)
            .mint(municipality.address, choreCreatorSmartPolicy.address, choreHolderSmartPolicy.address);
        const receipt = await txChore.wait();
        choreTokenId = receipt.events[0].args.tokenId;

        // Attach the asset contract
        const choreographyAssetAddress = ethers.BigNumber.from(choreTokenId).toHexString();
        ChoreographyMutableAsset = await ethers.getContractFactory("ChoreographyMutableAsset");
        chorAssetContract = ChoreographyMutableAsset.attach(choreographyAssetAddress);

        /* SUPPLIER */
        // ** SupplierCreatorSmartPolicy **
        const SupplierCreatorSmartPolicy = await ethers.getContractFactory("contracts/supplier/CreatorSmartPolicy.sol:CreatorSmartPolicy");
        supplierCreatorSmartPolicy = await SupplierCreatorSmartPolicy.deploy();
        await supplierCreatorSmartPolicy.deployed();

        // ** SupplierHolderSmartPolicy **
        const SupplierHolderSmartPolicy = await ethers.getContractFactory("contracts/supplier/HolderSmartPolicy.sol:HolderSmartPolicy");
        supplierHolderSmartPolicy = await SupplierHolderSmartPolicy.deploy();
        await supplierHolderSmartPolicy.deployed();

        // ** SupplierNMT **
        SupplierNMT = await ethers.getContractFactory("SupplierNMT");
        supplierNMT = await SupplierNMT.deploy(municipality.address);
        await supplierNMT.deployed();

        // ** Supplier token mint hold by  supplier1 **
        const txSupplier = await supplierNMT
            .connect(municipality)
            .mint(supplier1.address, supplierCreatorSmartPolicy.address, supplierHolderSmartPolicy.address);
        const receiptSupplier = await txSupplier.wait();
        supplierTokenId = receiptSupplier.events[0].args.tokenId;

        // ** Supplier Mutable asset contract **
        const supplierAssetAddress = ethers.BigNumber.from(supplierTokenId).toHexString();
        SupplierMutableAsset = await ethers.getContractFactory("SupplierMutableAsset");
        supplierAssetContract = SupplierMutableAsset.attach(supplierAssetAddress);

        /** CanteenManagement */

        // ** CanteenCreatorSmartPolicy **
        const CanteenCreatorSmartPolicy = await ethers.getContractFactory("contracts/canteenManagement/CreatorSmartPolicy.sol:CreatorSmartPolicy");
        canteenManagementCreatorSmartPolicy = await CanteenCreatorSmartPolicy.deploy();
        await canteenManagementCreatorSmartPolicy.deployed();

        // ** CanteenHolderSmartPolicy **
        const CanteenHolderSmartPolicy = await ethers.getContractFactory("contracts/canteenManagement/HolderSmartPolicy.sol:HolderSmartPolicy");
        canteenManagementHolderSmartPolicy = await CanteenHolderSmartPolicy.deploy();
        await canteenManagementHolderSmartPolicy.deployed();

        // ** CanteenManagementNMT **
        CanteenManagementNMT = await ethers.getContractFactory("CanteenManagementNMT");
        canteenManagementNMT = await CanteenManagementNMT.deploy(municipality.address);
        await canteenManagementNMT.deployed();

        // ** Canteen token mint hold by canteen **
        const txCanteen = await canteenManagementNMT
            .connect(municipality)
            .mint(canteen.address, canteenManagementCreatorSmartPolicy.address, canteenManagementHolderSmartPolicy.address);
        const receiptCanteen = await txCanteen.wait();
        canteenTokenId = receiptCanteen.events[0].args.tokenId;

        // ** Canteen Mutable asset contract **
        const canteenAssetAddress = ethers.BigNumber.from(canteenTokenId).toHexString();
        CanteenManagementMutableAsset = await ethers.getContractFactory("CanteenManagementMutableAsset");
        canteenAssetContract = CanteenManagementMutableAsset.attach(canteenAssetAddress);

        // // ** AllowMunicipalitySmartPolicy **
        // const AllowMunicipalitySmartContract = await ethers.getContractFactory("AllowMunicipalitySmartPolicy");
        // allowMunicipalitySmartPolicy = await AllowMunicipalitySmartContract.deploy();
        // await allowMunicipalitySmartPolicy.deployed();
    });

    describe("Stage - [Setup]", function () {
        describe("Participants", function () {

            it("Should allow the owner of Supplier Mutable Asset to add the description “Supplier SRL”", async function () {
                const descriptor = ethers.utils.formatBytes32String("Supplier SRL");
                // await supplierAssetContract.connect(supplier1).setHolderSmartPolicy(allowMunicipalitySmartPolicy.address);
                const tx = await supplierAssetContract.connect(supplier1).setDescriptor(descriptor);

                const receipt = await tx.wait();
                const event = receipt.events?.find((e: any) => e.event === "StateChanged");
                expect(event?.args?.descriptor.descriptor).to.deep.equal(descriptor);
            });

            it("Should allow the owner of CanteenManagement Mutable Asset to add the description “Canteen SRL”", async function () {
                const descriptor = ethers.utils.formatBytes32String("Canteen SRL");
                // await canteenAssetContract.connect(canteen).setHolderSmartPolicy(allowMunicipalitySmartPolicy.address);
                const tx = await canteenAssetContract.connect(canteen).setDescriptor(descriptor);

                const receipt = await tx.wait();
                const event = receipt.events?.find((e: any) => e.event === "StateChanged");
                expect(event?.args?.canteenManagementDescriptor.descriptor).to.deep.equal(descriptor);
            });
        });

        describe("Choreography", function () {

            it("Should allow the creator Municipality to add the BPMN model to the Choreography Mutable Asset", async function () {
                const bpmn = "ipfs://choreography-canteen-bpmn";
                const tx = await chorAssetContract.connect(municipality).setBpmn(bpmn);

                const receipt = await tx.wait();
                const event = receipt.events?.find((e: any) => e.event === "StateChanged");
                expect(event?.args?.descriptor.bpmn).to.deep.equal(bpmn);
            });

            it("Should allow the creator Municipality to add Supplier and Canteen mutable assets as participants", async function () {
                const participants = [supplierAssetContract.address, canteenAssetContract.address];
                await chorAssetContract.connect(municipality).setParticipants(participants);

                const chorePartipants = await chorAssetContract.getParticipants();
                expect(chorePartipants).to.deep.equal(participants);
            });



            it("Should allow the creator Municipality to add messages to Supplier and Canteen mutable assets", async function () {
                const supplierMessages = [ethers.utils.formatBytes32String("MessageSupplier1"), ethers.utils.formatBytes32String("MessageSupplier2")];
                await supplierAssetContract.connect(municipality).setMessages(supplierMessages);


                const canteenMessages = [ethers.utils.formatBytes32String("MessageCanteen1"), ethers.utils.formatBytes32String("MessageCanteen2")];
                await canteenAssetContract.connect(municipality).setMessages(canteenMessages);

                const supplierMessagesAfter = await supplierAssetContract.getMessages();
                expect(supplierMessagesAfter).to.deep.equal(supplierMessages);

                const canteenMessagesAfter = await canteenAssetContract.getMessages();
                expect(canteenMessagesAfter).to.deep.equal(canteenMessages);
            });

            // xit("Should verify participants persist between tests", async function () {
            //     const participants = await assetContract.getParticipants();
            //     expect(participants).to.have.members([supplier1.address, canteen.address]);
            // });

            // xit("Should verify asset metadata evolution", async function () {
            //     const initialTokenURI = await assetContract.tokenURI();

            //     // Simulate an update in the asset
            //     await assetContract.connect(supplier1).updateMetadata("New Metadata URI");

            //     const updatedTokenURI = await assetContract.tokenURI();
            //     expect(updatedTokenURI).to.not.equal(initialTokenURI);
            //     expect(updatedTokenURI).to.equal("New Metadata URI");
            // });
        });
    });
    describe("Stage - [Transfer]", function () {
        describe("Choreography", function () {


            it("Should transfer the Mutable Asset Choreography from Municipality to School", async function () {
                // Verify participant1 is the owner of the minted token
                expect(await choreographyNMT.ownerOf(choreTokenId)).to.equal(municipality.address);
                // Step 2: Transfer the asset from participant1 to participant2
                await choreographyNMT
                    .connect(municipality)
                    .transferFrom(municipality.address, school.address, choreTokenId);

                // // Verify participant2 is now the owner of the token
                expect(await choreographyNMT.ownerOf(choreTokenId)).to.equal(school.address);
            });
        });
        describe("Supplier", function () {

            it("Should transfer the Mutable Asset Supplier from Supplier1 to Supplier2", async function () {
                // Verify participant1 is the owner of the minted token
                expect(await supplierNMT.ownerOf(supplierTokenId)).to.equal(supplier1.address);
                // Step 2: Transfer the asset from participant1 to participant2
                await supplierNMT
                    .connect(supplier1)
                    .transferFrom(supplier1.address, supplier2.address, supplierTokenId);

                // // Verify participant2 is now the owner of the token
                expect(await supplierNMT.ownerOf(supplierTokenId)).to.equal(supplier2.address);
            });
        });
    });
    describe("Stage - [Update]", function () {

        it("Should allow the creator Municipality to update the Supplier mutable asset by adding a message", async function () {
            const messages: string[] = await supplierAssetContract.getMessages();
            const newMessage = ethers.utils.formatBytes32String("New Message");
            const updatedMessages = [...messages, newMessage];
            await supplierAssetContract.connect(supplier2).setHolderSmartPolicy(supplierHolderSmartPolicy.address);
            console.log("updatedMessages", updatedMessages);
            const tx = await supplierAssetContract.connect(municipality).setMessages(updatedMessages);
            const receipt = await tx.wait();
            console.log(`Gas used [setMessages]: ${receipt.gasUsed.toString()}`);

            const descriptorMessages = await supplierAssetContract.getMessages();
            expect(descriptorMessages).to.deep.equal(updatedMessages);
        });

        it("Should allow the creator Municipality to add a new participant to the participants list of the Choreography", async function () {
            // Deploy the ParticipantNMT contract
            const ParticipantNMT = await ethers.getContractFactory("ParticipantNMT");
            const participantNMT = await ParticipantNMT.deploy(participant.address);
            await participantNMT.deployed();

            // Mint a new ParticipantMutableAsset token
            const ParticipantCreatorSmartPolicy = await ethers.getContractFactory(
                "contracts/participant/CreatorSmartPolicy.sol:CreatorSmartPolicy"
            );
            const participantCreatorSmartPolicy = await ParticipantCreatorSmartPolicy.deploy();
            await participantCreatorSmartPolicy.deployed();

            const ParticipantHolderSmartPolicy = await ethers.getContractFactory(
                "contracts/participant/HolderSmartPolicy.sol:HolderSmartPolicy"
            );
            const participantHolderSmartPolicy = await ParticipantHolderSmartPolicy.deploy();
            await participantHolderSmartPolicy.deployed();

            const txParticipant = await participantNMT
                .connect(municipality)
                .mint(participant.address, participantCreatorSmartPolicy.address, participantHolderSmartPolicy.address);
            const receiptParticipant = await txParticipant.wait();
            const participantTokenId = receiptParticipant.events[0].args.tokenId;

            // Attach the ParticipantMutableAsset contract
            const participantAssetAddress = ethers.BigNumber.from(participantTokenId).toHexString();
            const ParticipantMutableAsset = await ethers.getContractFactory("ParticipantMutableAsset");
            const participantAssetContract = ParticipantMutableAsset.attach(participantAssetAddress);

            // Add the new participant to the choreography
            const participants = [supplierAssetContract.address, canteenAssetContract.address, participantAssetContract.address];
            await chorAssetContract.connect(school).setHolderSmartPolicy(choreHolderSmartPolicy.address);
            await chorAssetContract.connect(municipality).setParticipants(participants);

            const updatedParticipants = await chorAssetContract.getParticipants();
            expect(updatedParticipants).to.deep.equal(participants);
        });

        it("Should allow the creator Municipality to add the updated BPMN model to the Choreography Mutable Asset", async function () {
            const bpmn = "ipfs://choreography-updated-canteen-bpmn";
            const tx = await chorAssetContract.connect(municipality).setBpmn(bpmn);
            const receipt = await tx.wait();
            console.log(`Gas used [setBpmn]: ${receipt.gasUsed.toString()}`);

            const event = receipt.events?.find((e: any) => e.event === "StateChanged");
            expect(event?.args?.descriptor.bpmn).to.deep.equal(bpmn);
        });
    });
});