import albedo from '@albedo-link/intent';
import { Injectable } from '@angular/core';
import { SnackbarServiceService } from 'src/app/services/snackbar-service/snackbar-service.service';
import { blockchainNet, blockchainNetType } from 'src/app/shared/config';
import { Asset, Networks, Operation, Server, TransactionBuilder } from 'stellar-sdk';
import { StellarCommonsService } from '../stellar-commons.service';

@Injectable({
  providedIn: 'root'
})
export class SaleOfferService {
  res: string;
//networkType:any;
  net: any;
  constructor(private network:StellarCommonsService, private snackbar : SnackbarServiceService) { }
  sellNft(
    asset_code: string,
    asset_issuer: string,
    signerPK: string,
    nftAmmount: string,
    nftPrice: number,
    _callback? :any
  ) {

    return new Promise((resolve, reject) => {
      this.net =this.network.getNetwork()
      // if (blockchainNetType === "live") {
      //  this.networkType= Networks.PUBLIC
      // } else {
      //   this.networkType=  Networks.TESTNET
      // }
      var asset = new Asset(asset_code, asset_issuer);
      var sellingAsset = Asset.native();
      // var totalsaleprice = nftPrice-(royalty+commission)
      var opts = {
        fee: '100',
        timebounds: {
          minTime: '0',
          maxTime: '0',
        },
        networkPassphrase: this.net,
      };
      let server = new Server(blockchainNet);
      server
        .loadAccount(signerPK)
        .then(async (account) => {
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
            let txn=  transaction.toEnvelope().toXDR().toString("base64");
            return albedo.tx({
              xdr: txn,
              network: this.net,
              submit :true
           })

        })
        .then((transactionToSubmit) => {
          resolve(transactionToSubmit);
        })
        .catch((err) => {
          _callback()!
          this.snackbar.openSnackBar("Something went wrong, please try again! More information: "+err, 'error');
          reject(err);
        });
    });
  }
}

