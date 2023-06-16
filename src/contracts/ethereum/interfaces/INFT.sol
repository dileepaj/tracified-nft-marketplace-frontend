// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./NftUtill.sol";

interface INFT {
    
    struct NFTData {
        bytes NFTHash;  // Hash of the NFT
        uint256 price;  // Price of the NFT
        uint8 royalty;  // Royalty percentage of the NFT
        NftUtill.EnumNFTStatus nftsatus;  // Status of the NFT
        NftUtill.PurchaseStatus purchaseStatus;  // Purchase status of the NFT
        // address firstOwner;  // Address of the first owner (commented out)
    }
    
    // Events
    event nftStatusChanged(NftUtill.EnumNFTStatus indexed status, bytes indexed nfthash);  // Event emitted when the status of the NFT changes
    event validateResult(bool indexed result);  // Event emitted when a validation result is obtained
    event ownerChanged(address indexed owneraddress, bytes indexed nfthash);  // Event emitted when the owner of the NFT changes
    
    // Returns the name of the NFT
    function getName() external view returns (string memory);
    
    // Returns the hash of the NFT
    function getNftHash() external view returns (bytes memory);
    
    /*
    Sets the royalty percentage for the NFT.
    only the intial owner can set this and only when it 
    is under thier owner ship
    */
    function setRoyalty(uint8 _royalty) external;
    
    // Returns the royalty percentage of the NFT
    function getRoyalty() external view returns (uint8);
    
    // Returns the price of the NFT
    function getPrice() external view returns (uint256);
    
    // Sets the price for the NFT
    function setPrice(uint256 _price) external;
    
    // Returns the address of the initial owner of the NFT
    function getInitialOwner() external view returns (address);
    
    // Returns the status of the NFT
    function getStatus() external view returns (NftUtill.EnumNFTStatus);
    
    // Changes the status of the NFT
    function changeStatus(NftUtill.EnumNFTStatus status) external returns(NftUtill.EnumNFTStatus);
    
    // Returns the purchase status of the NFT
    function getPurchaseStatus() external view returns (NftUtill.PurchaseStatus);

    function transferOwnership( address newOwner) external payable; 
}
