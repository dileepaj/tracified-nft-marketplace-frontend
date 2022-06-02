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

@Injectable({
  providedIn: 'root'
})
export class SellOfferServiceService {

  constructor() { }
  sellNft(
    asset_code: string,
    asset_issuer: string,
    signerSK: string,
    nftAmmount: string,
    nftPrice: number
  ) {
    return new Promise((resolve, reject) => {
      let sourceKeypair = Keypair.fromSecret(signerSK); //because the distributor has the authority to sell
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
      let server = new Server(blockchainNet);
      server
        .loadAccount(sourceKeypair.publicKey())
        .then((account) => {
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
          transaction.sign(sourceKeypair);
          let signedTrans = transaction.toEnvelope().toXDR().toString("base64");
          console.log('signedTrans--------------', signedTrans);
          return server.submitTransaction(transaction);
        })
        .then((transactionResult) => {
          resolve(transactionResult);
        })
        .catch((err) => {
          console.log("Couldn't put up for sale " + JSON.stringify(err));
          reject(err);
        });
    });
  }
}