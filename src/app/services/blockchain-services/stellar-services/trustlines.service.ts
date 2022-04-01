import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {
  Network,
  Operation,
  Keypair,
  TransactionBuilder,
  Server,
  Account,
  Asset,
  Transaction,
  Memo,
  Networks
} from "stellar-sdk";
import { Properties } from 'src/app/shared/properties';
import { blockchainNet } from 'src/app/shared/config';
import { blockchainNetType } from 'src/app/shared/config';

@Injectable({
  providedIn: 'root'
})
export class TrustlinesService {

  constructor(
    public http: HttpClient,
    private properties: Properties
  ) { }

  changeTrustByDistributor(asset_code:string, asset_issuer:string, signerSK:string) {
    console.log("----------------------------------------------inside change trust--------------------")
    return new Promise((resolve, reject) => {
      let sourceKeypair = Keypair.fromSecret(signerSK);
      if (blockchainNetType === "live") {
        Networks.TESTNET
      } else {
        Networks.PUBLIC
      }
      const senderPublickKey = "GALRVGEUDFELLDOXNAFNZVY4TPB3THXPJQUY3ZRIYE4YAHE7BAG22YFZ"; //distributor
      var asset = new Asset(asset_code, asset_issuer);
      var opts = { fee: 100 ,networkPassphrase: Networks.TESTNET};
      console.log("-----------------------------------------------------the distributors key is",senderPublickKey, asset_issuer,asset_code)
      let server = new Server(blockchainNet);
      server
        .loadAccount(sourceKeypair.publicKey())
        .then((account) => {
          var transaction = new TransactionBuilder(account, opts)
            .addOperation(
              Operation.changeTrust({
                asset: asset,
                limit: "1",
                source: sourceKeypair.publicKey(),
              })
            )
          
            .setTimeout(60000)
            .build();
          transaction.sign(sourceKeypair);
          return server.submitTransaction(transaction);
        })
        .then((transactionResult) => {
          resolve(transactionResult);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

}
