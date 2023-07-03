// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract NftUtill{
    enum EnumNFTStatus{
       
        OFFSALE, //default Status
        ONSALE
    }
    enum PurchaseStatus{
        
        SECOND_HAND,//default Status
        FIRST_HAND
        
    }


 //(x*rate/100)   (finalVal round up to top val) if finalval has decimal
    function calculatePercentage(uint256 x, uint256 rate) internal pure returns(uint256 z){
         /// @solidity memory-safe-assembly

        x *= rate;

        assembly {
           
            //gt(mod(x, denominator), 0) -> 1 if ((x%100)>0) else 0
            // div(x, denominator) -> x/100
            z := add(gt(mod(x, 100), 0), div(x,100))
        }
    }
}