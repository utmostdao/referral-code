const NULL_REFERRER_ID = "0"

module.exports = async function (taskArgs: any, hre: any) {
    const { contract, referrer } = taskArgs
    const { ethers } = hre

    const referrerC = await ethers.getContractAt("ReferrerCore", contract)

    const referrerId = Number(await referrerC.referrerAddressToId(referrer)).toString()

    console.log("Referrer ID:", referrerId)

    if (referrerId === NULL_REFERRER_ID) {
        console.log("Referrer is not registered")
    } else {
        // Fetch the corresponding extra info
        const info = (await referrerC.referrerIdToInfo(referrerId)).extraInfo

        // Decode the extra info
        let decodedRes: any
        if (info.substring(65, 66) !== "0") {
            if (info.substring(192, 194) === "60") {
                decodedRes = ethers.utils.defaultAbiCoder.decode(
                    ["uint8", "uint32", "string"],
                    info
                )
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

        console.log(decodedRes)
    }
}
