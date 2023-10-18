import albedo from '@albedo-link/intent';
import { Injectable } from '@angular/core';
import { SnackbarServiceService } from 'src/app/services/snackbar-service/snackbar-service.service';
import { blockchainNet, blockchainNetType } from 'src/app/shared/config';
import {
  Asset,
  Memo,
  Networks,
  Operation,
  Server,
  TimeoutInfinite,
  TransactionBuilder,
} from 'stellar-sdk';
import { StellarCommonsService } from '../stellar-commons.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TrustByBuyerService {
  //networkType:any;
  net: Networks;
  constructor(
    private network: StellarCommonsService,
    private snackbar: SnackbarServiceService
  ) {}

  trustlineByBuyer(
    asset_code: string,
    asset_issuer: string,
    userPK: string,
    nftPrice: string,
    previousOwnerNFTPK: string,
    royalty: string,
    commission: string,
    _callback?: any
  ) {
    return new Promise((resolve, reject) => {
      this.net = this.network.getNetwork();
      //let sourceKeypair = Keypair.fromSecret(signerSK); //buyers secret key
      // if (blockchainNetType === "live") {
      //   this.networkType =Networks.PUBLIC
      // } else {
      //   this.networkType= Networks.TESTNET
      // }

      var buyAsset = new Asset(asset_code, asset_issuer);
      var sellingAsset = Asset.native();

      const senderPublickKey = userPK;
      var asset = new Asset(asset_code, asset_issuer); //for buyer --> gateway
      var claimer = previousOwnerNFTPK;
      let server = new Server(blockchainNet);
      server
        .loadAccount(userPK)
        .then(async (account) => {
          var transaction = new TransactionBuilder(account, {
            fee: '50000',
            networkPassphrase: this.net,
          })
            .addOperation(
              Operation.changeTrust({
                asset: asset,
                limit: '1',
                source: senderPublickKey,
              })
            )
            .addMemo(Memo.text('Payment has been made!'))
            .addOperation(
              Operation.payment({
                destination: claimer,
                asset: Asset.native(),
                amount: royalty,
                source: senderPublickKey,
              })
            )
            .addOperation(
              Operation.payment({
                destination: environment.tracifiedStellarPK, //commission
                asset: Asset.native(),
                amount: commission,
                source: senderPublickKey,
              })
            )
            .addOperation(
              Operation.manageBuyOffer({
                selling: sellingAsset,
                buying: buyAsset,
                buyAmount: '1',
                price: nftPrice,
                offerId: '0',
              })
            )
            .addOperation(
              Operation.manageData({
                name: 'Origin Issuer',
                value: asset_issuer,
              })
            )
            .addOperation(
              Operation.manageData({
                name: 'Current Owner',
                value: userPK,
              })
            )
            .addOperation(
              Operation.manageData({
                name: 'Previous Owner',
                value: previousOwnerNFTPK,
              })
            )
            .setTimeout(TimeoutInfinite)
            .build();
          let txn = transaction.toEnvelope().toXDR().toString('base64');
          return albedo.tx({
            xdr: txn,
            network: this.net,
            submit: true,
          });
        })
        .then((transactionResult) => {
          resolve(transactionResult);
        })
        .catch((err) => {
          if (previousOwnerNFTPK == senderPublickKey) {
            this.snackbar.openSnackBar(
              'Error! Cannot buy this NFT as you have just put it on sale. Please retry once there is atleast one buyer other than yourself.',
              'error'
            );
          }
          _callback();
          this.snackbar.openSnackBar(
            'Something went wrong with Stellar, please try again! More information: ' +
              err,
            'error'
          );
          reject(err);
        });
    });
  }
}
