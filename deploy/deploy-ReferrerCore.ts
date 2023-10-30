import * as fs from "fs"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { ethers } from "hardhat"
import { Contract } from "ethers"
import { DeployFunction } from "hardhat-deploy/dist/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { checkNetworkType, getNetworkId } from "../utils/helpers"
import { DEPLOYMENT_RECORD_FRAMEWORK } from "../utils/constants"

/** 1. Define your preamble */
const contractName = "ReferrerCore"
let targetC: Contract
let whetherLog = true
let deployer: SignerWithAddress

const deployReferrerCore: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, network } = hre
    const { deploy, log } = deployments
    const chainId = getNetworkId(network)
    const { devenv, networkConfig } = checkNetworkType(chainId)

    /** 2. Define where to store your deployment results */
    const deploymentDataPath = `./configs/contract-address-${devenv}.json`
    let deploymentData = JSON.parse(fs.readFileSync(deploymentDataPath, "utf8"))

    /** 3. Define your deployment args */
    let deploymentArgs: any

    if (networkConfig.isLocalDev) {
        deployer = (await ethers.getSigners())[0]
        deploymentArgs = []
        whetherLog = true
    } else if (networkConfig.isTestnet) {
        deployer = (await ethers.getSigners())[0]
        deploymentArgs = []
        whetherLog = true
    } else if (networkConfig.isMainnet) {
        deployer = (await ethers.getSigners())[0]
        deploymentArgs = []
        whetherLog = true
    }

    /** 4. Start the contract Deployment */
    log("  --------------------<REFERRER CORE>-Deployment-Start--------------------")
    log(`******Deploying <${contractName}> to ${network.name}-${chainId} network******`)

    const deploymentReceipt = await deploy(contractName, {
        from: deployer.address,
        args: deploymentArgs,
        log: whetherLog,
        waitConfirmations: networkConfig.blockConfirmations,
    })

    targetC = await ethers.getContractAt(contractName, deploymentReceipt.address)

    log("  --------------------<REFERRER CORE>-Deployment-End--------------------")

    /** 5. Define how to save your deployment results */
    let nullRecord = DEPLOYMENT_RECORD_FRAMEWORK
    let isInRecord = false

    for (let id in deploymentData) {
        if (id === chainId.toString()) {
            deploymentData[id][contractName] = targetC.address
            isInRecord = true
        }
    }
    // Initialize the record if it is not in the record
    if (!isInRecord) {
        deploymentData[chainId] = nullRecord
        deploymentData[chainId][contractName] = targetC.address
    }

    fs.writeFileSync(deploymentDataPath, JSON.stringify(deploymentData))
}

export default deployReferrerCore
deployReferrerCore.tags = [contractName.toLowerCase()]
