import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

export async function deployChoreographyNMT() {
    // Contracts are deployed using the first signer/account by default

    // owner    - 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
    // account1 - 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
    // account2 - 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
    const [creator] = await ethers.getSigners();
    // console.log(owner.address)
    // console.log(account1.address)
    // console.log(account2.address)

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