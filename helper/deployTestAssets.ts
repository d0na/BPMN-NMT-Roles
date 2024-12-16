import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { string } from "hardhat/internal/core/params/argumentTypes";

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

    return {
        choreographyNMT,
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


export async function deployAndMintFixture() {
    // Deploy Choreography and Participant NMT contracts
    const { choreographyNMT, creator: chorCreator, creatorSmartPolicy: chorCreatorSmartPolicy } =
        await loadFixture(deployChoreographyNMTFixture);

    const { participantNMT, creator: partCreator, creatorSmartPolicy: partCreatorSmartPolicy } =
        await loadFixture(deployParticipantNMTFixture);

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

    // Mint 3 Participant assets in parallel
    // const participantTokenIds = await PromisePromise.all(
    const participantTokenIds: string[] = [];
    const participantTokenAddresses: string[] = [];
    for (let i = 0; i < 3; i++) {
        const participantResult = await mintAsset(participantNMT, partCreator, partCreatorSmartPolicy);
        participantTokenIds.push(participantResult.tokenId);
        participantTokenAddresses.push(participantResult.tokenAddress);
    }

    // Mint 1 Choreography asset
    const chorResult = await mintAsset(choreographyNMT, chorCreator, chorCreatorSmartPolicy);

    const ParticipantMutableAsset = await ethers.getContractFactory(
        "ParticipantMutableAsset"
    ); const ChoreographyMutableAsset = await ethers.getContractFactory(
        "ChoreographyMutableAsset"
    );

    // Return all relevant data
    return {
        chorCreator,
        choreographyNMT,
        chorCreatorSmartPolicy,
        partCreator,
        participantNMT,
        partCreatorSmartPolicy,
        participantTokenIds,
        participantTokenAddresses,
        choreTokenAddress: chorResult.tokenAddress,
        choreTokenId: chorResult.tokenId,
        choreographyMutableAsset: ChoreographyMutableAsset.attach(chorResult.tokenAddress),
        participantMutableAsset1: ParticipantMutableAsset.attach(participantTokenAddresses[0]),
        participantMutableAsset2: ParticipantMutableAsset.attach(participantTokenAddresses[1]),
        participantMutableAsset3: ParticipantMutableAsset.attach(participantTokenAddresses[2])

    };
}





