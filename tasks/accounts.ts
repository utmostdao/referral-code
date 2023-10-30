module.exports = async function (taskArgs: any, hre: any) {
    const accounts = await hre.ethers.getSigners()

    for (const account of accounts) {
        const balance = await hre.ethers.provider.getBalance(account.address)
        console.log(account.address, hre.ethers.utils.formatEther(balance).toString())
    }
}
