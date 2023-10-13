import { Injectable } from '@angular/core';
import {
  Operation,
  Keypair,
  TransactionBuilder,
  Server,
  Asset,
  Networks,
  Memo,
  TimeoutInfinite
} from "stellar-sdk";
import { blockchainNet } from 'src/app/shared/config';
import { blockchainNetType } from 'src/app/shared/config';
import { FreighterComponent } from 'src/app/wallet/freighter/freighter.component';
import { UserWallet } from 'src/app/models/userwallet';
import { StellarCommonsService } from './stellar-commons.service';
import { SnackbarServiceService } from '../../snackbar-service/snackbar-service.service';

@Injectable({
  providedIn: 'root'
})
export class TrustLineByBuyerServiceService {
  userSignedTransaction: any;
//networkType:any;
  net: Networks;
  constructor(private network:StellarCommonsService, private snackbar : SnackbarServiceService) { }
  trustlineByBuyer(asset_code:string, asset_issuer:string, userPK:string,nftPrice:string,previousOwnerNFTPK:string,royalty:string,commission:string,_callback?:any) {

    return new Promise((resolve, reject) => {
      this.net =this.network.getNetwork()
      //let sourceKeypair = Keypair.fromSecret(signerSK); //buyers secret key
      // if (blockchainNetType === "live") {
      //   this.networkType= Networks.PUBLIC
      // } else {
      //   this.networkType= Networks.TESTNET
      // }

      var buyAsset = new Asset(asset_code, asset_issuer);
      var sellingAsset = Asset.native();

     // const senderPublickKey = userPK;
      var asset = new Asset(asset_code, asset_issuer); //for buyer --> gateway
      var claimer =previousOwnerNFTPK
      let server = new Server(blockchainNet);
      server
        .loadAccount(userPK)
        .then(async (account) => {
          var transaction = new TransactionBuilder(account, { fee:'50000', networkPassphrase: this.net,})
            .addOperation(
              Operation.changeTrust({
                asset: asset,
                limit: "1",
                source: userPK,
              })
            ) 
            .addMemo(Memo.text("Payment has been made!"))
            .addOperation(
              Operation.payment({
                destination:claimer,
                asset:Asset.native(),
                amount: royalty,
                source: userPK,
              })
            )
            .addOperation(
              Operation.payment({
                destination:"GDL7U4NZ6JGENCU7GMW2TQ3OQUE7NCUUFC7PG6SRAHNQWYGNP77XXYCV",  //commission
                asset:Asset.native(),
                amount: commission,
                source: userPK,
              })
            )
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
             .setTimeout(TimeoutInfinite)
            .build();
            let walletf = new UserWallet();
            walletf = new FreighterComponent(walletf);
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
          this.snackbar.openSnackBar("Something went wrong with Stellar, please try again! More information: "+err, 'error');
          reject(err);
        });
    });
  }

}
