//SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface IReferrerCore {
    /** Struct */
    /**
     * @notice Struct to store the referrer info
     * @param referrer Address of the referrer
     * @param extraInfo Extra information to describe this referrer
     */
    struct ReferrerInfo {
        address referrer;
        bytes extraInfo;
    }

    /** Event */
    /**
     * @notice Emitted when a new referrer is registered
     * @param referrerId Unique ID of the referrer
     * @param referrer Address of the referrer
     */
    event Registered(uint32 referrerId, address referrer);

    /** View */
    /**
     * @notice Get the referrer info of a referrer ID
     * @param id Unique ID of the referrer
     * @return info The referrer info
     */
    function referrerIdToInfo(uint32 id) external view returns (ReferrerInfo memory info);

    /**
     * @notice Get the referrer ID of an address
     * @param referrer Address of the referrer
     * @return referrerId The unique referrer ID
     */
    function referrerAddressToId(address referrer) external view returns (uint32 referrerId);

    /** Core */
    /**
     * @notice Register a new referrer
     * @param extraInfo Extra information to describe this referrer
     * @return referrerId The referrer ID
     */
    function register(bytes calldata extraInfo) external returns (uint32 referrerId);
}
