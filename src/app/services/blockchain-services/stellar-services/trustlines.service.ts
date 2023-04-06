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
import { StellarCommonsService } from './stellar-commons.service';
import { environment } from 'src/environments/environment';
import { SnackbarServiceService } from '../../snackbar-service/snackbar-service.service';
@Injectable({
  providedIn: 'root'
})
export class TrustlinesService {
  userSignedTransaction: string;
  //networkType:any;
  net: Networks;
  constructor(
    public http: HttpClient,
    private network:StellarCommonsService,
    private snackbar : SnackbarServiceService
  ) { }

  changeTrustByDistributor(asset_code:string, asset_issuer:string, userPK:string,_callback?:any) {
    return new Promise((resolve, reject) => {
      this.net =this.network.getNetwork()
      var asset = new Asset(asset_code, asset_issuer);
      var opts = { fee: "50000" ,networkPassphrase: this.net};
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
            // .setTimeout(60000)
            .build();
            let walletf = new UserWallet();
            walletf = new FreighterComponent(walletf);
            await walletf.initWallelt();
            this.userSignedTransaction = await walletf.signTransaction(transaction)

            const transactionToSubmit = TransactionBuilder.fromXDR(
              this.userSignedTransaction,
              this.net
            );

          return server.submitTransaction(transactionToSubmit);
        })
        .then((transactionResult) => {
          resolve(transactionResult);
        })
        .catch((err) => {
          _callback()
          this.snackbar.openSnackBar("Something went wrong, please try again! More information: "+err, 'error');
          reject(err);
        });
    });
  }

}
