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
import { Properties } from 'src/app/shared/properties';
import { blockchainNet } from 'src/app/shared/config';
import { blockchainNetType } from 'src/app/shared/config';
import { UserWallet } from 'src/app/models/userwallet';
import { FreighterComponent } from 'src/app/wallet/freighter/freighter.component';

@Injectable({
  providedIn: 'root'
})
export class TrustlinesService {
  userSignedTransaction: string;
  constructor(
    public http: HttpClient
  ) { }

  changeTrustByDistributor(asset_code:string, asset_issuer:string, userPK:string) {
    return new Promise((resolve, reject) => {
      if (blockchainNetType === "live") {
        Networks.TESTNET
      } else {
        Networks.PUBLIC
      }
      const senderPublickKey = "GALRVGEUDFELLDOXNAFNZVY4TPB3THXPJQUY3ZRIYE4YAHE7BAG22YFZ"; //distributor
      var asset = new Asset(asset_code, asset_issuer);
      var opts = { fee: "100" ,networkPassphrase: Networks.TESTNET};
      let server = new Server(blockchainNet);
      server
        .loadAccount(userPK)
        .then(async (account) => {
          var transaction = new TransactionBuilder(account, opts)
            .addOperation(
              Operation.changeTrust({
                asset: asset,
                limit: "1",
                source: userPK,
              })
            )
          
            .setTimeout(60000)
            .build();
            let walletf = new UserWallet();
            walletf = new FreighterComponent(walletf);
            await walletf.initWallelt();
            this.userSignedTransaction = await walletf.signTransaction(transaction)
            const transactionToSubmit = TransactionBuilder.fromXDR(
              this.userSignedTransaction,
              Networks.TESTNET
            );
          console.log("transaction to submit: ",transactionToSubmit)
          return server.submitTransaction(transactionToSubmit);
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
