import albedo from '@albedo-link/intent';
import { Injectable } from '@angular/core';
import { blockchainNet, blockchainNetType } from 'src/app/shared/config';
import { Asset, Networks, Operation, Server, TransactionBuilder } from 'stellar-sdk';

@Injectable({
  providedIn: 'root'
})
export class TrustByDistributorService {

  constructor() { }
  changeTrustByDistributor(asset_code:string, asset_issuer:string, userPK:string) {

    return new Promise((resolve, reject) => {
      if (blockchainNetType === "live") {
        Networks.PUBLIC
      } else {
        Networks.TESTNET
      }
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
  
           let txn=  transaction.toEnvelope().toXDR().toString("base64");
          return await albedo.tx({
            xdr: txn,
            network: Networks.TESTNET,
            submit :true
        })
           
      
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



