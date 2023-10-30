import { BigNumber } from "ethers"

export type ExtraNetworkConfig = {
    blockConfirmations: number
    isLocalDev: boolean
    isTestnet: boolean
    isMainnet: boolean
    gasPrice?: number
}
