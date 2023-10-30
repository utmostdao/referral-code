//SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/security/Pausable.sol";
import {IReferrerCore} from "./interfaces/IReferrerCore.sol";

contract ReferrerCore is Ownable, Pausable, IReferrerCore {
    /** State Variables */
    /** Mappings */
    // referrerId => ReferrerInfo
    mapping(uint32 => ReferrerInfo) private _referrerIdToInfo;
    // referrerAddress => referrerId
    mapping(address => uint32) public override referrerAddressToId;

    /** Core */
    /**
     * @notice Register a new referrer
     * @param extraInfo Extra information to describe this referrer
     * @return referrerId The referrer ID
     */
    function register(
        bytes calldata extraInfo
    ) external override whenNotPaused returns (uint32 referrerId) {
        address sender = msg.sender;

        // Check if sender is already registered
        require(referrerAddressToId[sender] == 0, "ALREADY_REGISTERED");

        // Generate the referrerId
        referrerId = uint32(bytes4(keccak256(abi.encodePacked(sender, extraInfo))));

        // Update referrerIdToInfo
        _referrerIdToInfo[referrerId] = ReferrerInfo({referrer: sender, extraInfo: extraInfo});

        // Update referrerAddressToId
        referrerAddressToId[sender] = referrerId;

        // Emit event
        emit Registered(referrerId, sender);
    }

    /** View */
    /**
     * @notice Get the referrer info of a referrer ID
     * @param id Unique ID of the referrer
     * @return info The referrer info
     */
    function referrerIdToInfo(uint32 id) public view override returns (ReferrerInfo memory info) {
        info = _referrerIdToInfo[id];
    }

    /** Ownable */
    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }
}
