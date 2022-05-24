// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./Base64.sol";
//import "hardhat/console.sol";

contract NFT is ERC721,ERC721URIStorage,Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address contractAddress;

    mapping(uint256 => Attr) public attributes;
    mapping (address => uint256) public balances;
    mapping (string => uint256) public tokenIDTrack;

    string svgheaderInfo;
    string metaDataOpenTag;
    string metaDataClosingTag;
    string descriptionOpenTag;
    string descriptionClosingTag;
    string svgProofBotTitle;
    string svgTdpDatatitle;
    string svgOtherData;
    string hrefAttribute;
    string svgfooterInfo;
    string private svg;

    struct Attr {
        string name;
    }

    constructor(address marketplaceAddress) ERC721("Tracified", "NFT") {
        contractAddress = 0xdEcf2B82E134Da9615bD47D51204D80204690DD1;

        svgheaderInfo = "<svg width='100%' height='100%' viewBox='0 0 400 370' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'>";
        metaDataOpenTag = "<metadata>";
        metaDataClosingTag = "<rdf:RDF xmlns:rdf = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#' xmlns:rdfs = 'http://www.w3.org/2000/01/rdf-schema#' xmlns:dc = 'http://purl.org/dc/elements/1.1/' ><rdf:Description about='https://qa.explorer.tillit.world/txn/c221afb87469f6f2e9defb880b85393d02defae6d23c899a3ae9f737b93b57c5' dc:title='Proof presentation NFT' dc:description='POE' dc:publisher='Hezelnut' dc:date='2022-02-11' dc:format='JSON' dc:language='en' ><dc:creator><rdf:Bag><rdf:li>Tracified</rdf:li><rdf:li>NFT for Proofs</rdf:li></rdf:Bag></dc:creator></rdf:Description></rdf:RDF></metadata><image  width='400px' height='400px'";
        descriptionOpenTag = "<desc>";
        descriptionClosingTag = "</desc>";
        svgProofBotTitle = "<title>Proof BOT JSON</title>";
        svgTdpDatatitle = "<title>NFT TDP details</title>";
        hrefAttribute = " href='";
        svgfooterInfo = "'/></svg>";
        
    }

    function uint2str(uint _i) internal pure returns (string memory uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len;
        while (_i != 0) {
            k = k-1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }


    function _burn(uint256 tokenId) internal override(ERC721URIStorage,ERC721) {
        super._burn(tokenId);
    }

    function mintNFT(
        address reciver,
       /* string memory tokenURI,*/
        string memory _name, 
        string memory _proofbotdata,
        string memory _tdpdata,
        string memory _imagedata
        ) 
    public 
    returns (uint) 
    {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        setSvg(generateSvg(_proofbotdata, _tdpdata, _imagedata));
        _mint(reciver, newItemId);
        //_setTokenURI(newItemId, tokenURI);
        setApprovalForAll(contractAddress, true);
        attributes[newItemId] = Attr(_name);
        tokenIDTrack[_name] = newItemId; 
        return newItemId;
    }

    function getTokenIDfromTokenURI(string memory _name)
    public
    view
    returns (uint256)
    {
        return tokenIDTrack[_name];
    }


/*
    function createTokenURI(uint256 tokenID) public{
        string memory tokenURI = _getTokenURI(tokenID);
        _setTokenURI(newItemId, tokenURI);
    }
*/

    function getSvg(uint tokenId) public view returns (string memory) {
        return svg;
    }

    function setSvg(string memory _svg) internal {
        svg = _svg;
    }

    

    function generateSvg(string memory proofbotdata, string memory tdpdata, string memory _imagedata) internal returns (string memory) {
        string memory svgheader = string(abi.encodePacked(svgheaderInfo,metaDataOpenTag));
        string memory proofBotdata = string(abi.encodePacked(svgProofBotTitle,descriptionOpenTag,proofbotdata,descriptionClosingTag));
        string memory tdpdata = string(abi.encodePacked(svgTdpDatatitle,descriptionOpenTag,tdpdata,descriptionClosingTag));
        string memory svgFooter = string(abi.encodePacked(metaDataClosingTag,hrefAttribute,_imagedata,svgfooterInfo));

        string memory newSvg = string(abi.encodePacked(svgheader,proofBotdata,tdpdata,svgFooter));

        return newSvg;
    }

    function tokenURI(uint256 tokenId) override(ERC721,ERC721URIStorage) public view returns (string memory) {
        string memory json = Base64.encode(
            bytes(string(
                abi.encodePacked(
                    '{"name": "', attributes[tokenId].name, '",',
                    '"image_data": "', getSvg(tokenId), '",',
                    '"Description": "Issued By Tracified.",',
                    '"attributes": []}'
                )
            ))
        );
        return string(abi.encodePacked('data:application/json;base64,', json));
    }

    function transferToken(address from, address to, uint256 tokenId) external {
        require(ownerOf(tokenId) == from, "From address must be token owner");
        _transfer(from, to, tokenId);
    }

  /*  function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) public virtual override {
        safeTransfer(from, to, tokenId, data);
    } */

}