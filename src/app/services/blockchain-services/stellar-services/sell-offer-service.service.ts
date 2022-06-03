import { FreighterComponent } from './../../../wallet/freighter/freighter.component';
import { HttpClient } from "@angular/common/http";
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

@Injectable({
  providedIn: 'root'
})
export class SellOfferServiceService {
  userSignedTransaction: string;

  constructor() { }
  sellNft(
    asset_code: string,
    asset_issuer: string,
    signerPK: string,
    nftAmmount: string,
    nftPrice: number
  ) {
    return new Promise((resolve, reject) => {
      console.log("SellOfferServiceService function start")
      console.log("param check:",asset_code,asset_issuer,signerPK,nftAmmount,nftPrice)
      //let sourceKeypair = Keypair.fromSecret(signerSK); //because the distributor has the authority to sell
      if (blockchainNetType === "live") {
        Networks.TESTNET
      } else {
        Networks.PUBLIC
      }
      var asset = new Asset(asset_code, asset_issuer);
      var sellingAsset = Asset.native();
      var opts = {
        fee: '100',
        timebounds: {
          minTime: '0',
          maxTime: '0',
        },
        networkPassphrase: Networks.TESTNET,
      };
      console.log("before server")
      let server = new Server(blockchainNet);
      console.log("during server")
      server
        .loadAccount(signerPK)
        .then(async (account) => {
          var transaction = new TransactionBuilder(account, opts)
            .addOperation(
              Operation.manageSellOffer({
                selling: asset,
                buying: sellingAsset,
                amount: nftAmmount,
                price: nftPrice,
                offerId: '0',
              })
             
            )
            .setTimeout(60000)
            .build();
          console.log("sign start")
          let walletf = new UserWallet();
          walletf = new FreighterComponent(walletf)
          this.userSignedTransaction = await walletf.signTransaction(transaction)
          const transactionToSubmit = TransactionBuilder.fromXDR(
            this.userSignedTransaction,
            Networks.TESTNET
          );
          console.timeLog("transaction in sign")
          return server.submitTransaction(transactionToSubmit);
        })
        .then((transactionResult) => {
          console.log("Resolving transactions")
          resolve(transactionResult);
        })
        .catch((err) => {
          console.log("Couldn't put up for sale -->" + err);
          reject(err);
        });
    });
  }
}
