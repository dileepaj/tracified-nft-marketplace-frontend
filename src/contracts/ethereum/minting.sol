// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


contract NFT is ERC721, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    mapping(uint256 => Attr) public attributes;
    mapping(uint256 => Listing) public listings;
    mapping (address => uint256) public balances;

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

    struct Listing {
        uint256 price;
        address seller;
    }

    constructor() ERC721("Tracified", "TNFT") {
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

    function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
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

    library Base64 {
    string internal constant TABLE_ENCODE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    bytes  internal constant TABLE_DECODE = hex"0000000000000000000000000000000000000000000000000000000000000000"
                                            hex"00000000000000000000003e0000003f3435363738393a3b3c3d000000000000"
                                            hex"00000102030405060708090a0b0c0d0e0f101112131415161718190000000000"
                                            hex"001a1b1c1d1e1f202122232425262728292a2b2c2d2e2f303132330000000000";

    function encode(bytes memory data) internal pure returns (string memory) {
        if (data.length == 0) return '';

        // load the table into memory
        string memory table = TABLE_ENCODE;

        // multiply by 4/3 rounded up
        uint256 encodedLen = 4 * ((data.length + 2) / 3);

        // add some extra buffer at the end required for the writing
        string memory result = new string(encodedLen + 32);

        assembly {
            // set the actual output length
            mstore(result, encodedLen)

            // prepare the lookup table
            let tablePtr := add(table, 1)

            // input ptr
            let dataPtr := data
            let endPtr := add(dataPtr, mload(data))

            // result ptr, jump over length
            let resultPtr := add(result, 32)

            // run over the input, 3 bytes at a time
            for {} lt(dataPtr, endPtr) {}
            {
                // read 3 bytes
                dataPtr := add(dataPtr, 3)
                let input := mload(dataPtr)

                // write 4 characters
                mstore8(resultPtr, mload(add(tablePtr, and(shr(18, input), 0x3F))))
                resultPtr := add(resultPtr, 1)
                mstore8(resultPtr, mload(add(tablePtr, and(shr(12, input), 0x3F))))
                resultPtr := add(resultPtr, 1)
                mstore8(resultPtr, mload(add(tablePtr, and(shr( 6, input), 0x3F))))
                resultPtr := add(resultPtr, 1)
                mstore8(resultPtr, mload(add(tablePtr, and(        input,  0x3F))))
                resultPtr := add(resultPtr, 1)
            }

            // padding with '='
            switch mod(mload(data), 3)
            case 1 { mstore(sub(resultPtr, 2), shl(240, 0x3d3d)) }
            case 2 { mstore(sub(resultPtr, 1), shl(248, 0x3d)) }
        }

        return result;
    }

    function decode(string memory _data) internal pure returns (bytes memory) {
        bytes memory data = bytes(_data);

        if (data.length == 0) return new bytes(0);
        require(data.length % 4 == 0, "invalid base64 decoder input");

        // load the table into memory
        bytes memory table = TABLE_DECODE;

        // every 4 characters represent 3 bytes
        uint256 decodedLen = (data.length / 4) * 3;

        // add some extra buffer at the end required for the writing
        bytes memory result = new bytes(decodedLen + 32);

        assembly {
            // padding with '='
            let lastBytes := mload(add(data, mload(data)))
            if eq(and(lastBytes, 0xFF), 0x3d) {
                decodedLen := sub(decodedLen, 1)
                if eq(and(lastBytes, 0xFFFF), 0x3d3d) {
                    decodedLen := sub(decodedLen, 1)
                }
            }

            // set the actual output length
            mstore(result, decodedLen)

            // prepare the lookup table
            let tablePtr := add(table, 1)

            // input ptr
            let dataPtr := data
            let endPtr := add(dataPtr, mload(data))

            // result ptr, jump over length
            let resultPtr := add(result, 32)

            // run over the input, 4 characters at a time
            for {} lt(dataPtr, endPtr) {}
            {
               // read 4 characters
               dataPtr := add(dataPtr, 4)
               let input := mload(dataPtr)

               // write 3 bytes
               let output := add(
                   add(
                       shl(18, and(mload(add(tablePtr, and(shr(24, input), 0xFF))), 0xFF)),
                       shl(12, and(mload(add(tablePtr, and(shr(16, input), 0xFF))), 0xFF))),
                   add(
                       shl( 6, and(mload(add(tablePtr, and(shr( 8, input), 0xFF))), 0xFF)),
                               and(mload(add(tablePtr, and(        input , 0xFF))), 0xFF)
                    )
                )
                mstore(resultPtr, shl(232, output))
                resultPtr := add(resultPtr, 3)
            }
        }

        return result;
    }
}

    function _burn(uint256 tokenId) internal override(ERC721) {
        super._burn(tokenId);
    }

    function mint(
        address to,  
        string memory _name, 
        string memory _proofbotdata,
        string memory _tdpdata,
        string memory _imagedata
        ) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        setSvg(generateSvg(_proofbotdata, _tdpdata, _imagedata));
        _safeMint(to, tokenId);
        attributes[tokenId] = Attr(_name);
    }

    function getSvg(uint tokenId) private view returns (string memory) {
        return svg;
    }

    function setSvg(string memory _svg) internal {
        svg = _svg;
    }

    function generateSvg(string memory _proofbotdata, string memory _tdpdata, string memory _imagedata) internal returns (string memory) {
        string memory svgheader = string(abi.encodePacked(svgheaderInfo,metaDataOpenTag));
        string memory proofBotdata = string(abi.encodePacked(svgProofBotTitle,descriptionOpenTag,_proofbotdata,descriptionClosingTag));
        string memory tdpdata = string(abi.encodePacked(svgTdpDatatitle,descriptionOpenTag,_tdpdata,descriptionClosingTag));
        string memory svgFooter = string(abi.encodePacked(metaDataClosingTag,hrefAttribute,_imagedata,svgfooterInfo));

        string memory newSvg = string(abi.encodePacked(svgheader,proofBotdata,tdpdata,svgFooter));

        return newSvg;
    }    

    function tokenURI(uint256 tokenId) override(ERC721) public view returns (string memory) {
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
}