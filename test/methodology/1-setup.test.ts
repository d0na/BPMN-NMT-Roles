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
        const rr = await supplierNMT.deployTransaction.wait();

        // GAs used
        const gasUsed = rr.gasUsed;
        console.log(`Gas used[supplierNMT]: ${gasUsed.toString()}`);
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

        /* CanteenManagement */
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
                const r1 = await tx.wait();
                console.log(`Gas used [setDescriptor Supplier]: ${r1.gasUsed.toString()}`);

                const receipt = await tx.wait();
                const event = receipt.events?.find((e: any) => e.event === "StateChanged");
                expect(event?.args?.descriptor.descriptor).to.deep.equal(descriptor);
            });

            it("Should allow the owner of CanteenManagement Mutable Asset to add the description “Canteen SRL”", async function () {
                const descriptor = ethers.utils.formatBytes32String("Canteen SRL");
                // await canteenAssetContract.connect(canteen).setHolderSmartPolicy(allowMunicipalitySmartPolicy.address);
                const tx = await canteenAssetContract.connect(canteen).setDescriptor(descriptor);
                const r2 = await tx.wait();
                console.log(`Gas used [setDescriptor Canteen]: ${r2.gasUsed.toString()}`);

                const receipt = await tx.wait();
                const event = receipt.events?.find((e: any) => e.event === "StateChanged");
                expect(event?.args?.canteenManagementDescriptor.descriptor).to.deep.equal(descriptor);
            });
        });

        describe("Choreography", function () {

            it("Should allow the creator Municipality to add the BPMN model to the Choreography Mutable Asset", async function () {
                const bpmn = "ipfs://choreography-canteen-bpmn";
                const tx = await chorAssetContract.connect(municipality).setBpmn(bpmn);
                const r1 = await tx.wait();
                console.log(`Gas used [setBpmn Choreography]: ${r1.gasUsed.toString()}`);

                const receipt = await tx.wait();
                const event = receipt.events?.find((e: any) => e.event === "StateChanged");
                expect(event?.args?.descriptor.bpmn).to.deep.equal(bpmn);
            });

            it("Should allow the creator Municipality to add Supplier and Canteen mutable assets as participants", async function () {
                const participants = [supplierAssetContract.address, canteenAssetContract.address];
                const tx = await chorAssetContract.connect(municipality).setParticipants(participants);
                const r1 = await tx.wait();
                console.log(`Gas used [setParticipants Choreography]: ${r1.gasUsed.toString()}`);

                const chorePartipants = await chorAssetContract.getParticipants();
                expect(chorePartipants).to.deep.equal(participants);
            });



            it("Should allow the creator Municipality to add messages to Supplier and Canteen mutable assets", async function () {
                const supplierMessages = [ethers.utils.formatBytes32String("MessageSupplier1"), ethers.utils.formatBytes32String("MessageSupplier2")];
                const tx1 = await supplierAssetContract.connect(municipality).setMessages(supplierMessages);

                const r1 = await tx1.wait();
                console.log(`Gas used [setMessages Supplier]: ${r1.gasUsed.toString()}`);
                const canteenMessages = [ethers.utils.formatBytes32String("MessageCanteen1"), ethers.utils.formatBytes32String("MessageCanteen2")];
                const tx2 = await canteenAssetContract.connect(municipality).setMessages(canteenMessages);
                const r2 = await tx1.wait();
                console.log(`Gas used [setMessages Canteen]: ${r2.gasUsed.toString()}`);

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
});