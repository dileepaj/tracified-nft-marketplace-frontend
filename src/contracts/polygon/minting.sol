// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./interfaces/ERC721.sol";
import "./interfaces/Ownable.sol";
import "./interfaces/INFT.sol";
import "./interfaces/NftUtill.sol";
import "solmate/src/utils/FixedPointMathLib.sol";

contract NFT is ERC721, Ownable, INFT, NftUtill {
    NFTData private nftCustomData;
    address private initOwner;
    address private tracifiedMKAddress;
    address private immutable tracifiedAccountAddress;

    //constructor
    constructor(
        string memory _name,
        bytes memory _nftHash,
        string memory _symbol,
        uint8 _royalty,
        address _owner,
        address _tracifiedaccount
    ) ERC721(_name, _symbol) Ownable(_owner) royaltyInRange(_royalty) {
        nftCustomData = NFTData({
            NFTHash: _nftHash,
            price: 0,
            royalty: _royalty,
            nftsatus: EnumNFTStatus.OFFSALE,
            purchaseStatus: NftUtill.PurchaseStatus.FIRST_HAND
        });
        initOwner = _owner;
        tracifiedMKAddress = msg.sender;
        tracifiedAccountAddress = _tracifiedaccount;
    }

    //modifer
    modifier onlyInitialOwner() {
        require(
            msg.sender == initOwner,
            "Royalty can only be set by the initial owner"
        );
        _;
    }

    modifier royaltyInRange(uint256 royalty) {
        require(royalty <= 100, "Royalty can not set more than 100");
        _;
    }

    modifier onOffSell() {
        require(
            nftCustomData.nftsatus == NftUtill.EnumNFTStatus.OFFSALE,
            "can not change royalty on onSell"
        );

        _;
    }
    modifier ownerShoudlInitialOwner() {
        require(
            Ownable.owner() == initOwner,
            "Initial owner not the NFT Current owner"
        );
        _;
    }
    modifier onlyTransactionAuth() {
        require(
            tracifiedMKAddress == msg.sender || Ownable.owner() == msg.sender,
            "No transaction auth"
        );
        _;
    }

    modifier sendValidEth() {
        require(
            msg.value >= nftCustomData.price,
            "eth value mismatch to the NFT price"
        );
        _;
    }

    //private functions

    function calculateRoyalty(uint8 royalty) private view returns (uint256) {
        return NftUtill.calculatePercentage(nftCustomData.price, uint256(royalty));
    }

    function setPurcahseStatus() private {
        nftCustomData.purchaseStatus = NftUtill.PurchaseStatus.SECOND_HAND;
    }

    //internal functions

    //public functions

    //external
    function getName() external view returns (string memory) {
        return ERC721.name();
    }

    function getNftHash() external view returns (bytes memory) {
        return nftCustomData.NFTHash;
    }

    function getPrice() external view returns (uint256) {
        return nftCustomData.price;
    }

    function getInitialOwner() external view returns (address) {
        return initOwner;
    }

    function getStatus() external view returns (NftUtill.EnumNFTStatus) {
        return nftCustomData.nftsatus;
    }

    function getRoyalty() external view returns (uint8) {
        return nftCustomData.royalty;
    }

    function getPurchaseStatus()
        external
        view
        returns (NftUtill.PurchaseStatus)
    {
        return nftCustomData.purchaseStatus;
    }

    function setPrice(uint256 _price) external onlyTransactionAuth {
        nftCustomData.price = _price;
    }

    function setRoyalty(
        uint8 _royalty
    )
        external
        onOffSell
        royaltyInRange(_royalty)
        onlyInitialOwner
        ownerShoudlInitialOwner
    {
        nftCustomData.royalty = _royalty;
    }

    function changeStatus(
        NftUtill.EnumNFTStatus status
    ) external onlyTransactionAuth returns (NftUtill.EnumNFTStatus) {
        nftCustomData.nftsatus = status;
        emit nftStatusChanged(nftCustomData.nftsatus, nftCustomData.NFTHash);
        return nftCustomData.nftsatus;
    }

    function transferOwnership(
        address newOwner
    ) external payable onlyTransactionAuth hasValidAddress(newOwner) sendValidEth {
        uint256 royaltyPayment = calculateRoyalty(nftCustomData.royalty);
        payable(initOwner).transfer(royaltyPayment);
        payable(newOwner).transfer(msg.value - royaltyPayment);

        Ownable._transferOwnership(newOwner);
        delete nftCustomData.purchaseStatus;
    }
}
