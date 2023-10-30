import { deployments, ethers, network } from "hardhat"
import { LOCAL_DEV_NETWORK_NAMES } from "../../utils/constants"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"

import * as C from "../../typechain-types"
import { encodeParams, getTargetEvent, getTransactionReceipt } from "../../utils/helpers"
import { decodeReferrerExtraInfo } from "../utils/helpers"

const NULL_ADDRESS = "0x0000000000000000000000000000000000000000"
const NULL_BYTES32 = "0x0000000000000000000000000000000000000000000000000000000000000000"
const DEFAULT_REFERRER_ID = 1

!LOCAL_DEV_NETWORK_NAMES.includes(network.name)
    ? describe.skip
    : describe("ReferrerCore", () => {
          let deployer: SignerWithAddress
          let user1: SignerWithAddress
          let user2: SignerWithAddress
          let referrerC: C.ReferrerCore

          beforeEach(async () => {
              deployer = (await ethers.getSigners())[0]
              user1 = (await ethers.getSigners())[1]
              user2 = (await ethers.getSigners())[2]

              const deploymentResults = await deployments.fixture(["referrercore"])

              /** Main Contracts */
              referrerC = (await ethers.getContractAt(
                  "ReferrerCore",
                  deploymentResults["ReferrerCore"].address
              )) as C.ReferrerCore
          })

          it("initial states", async () => {
              // Check whether a address has registered as a referrer
              expect(await referrerC.referrerAddressToId(user1.address)).to.be.equal(0)

              const referrerInfo = await referrerC.referrerIdToInfo(0)
              expect(referrerInfo.referrer).to.be.equal(NULL_ADDRESS)
              expect(referrerInfo.extraInfo).to.be.equal("0x")
          })

          describe("register", () => {
              it("should register when unpaused", async () => {
                  const extraInfo = ethers.utils.defaultAbiCoder.encode(
                      ["string", "string"],
                      ["Genesis Referrer", "Tag 1"]
                  )

                  await expect(referrerC.connect(user1).pause()).to.be.revertedWith(
                      "Ownable: caller is not the owner"
                  )

                  await referrerC.connect(deployer).pause()
                  await expect(referrerC.connect(deployer).register(extraInfo)).to.be.revertedWith(
                      "Pausable: paused"
                  )
                  await expect(referrerC.connect(user1).unpause()).to.be.revertedWith(
                      "Ownable: caller is not the owner"
                  )

                  await referrerC.connect(deployer).unpause()

                  const expectedReferrerId = parseInt(
                      ethers.utils
                          .keccak256(
                              encodeParams(
                                  ["address", "bytes"],
                                  [deployer.address, extraInfo],
                                  true
                              )
                          )
                          .substring(0, 10)
                  )

                  const registerE = await getTargetEvent(
                      await getTransactionReceipt(
                          await referrerC.connect(deployer).register(extraInfo),
                          1
                      ),
                      "Registered"
                  )

                  expect(registerE.args.referrerId).to.be.equal(expectedReferrerId)
                  expect(registerE.args.referrer).to.be.equal(deployer.address)

                  expect(await referrerC.referrerAddressToId(deployer.address)).to.be.equal(
                      expectedReferrerId
                  )

                  const info = await referrerC.referrerIdToInfo(
                      await referrerC.referrerAddressToId(deployer.address)
                  )

                  expect(info.referrer).to.be.equal(deployer.address)

                  const decodedInfo = ethers.utils.defaultAbiCoder.decode(
                      ["string", "string"],
                      info.extraInfo
                  )
                  expect(decodedInfo[0]).to.be.equal("Genesis Referrer")
                  expect(decodedInfo[1]).to.be.equal("Tag 1")
              })

              it("should register with version info", async () => {
                  let parentReferrerId = DEFAULT_REFERRER_ID
                  const extraInfoV1 = ethers.utils.defaultAbiCoder.encode(
                      ["string", "string"],
                      ["Genesis Referrer", "Tag 1"]
                  )
                  await referrerC.connect(deployer).register(extraInfoV1)

                  parentReferrerId = await referrerC.referrerAddressToId(deployer.address)
                  const extraInfoV2 = ethers.utils.defaultAbiCoder.encode(
                      ["uint8", "uint32", "string", "string"],
                      ["2", parentReferrerId, "Genesis Referrer", "Tag 1"]
                  )

                  const res = decodeReferrerExtraInfo(extraInfoV2) as any
                  expect(res.version).to.be.equal(2)
                  expect(res.parentReferrerId).to.be.equal(parentReferrerId)
                  expect(res.primaryTag).to.be.equal("Genesis Referrer")
                  expect(res.secondaryTag).to.be.equal("Tag 1")
              })

              it("should revert if already registered", async () => {
                  const extraInfo = ethers.utils.defaultAbiCoder.encode(["string"], ["Null"])
                  await referrerC.connect(deployer).register(extraInfo)

                  await expect(referrerC.connect(deployer).register(extraInfo)).to.be.revertedWith(
                      "ALREADY_REGISTERED"
                  )
              })

              it("should continuously register", async () => {
                  const extraInfo = NULL_BYTES32
                  await referrerC.connect(deployer).register(extraInfo)

                  await referrerC.connect(user1).register(extraInfo)

                  await referrerC.connect(user2).register(extraInfo)

                  expect(await referrerC.referrerAddressToId(deployer.address)).to.be.equal(
                      parseInt(
                          ethers.utils
                              .keccak256(
                                  encodeParams(
                                      ["address", "bytes"],
                                      [deployer.address, extraInfo],
                                      true
                                  )
                              )
                              .substring(0, 10)
                      )
                  )
                  expect(await referrerC.referrerAddressToId(user1.address)).to.be.equal(
                      parseInt(
                          ethers.utils
                              .keccak256(
                                  encodeParams(
                                      ["address", "bytes"],
                                      [user1.address, extraInfo],
                                      true
                                  )
                              )
                              .substring(0, 10)
                      )
                  )
                  expect(await referrerC.referrerAddressToId(user2.address)).to.be.equal(
                      parseInt(
                          ethers.utils
                              .keccak256(
                                  encodeParams(
                                      ["address", "bytes"],
                                      [user2.address, extraInfo],
                                      true
                                  )
                              )
                              .substring(0, 10)
                      )
                  )
              })
          })
      })
