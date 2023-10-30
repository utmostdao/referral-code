import { ethers, web3 } from "hardhat"
import { Network } from "hardhat/types"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { BigNumber, Contract, ContractReceipt, ContractTransaction, Wallet } from "ethers"

import { EXTRA_NETWORK_CONFIG } from "./configs"
import { ExtraNetworkConfig } from "./types"

export const addressToBytes32 = (address: string): string => {
    return ethers.utils.hexZeroPad(address, 32)
}

export const checkNetworkType = (
    chainId: number | BigNumber | string
): { devenv: string; networkConfig: ExtraNetworkConfig } => {
    const networkConfig = EXTRA_NETWORK_CONFIG[chainId as any]
    if (networkConfig === undefined) {
        throw new Error("Network not supported")
    }
    let devenv: string
    if (networkConfig.isLocalDev) {
        devenv = "localenv"
    } else if (networkConfig.isTestnet) {
        devenv = "testenv"
    } else if (networkConfig.isMainnet) {
        devenv = "mainenv"
    } else {
        throw new Error("Network with wrong config")
    }

    return {
        devenv: devenv,
        networkConfig: networkConfig,
    }
}

export const decodeParams = (types: string[], data: string): any => {
    return web3.eth.abi.decodeParameters(types, data)
}

export const deployNewContract = async (
    contractName: string,
    deployer: SignerWithAddress | Wallet,
    args: any[]
): Promise<Contract> => {
    const contractFactory = await ethers.getContractFactory(contractName, deployer)
    const targetC = await contractFactory.deploy(...args)
    await targetC.deployed()
    return targetC
}

export const encodeParams = (types: string[], values: any[], packed = false): string => {
    if (!packed) {
        return web3.eth.abi.encodeParameters(types, values)
    } else {
        return ethers.utils.solidityPack(types, values)
    }
}

export const getNetworkId = (network: Network): number => {
    // if network.config.chaindId is undefined, log error and return 0
    if (typeof network.config.chainId === "undefined") {
        console.error("chainId is undefined")
        return 0
    } else {
        return network.config.chainId
    }
}

export const getTargetEvent = async (
    txReceipt: ContractReceipt,
    targetEventName: string
): Promise<any> => {
    const targetEvent = txReceipt.events?.find((event) => event.event === targetEventName)
    return targetEvent
}

export const getTransactionReceipt = async (
    txResponse: ContractTransaction,
    waitConfirmations: number
): Promise<ContractReceipt> => {
    const txReceipt = await txResponse.wait(waitConfirmations)
    return txReceipt
}
