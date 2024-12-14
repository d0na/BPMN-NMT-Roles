import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

export async function deployChoreographyNMT() {
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
export async function deployParticipantNMT() {
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


export async function deployTestbedScenario() {

    const { choreographyNMT, creator: chorCreator, creatorSmartPolicy: chorCreatorSmartPolicy } = await deployChoreographyNMT()
    const { participantNMT, creator: partCreator, creatorSmartPolicy: partCreatorSmartPolicy } = await deployParticipantNMT()
    const tokenIds = [];

    for (let i = 0; i < 3; i++) {
        // Simulate the mint call to retrieve the asset address and token ID
        const mintResponse = await participantNMT.callStatic.mint(
            partCreator.address,
            partCreatorSmartPolicy.address,
            partCreatorSmartPolicy.address
        );

        const assetAddress = mintResponse[0]; // Address of the created asset
        const tokenId = mintResponse[1]; // Token ID returned as a BigNumber
        tokenIds.push(tokenId)

        // console.log("assetAddress:", assetAddress);
        // console.log("tokenId:", tokenId.toString()); // Log tokenId as a readable string

        // Execute the mint transaction
        await participantNMT.mint(
            partCreator.address,
            partCreatorSmartPolicy.address,
            partCreatorSmartPolicy.address
        );
    }


    return {
        chorCreator, choreographyNMT, chorCreatorSmartPolicy, partCreator, participantNMT, partCreatorSmartPolicy
        , tokenIds
    };
}




