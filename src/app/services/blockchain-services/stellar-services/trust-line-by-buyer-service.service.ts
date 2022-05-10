import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {
  Operation,
  Keypair,
  TransactionBuilder,
  Server,
  Asset,
  Networks,
  Memo
} from "stellar-sdk";
//import { Properties } from 'src/app/shared/properties';
import { blockchainNet } from 'src/app/shared/config';
import { blockchainNetType } from 'src/app/shared/config';

@Injectable({
  providedIn: 'root'
})
export class TrustLineByBuyerServiceService {

  constructor() { }
  trustlineByBuyer(asset_code:string, asset_issuer:string, signerSK:string, buyerpk:string,nftPrice:string) {
console.log("inside trust line service-----------------")
    let royalty=(parseFloat(nftPrice)*(0.02)).toFixed(6).toString();


    return new Promise((resolve, reject) => {
      let sourceKeypair = Keypair.fromSecret(signerSK); //buyers secret key
      if (blockchainNetType === "live") {
        Networks.TESTNET
      } else {
        Networks.PUBLIC
      }
      const senderPublickKey = buyerpk;
      var asset = new Asset(asset_code, asset_issuer); //for buyer --> gateway
      var claimer ='GA6KKDBU4S55QV4T5777DGYJ7WULG7K3RPV5RTSYJ37KBQXJ2OKKIFDL'
      let server = new Server(blockchainNet);
      server
        .loadAccount(sourceKeypair.publicKey())
        .then((account) => {
          var transaction = new TransactionBuilder(account, { fee:'100', networkPassphrase: Networks.TESTNET,})
            .addOperation(
              Operation.changeTrust({
                asset: asset,
                limit: "1",
                source: senderPublickKey,
              })
            ) //trustline from buyer to issuer
            //.addMemo(Memo.text(`Payment has been made of ${royalty}to ${claimer}`))
            .addMemo(Memo.text("Payment has been made!"))
            .addOperation(
              Operation.payment({
                destination:claimer,
                asset:Asset.native(),
                amount: royalty,
                source: senderPublickKey,
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
          console.log("Failed Trusts " + JSON.stringify(err));
          reject(err);
        });
    });
  }
}
