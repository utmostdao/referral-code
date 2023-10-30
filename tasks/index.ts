import { task } from "hardhat/config"

task("accounts", "Prints the list of accounts", require("./accounts"))
task(
    "getExtraInfo",
    "Get the extra information of a registered referrer",
    require("./referrer/getExtraInfo")
)
    .addParam("contract", "Address of ReferrerCore")
    .addParam("referrer", "Address of referrer")
