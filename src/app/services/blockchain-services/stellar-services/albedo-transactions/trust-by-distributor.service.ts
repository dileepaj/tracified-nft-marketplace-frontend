import albedo from '@albedo-link/intent';
import { Injectable } from '@angular/core';
import { blockchainNet, blockchainNetType } from 'src/app/shared/config';
import { environment } from 'src/environments/environment';
import { Asset, Networks, Operation, Server, TransactionBuilder } from 'stellar-sdk';
import { StellarCommonsService } from '../stellar-commons.service';

@Injectable({
  providedIn: 'root'
})
export class TrustByDistributorService {
 //networkType:any;
  net: Networks;
  constructor(private network:StellarCommonsService) { }
  changeTrustByDistributor(asset_code:string, asset_issuer:string, userPK:string) {

    return new Promise((resolve, reject) => {
      this.net =this.network.getNetwork()
      
      var asset = new Asset(asset_code, asset_issuer);
      var opts = { fee: "100" ,networkPassphrase: this.net};
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
                destination:environment.tracifiedStellarPK,
                asset:Asset.native(),
                amount: '0.005',
                source: userPK,   //service charge
              })
            )
            .setTimeout(60000)
            .build();
  
           let txn=  transaction.toEnvelope().toXDR().toString("base64");
          return await albedo.tx({
            xdr: txn,
            network: this.net,
            submit :true
        })
           
      
        })
        .then((transactionResult) => {
          resolve(transactionResult);
        })
        .catch((err) => {
          alert("Something went wrong, please try again! More information: "+err);
          reject(err);
        });
    });
  }

}



