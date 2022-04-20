import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {
  Operation,
  Keypair,
  TransactionBuilder,
  Server,
  Asset,
  Networks
} from "stellar-sdk";
//import { Properties } from 'src/app/shared/properties';
import { blockchainNet } from 'src/app/shared/config';
import { blockchainNetType } from 'src/app/shared/config';
@Injectable({
  providedIn: 'root'
})
export class BuyNftServiceService {

  constructor() { }
  buyNft(
    asset_code:string,
    signerSK:string,
    asset_issuer:string,
    previousOwnerNFTPK: string,
    nftPrice: string
  ) {
    return new Promise((resolve, reject) => {
      let sourceKeypair = Keypair.fromSecret(signerSK); //buyers secret key
      if (blockchainNetType === "live") {
        Networks.TESTNET
      } else {
        Networks.PUBLIC
      }
      var buyAsset = new Asset(asset_code, asset_issuer);
      var sellingAsset = Asset.native();
      // var price = parseInt(nftPrice)
      // var royalty = price * (20 / 100);
      // var royaltyToBePaid = royalty.toString()
      var opts = {
        fee: '100',
        timebounds: {
          minTime: '0',
          maxTime: '0',
        },
      };
      let server = new Server(blockchainNet);
      server
        .loadAccount(sourceKeypair.publicKey())
        .then((account) => {
          var transaction = new TransactionBuilder(account, opts)
            .addOperation(
              Operation.manageBuyOffer({
                selling: sellingAsset,
                buying: buyAsset,
                buyAmount: '1',
                price: nftPrice,
                offerId: "0",
              })
            )
            // .addOperation(
            //   Operation.payment({
            //     amount: royaltyToBePaid,
            //     asset: Asset.native(),
            //     destination:
            //       "GC6SZI57VRGFULGMBEJGNMPRMDWEJYNL647CIT7P2G2QKNLUHTTOVFO3",
            //   })
            // )
            .addOperation(
              Operation.manageData({
                name: "Origin Issuer",
                value: asset_issuer,
              })
            )
            .addOperation(
              Operation.manageData({
                name: "Current Owner",
                value: sourceKeypair.publicKey(),
              })
            )
            .addOperation(
              Operation.manageData({
                name: "Previous Owner",
                value: previousOwnerNFTPK,
              })
            )
            .setTimeout(80000)
            .build();
          transaction.sign(sourceKeypair);
          return server.submitTransaction(transaction);
        })
        .then((transactionResult) => {
          console.log("Buying of NFT was successful");
          resolve(transactionResult);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  

}
