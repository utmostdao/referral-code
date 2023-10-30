import { ExtraNetworkConfig } from "./types"

export const EXTRA_NETWORK_CONFIG: Record<number, ExtraNetworkConfig> = {
    /** Local Development Network */
    31337: {
        blockConfirmations: 1,
        isLocalDev: true,
        isTestnet: false,
        isMainnet: false,
    },
    /** Mainnets */
    // Ethereum
    1: {
        blockConfirmations: 6,
        isLocalDev: false,
        isTestnet: false,
        isMainnet: true,
    },
    // Polygon
    137: {
        blockConfirmations: 6,
        isLocalDev: false,
        isTestnet: false,
        isMainnet: true,
    },
    /** Testnets */
    // Ethereum Goerli
    5: {
        blockConfirmations: 6,
        isLocalDev: false,
        isTestnet: true,
        isMainnet: false,
    },
    // zkSync Era Goerli
    280: {
        blockConfirmations: 6,
        isLocalDev: false,
        isTestnet: true,
        isMainnet: false,
    },
    // Ethereum Sepolia
    11155111: {
        blockConfirmations: 6,
        isLocalDev: false,
        isTestnet: true,
        isMainnet: false,
    },
}
