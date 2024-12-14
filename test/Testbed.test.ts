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
import { deployChoreographyNMT, deployParticipantNMT, deployTestbedScenario } from "../helper/deployTestAssets";

const BPMN_IPFS_HASH = "QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq";

describe("Testbed scenario", function () {

    describe("Init", function () {

        it("should allow a Creator to mint and own a new Choreography NMT", async function () {
            const testbed =
                await loadFixture(deployTestbedScenario);
            console.log(testbed);
        });
    });
});

