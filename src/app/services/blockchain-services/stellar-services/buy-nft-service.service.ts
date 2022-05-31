import { Injectable } from '@angular/core';
import {
  Operation,
  Keypair,
  TransactionBuilder,
  Server,
  Asset,
  Networks
} from "stellar-sdk";
import { blockchainNet } from 'src/app/shared/config';
import { blockchainNetType } from 'src/app/shared/config';
import { UserWallet } from 'src/app/models/userwallet';
import { FreighterComponent } from 'src/app/wallet/freighter/freighter.component';
@Injectable({
  providedIn: 'root'
})
export class BuyNftServiceService {
  userSignedTransaction: any;

  constructor() { }
  buyNft(
   /*transactionResult:string,*/
    asset_code:string,
    asset_issuer:string,
    previousOwnerNFTPK: string, //* Distributor PK
    userPK:string,
    nftPrice: string
  ) {
    return new Promise((resolve, reject) => {//buyers secret key
      console.log("params in buy : ",asset_code,asset_issuer,userPK,previousOwnerNFTPK,nftPrice)
      if (blockchainNetType === "live") {
        Networks.TESTNET
      } else {
        Networks.PUBLIC
      }
      var buyAsset = new Asset(asset_code, asset_issuer);
      var sellingAsset = Asset.native();
      
      var opts = {
        fee: '100',
        timebounds: {
          minTime: '0',
          maxTime: '0',
        },
        networkPassphrase: Networks.TESTNET,
      };
      let server = new Server(blockchainNet);
      console.log("server starting")
      server
        .loadAccount(userPK)
        .then(async (account) => {
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
            .addOperation(
              Operation.manageData({
                name: "Origin Issuer",
                value: asset_issuer,
              })
            )
            .addOperation(
              Operation.manageData({
                name: "Current Owner",
                value: userPK,
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
          console.log("sign start")
          let walletf = new UserWallet();
          walletf = new FreighterComponent(walletf);
          this.userSignedTransaction = await walletf.signTransaction(transaction)
          const transactionToSubmit = TransactionBuilder.fromXDR(
            this.userSignedTransaction,
            Networks.TESTNET
          );
          return server.submitTransaction(transactionToSubmit);
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
