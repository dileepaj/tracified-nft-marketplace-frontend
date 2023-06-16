// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/utils/Counters.sol";
import "./interfaces/Ownable.sol";
import "./interfaces/INFT.sol";
import "./interfaces/NftUtill.sol";
import "./minting.sol";
import "solmate/src/utils/FixedPointMathLib.sol";

contract Marketplace is NftUtill {
    struct MarketplaceItem {
        bytes nftsvghash;
        address _nftContractAddress;
        NftUtill.PurchaseStatus puchaseStatus;
    }

    using Counters for Counters.Counter;
    uint256 private _listedId = 1; //✅ its better to change the name with more meaning like listedId

    mapping(bytes => address) private contracts;
    mapping(uint256 => MarketplaceItem) private marketplaceItems; //marketplaceItemID -> marketplaceItem
    mapping(bytes => uint256) private itemIds; //nfthash -> marketplaceItemID
    address private immutable tracifiedAccountAddress = msg.sender;

    //events
    event mintNFt(string indexed name, string indexed symbol); //✅ mintNFt is better
    event NFTListed(
        uint256 indexed _itemID,
        address indexed _nftaddress,
        uint256 indexed _price
        // address _owner
    );
    event NFTUnlisted(
        uint256 indexed _itemID,
        string indexed _name,
        uint256 indexed _price
    );

    //✅ better hasUnicName
    modifier onlyNFTOwner(bytes memory _nfthash) {
        require(
            Ownable(contracts[_nfthash]).owner() == msg.sender,
            "Caller not owner"
        );
        _;
    }
    modifier hasUinqueHash(bytes calldata _nftsvghash) {
        require(
            contracts[_nftsvghash] == address(0),
            "NFT name already exists"
        );
        _;
    }

    modifier onlyOffSale(
        bytes calldata _nfthash // bytes calldata _nftsvghash
    ) {
        // address nftContractAddress = contracts[_nftsvghash];
        require(
            getNFTStatus(_nfthash) == NftUtill.EnumNFTStatus.OFFSALE,
            "NFT already on sale"
        );
        _;
    }

    modifier onlyOnSale(
        bytes calldata _nfthash // bytes calldata _nftsvghash
    ) {
        // address nftContractAddress = contracts[_nftsvghash];
        require(
            INFT(contracts[_nfthash]).getStatus() ==
                NftUtill.EnumNFTStatus.ONSALE,
            "NFT not on sale"
        );
        _;
    }

    modifier nftinValidStandered(bytes calldata _nfthash) {
        require(
            IERC165(contracts[_nfthash]).supportsInterface(
                type(INFT).interfaceId
            ),
            "The NFT contract does not support ERC721"
        );
        _;
    }

    modifier hasNftNotListed(bytes calldata _nfthash) {
        require(itemIds[_nfthash] == 0, "NFT already list in marketplace");
        _;
    }

    modifier hasNftListed(uint256 _itemID) {
        require(
            marketplaceItems[_itemID]._nftContractAddress != address(0),
            "NFT not in marketplace"
        );
        _;
    }

    modifier hasValidNftHash(bytes calldata _nfthash) {
        require(contracts[_nfthash] != address(0), "NFT hash is Invalid");
        _;
    }

    // modifier validatePayment(_)

    //private functions
    function calculateRoyalty(uint8 royalty) private returns (uint256) {
        return FixedPointMathLib.divWadUp(msg.value, 100) * uint256(royalty);
    }

    function checkNFTOwnerIsSender(address _nftaddress) private view {
        require(Ownable(_nftaddress).owner() == msg.sender, "Caller not owner");
    }

    function chargePayment(uint256 _price, INFT _nft) private {
        //calculate

        // 5% commision
        // uint256 commision = calculateCommision(5, _price);
        uint256 commision = calculatePercentage(_price,5);
        NftUtill.PurchaseStatus purchaseStatus = _nft.getPurchaseStatus();

        if (purchaseStatus == NftUtill.PurchaseStatus.SECOND_HAND) {
            //2.5 commision
            commision = calculatePercentage(commision,50);
        }

        //pay
        require(commision <= msg.value, "invalid Listing price");

        payable(tracifiedAccountAddress).transfer(commision);
    }

    function calculateCommision(
        uint8 _commisionRate,
        uint256 _value
    ) private pure returns (uint256) {
        uint256 val = FixedPointMathLib.divWadUp(_value, 100) * _commisionRate;
        return val;
    }

    //internal functions
    function getNFTStatus(
        bytes calldata _nfthash
    ) internal view returns (NftUtill.EnumNFTStatus) {
        return INFT(contracts[_nfthash]).getStatus();
    }

    //public functions

    //  external

    function getAvailableListingId() external view returns (uint256) {
        return _listedId;
    }

    function getNFTOwner(
        bytes calldata hashdata
    ) external view returns (address) {
        address nft = contracts[hashdata];
        return Ownable(nft).owner();
    }

    function mintNFT(
        string memory _nftname,
        bytes calldata _nftsvgHash,
        string memory _symbol,
        uint8 _royalty
    ) external hasUinqueHash(_nftsvgHash) returns (address) {
        NFT nft = new NFT(
            _nftname,
            _nftsvgHash,
            _symbol,
            _royalty,
            msg.sender,
            tracifiedAccountAddress
        );
        address nftContractAddress = address(nft);

        //Mapping nftname and contract
        contracts[_nftsvgHash] = nftContractAddress;
        emit mintNFt(_nftname, _symbol);
        return nftContractAddress;
    }

    function listNFT(
        bytes calldata _nfthash,
        uint256 _price
    )
        external
        payable
        hasValidNftHash(_nfthash)
        hasNftNotListed(_nfthash)
        returns (uint256)
    {
        address _nftAddress = contracts[_nfthash];
        INFT nft = INFT(_nftAddress);

        chargePayment(_price, nft);

        NftUtill.EnumNFTStatus status = nft.changeStatus(
            NftUtill.EnumNFTStatus.ONSALE
        );
        require(
            status == NftUtill.EnumNFTStatus.ONSALE,
            "NFT not put on sale"
        );

        MarketplaceItem memory item = MarketplaceItem({
            nftsvghash: _nfthash,
            _nftContractAddress: _nftAddress,
            puchaseStatus: nft.getPurchaseStatus()
        });

        nft.setPrice(_price);
        require(nft.getPrice() == _price, "Price was not set");
        marketplaceItems[_listedId] = item;

        itemIds[_nfthash] = _listedId;

        unchecked {
            _listedId += 1;
        }
        emit NFTListed(_listedId, _nftAddress, _price);
        return _listedId;
    }

    function unListNFT(uint256 _itemID) public hasNftListed(_itemID) {
        MarketplaceItem memory marketPlaceItem = marketplaceItems[_itemID];
        address _nftaddress = contracts[marketPlaceItem.nftsvghash];

        checkNFTOwnerIsSender(_nftaddress);

        INFT nft = INFT(_nftaddress);
        nft.changeStatus(NftUtill.EnumNFTStatus.OFFSALE);

        bytes memory nfthash = marketplaceItems[_itemID].nftsvghash;
        delete itemIds[nfthash];
        delete marketplaceItems[_itemID];

        emit NFTUnlisted(_itemID, nft.getName(), nft.getPrice());
    }

    function buyNFT(
        uint256 _itemID
    ) external payable hasNftListed(_itemID)  {
        MarketplaceItem memory marketItem = marketplaceItems[_itemID];
        address _nftaddress = marketItem._nftContractAddress;
        INFT nftData = INFT(_nftaddress);
        nftData.transferOwnership{value: msg.value}(msg.sender);
        unListNFT(_itemID);
    }
}
