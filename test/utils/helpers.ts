import { ethers } from "hardhat"

export const decodeReferrerExtraInfo = (info: string): any => {
    let decodedRes
    if (info.substring(65, 66) !== "0") {
        if (info.substring(192, 194) === "60") {
            decodedRes = ethers.utils.defaultAbiCoder.decode(["uint8", "uint32", "string"], info)
            decodedRes = {
                version: decodedRes[0],
                parentReferrerId: decodedRes[1],
                primaryTag: decodedRes[2],
            }
        } else if (info.substring(192, 194) === "80") {
            decodedRes = ethers.utils.defaultAbiCoder.decode(
                ["uint8", "uint32", "string", "string"],
                info
            )
            decodedRes = {
                version: decodedRes[0],
                parentReferrerId: decodedRes[1],
                primaryTag: decodedRes[2],
                secondaryTag: decodedRes[3],
            }
        } else {
            console.log("Wrong")
        }
    } else {
        if (info.substring(64, 66) === "20") {
            decodedRes = ethers.utils.defaultAbiCoder.decode(["string"], info)
        } else if (info.substring(64, 66) === "40") {
            decodedRes = ethers.utils.defaultAbiCoder.decode(["string", "string"], info)
        } else {
            console.log("Wrong")
        }
    }

    return decodedRes
}
