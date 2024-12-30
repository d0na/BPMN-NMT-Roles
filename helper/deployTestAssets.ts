import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { string } from "hardhat/internal/core/params/argumentTypes";

// Helper function for minting assets
const mintAsset = async (nmtContract: any, creator: any, smartPolicy: any) => {
    const mintResponse = await nmtContract.callStatic.mint(
        creator.address,
        smartPolicy.address,
        smartPolicy.address
    );
    const tokenAddress = mintResponse[0]; // Address of the created asset
    const tokenId = mintResponse[1]; // Extract tokenId
    await nmtContract.mint(
        creator.address,
        smartPolicy.address,
        smartPolicy.address
    );
    return { tokenAddress, tokenId };
};

export async function deployChoreographyNMTFixture() {
    // Contracts are deployed using the first signer/account by default

    // owner    - 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
    // account1 - 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
    // account2 - 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
    const [creator] = await ethers.getSigners();

    /** CREATOR SMART POLICY */
    const CreatorSmartPolicy = await ethers.getContractFactory(
        "contracts/choreography/CreatorSmartPolicy.sol:CreatorSmartPolicy"
    );
    const creatorSmartPolicy = await CreatorSmartPolicy.deploy();

    /** HOLDER SMART POLICY */
    const HolderSmartPolicy = await ethers.getContractFactory(
        "contracts/choreography/HolderSmartPolicy.sol:HolderSmartPolicy"
    );
    const holderSmartPolicy = await CreatorSmartPolicy.deploy();


    const ChoreographyNMT = await ethers.getContractFactory("ChoreographyNMT");
    const choreographyNMT = await ChoreographyNMT.deploy(creator.address);



    // // CreatorSmartPolicyNoTransferAllowed
    // const CreatorSmartPolicyNoTransferAllowed = await ethers.getContractFactory(
    //     "CreatorSmartPolicyNoTransferAllowed"
    // );
    // const creatorSmartPolicyNoTransferAllowed = await CreatorSmartPolicyNoTransferAllowed.deploy();
    const choreography = await mintAsset(choreographyNMT, creator, creatorSmartPolicy);
    return {
        choreographyNMT,
        creatorSmartPolicy,
        creator,
        choreography
    };
}
export async function deploySupplierNMTFixture() {
    // Contracts are deployed using the first signer/account by default

    // owner    - 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
    // account1 - 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
    // account2 - 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
    const [creator] = await ethers.getSigners();

    /** CREATOR SMART POLICY */
    const CreatorSmartPolicy = await ethers.getContractFactory(
        "contracts/supplier/CreatorSmartPolicy.sol:CreatorSmartPolicy"
    );
    const creatorSmartPolicy = await CreatorSmartPolicy.deploy();

    /** HOLDER SMART POLICY */
    const HolderSmartPolicy = await ethers.getContractFactory(
        "contracts/supplier/HolderSmartPolicy.sol:HolderSmartPolicy"
    );
    const holderSmartPolicy = await CreatorSmartPolicy.deploy();


    const SupplierNMT = await ethers.getContractFactory("SupplierNMT");
    const supplierNMT = await SupplierNMT.deploy(creator.address);


    // // CreatorSmartPolicyNoTransferAllowed
    // const CreatorSmartPolicyNoTransferAllowed = await ethers.getContractFactory(
    //     "CreatorSmartPolicyNoTransferAllowed"
    // );
    // const creatorSmartPolicyNoTransferAllowed = await CreatorSmartPolicyNoTransferAllowed.deploy();

    return {
        supplierNMT,
        creatorSmartPolicy,
        creator
    };
}

export async function deployParticipantNMTFixture() {
    // Contracts are deployed using the first signer/account by default

    // owner    - 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
    // account1 - 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
    // account2 - 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
    const [creator] = await ethers.getSigners();

    /** CREATOR SMART POLICY */
    const CreatorSmartPolicy = await ethers.getContractFactory(
        "contracts/participant/CreatorSmartPolicy.sol:CreatorSmartPolicy"
    );
    const creatorSmartPolicy = await CreatorSmartPolicy.deploy();

    /** HOLDER SMART POLICY */
    const HolderSmartPolicy = await ethers.getContractFactory(
        "contracts/participant/HolderSmartPolicy.sol:HolderSmartPolicy"
    );
    const holderSmartPolicy = await CreatorSmartPolicy.deploy();


    const ParticipantNMT = await ethers.getContractFactory("ParticipantNMT");
    const participantNMT = await ParticipantNMT.deploy(creator.address);


    // // CreatorSmartPolicyNoTransferAllowed
    // const CreatorSmartPolicyNoTransferAllowed = await ethers.getContractFactory(
    //     "CreatorSmartPolicyNoTransferAllowed"
    // );
    // const creatorSmartPolicyNoTransferAllowed = await CreatorSmartPolicyNoTransferAllowed.deploy();

    return {
        participantNMT,
        creatorSmartPolicy,
        creator
    };
}

export async function deployCanteenManagementNMTFixture() {
    // Contracts are deployed using the first signer/account by default

    // owner    - 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
    // account1 - 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
    // account2 - 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
    const [creator] = await ethers.getSigners();

    /** CREATOR SMART POLICY */
    const CreatorSmartPolicy = await ethers.getContractFactory(
        "contracts/canteenManagement/CreatorSmartPolicy.sol:CreatorSmartPolicy"
    );
    const creatorSmartPolicy = await CreatorSmartPolicy.deploy();

    /** HOLDER SMART POLICY */
    const HolderSmartPolicy = await ethers.getContractFactory(
        "contracts/canteenManagement/HolderSmartPolicy.sol:HolderSmartPolicy"
    );
    const holderSmartPolicy = await CreatorSmartPolicy.deploy();

    /** CANTEEN MANAGEMENT NMT */
    const CanteenManagementNMT = await ethers.getContractFactory("CanteenManagementNMT");
    const canteenManagementNMT = await CanteenManagementNMT.deploy(creator.address);

    // // CreatorSmartPolicyNoTransferAllowed
    // const CreatorSmartPolicyNoTransferAllowed = await ethers.getContractFactory(
    //     "CreatorSmartPolicyNoTransferAllowed"
    // );
    // const creatorSmartPolicyNoTransferAllowed = await CreatorSmartPolicyNoTransferAllowed.deploy();

    return {
        canteenManagementNMT,
        creatorSmartPolicy,
        creator
    };
}



export async function deployAndMintFixture() {
    // Deploy Choreography and Supplier NMT contracts
    const { choreographyNMT, creator: chorCreator, creatorSmartPolicy: chorCreatorSmartPolicy, choreography } =
        await loadFixture(deployChoreographyNMTFixture);
    const { supplierNMT, creator: supplierCreator, creatorSmartPolicy: supplierCreatorSmartPolicy } =
        await loadFixture(deploySupplierNMTFixture);
    const { canteenManagementNMT, creator: canteenCreator, creatorSmartPolicy: canteenCreatorSmartPolicy } =
        await loadFixture(deployCanteenManagementNMTFixture);
    const { participantNMT, creator: participantCreator, creatorSmartPolicy: participantCreatorSmartPolicy } =
        await loadFixture(deployParticipantNMTFixture);


    // Mint 3 Supplier assets in parallel
    // const participantTokenIds = await PromisePromise.all(
    const participantTokenIds: string[] = [];
    const participantTokenAddresses: string[] = [];

    // Supplier 
    const supplierResult = await mintAsset(supplierNMT, supplierCreator, supplierCreatorSmartPolicy);
    participantTokenIds.push(supplierResult.tokenId);
    participantTokenAddresses.push(supplierResult.tokenAddress);

    // Canteen 
    const canteenMngResult = await mintAsset(canteenManagementNMT, canteenCreator, canteenCreatorSmartPolicy);
    participantTokenIds.push(canteenMngResult.tokenId);
    participantTokenAddresses.push(canteenMngResult.tokenAddress);

    // Participant
    const participantResult = await mintAsset(participantNMT, participantCreator, participantCreatorSmartPolicy);
    participantTokenIds.push(participantResult.tokenId);
    participantTokenAddresses.push(participantResult.tokenAddress);

    // console.log("participantTokenIds", participantTokenIds);
    // console.log("participantTokenAddresses", participantTokenAddresses);

    // Mint 1 Choreography asset
    // const chorResult = await mintAsset(choreographyNMT, chorCreator, chorCreatorSmartPolicy);

    const SupplierMutableAsset = await ethers.getContractFactory(
        "SupplierMutableAsset"
    ); const ChoreographyMutableAsset = await ethers.getContractFactory(
        "ChoreographyMutableAsset"
    );

    // Return all relevant data
    return {
        chorCreator,
        choreographyNMT,
        chorCreatorSmartPolicy,
        supplierCreator,
        supplierNMT,
        supplierCreatorSmartPolicy,
        participantCreator,
        participantNMT,
        participantCreatorSmartPolicy,
        canteenCreator,
        canteenManagementNMT,
        canteenCreatorSmartPolicy,
        participantTokenIds,
        participantTokenAddresses,
        choreTokenAddress: choreography.tokenAddress,
        choreTokenId: choreography.tokenId,
        choreographyMutableAsset: ChoreographyMutableAsset.attach(choreography.tokenAddress),
        participantMutableAsset1: SupplierMutableAsset.attach(participantTokenAddresses[0]),
        participantMutableAsset2: SupplierMutableAsset.attach(participantTokenAddresses[1]),
        participantMutableAsset3: SupplierMutableAsset.attach(participantTokenAddresses[2])

    };
}





