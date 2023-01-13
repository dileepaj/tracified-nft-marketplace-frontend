import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {
  Operation,
  TransactionBuilder,
  Server,
  Asset,
  Networks
} from "stellar-sdk";
import { blockchainNet } from 'src/app/shared/config';
import { blockchainNetType } from 'src/app/shared/config';
import { UserWallet } from 'src/app/models/userwallet';
import { FreighterComponent } from 'src/app/wallet/freighter/freighter.component';
import albedo from '@albedo-link/intent'
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
        Networks.PUBLIC
      } else {
        Networks.TESTNET
      }
      var asset = new Asset(asset_code, asset_issuer);
      var opts = { fee: "100" ,networkPassphrase: Networks.PUBLIC};
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
            .addOperation(
              Operation.payment({
                destination:'GDL7U4NZ6JGENCU7GMW2TQ3OQUE7NCUUFC7PG6SRAHNQWYGNP77XXYCV',
                asset:Asset.native(),
                amount: '2',
                source: userPK,   //service charge
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
              Networks.PUBLIC
            );

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
