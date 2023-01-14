import { FreighterComponent } from './../../../wallet/freighter/freighter.component';
import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import {
  Operation,
  Keypair,
  TransactionBuilder,
  Server,
  Asset,
  Networks
} from "stellar-sdk";
import { blockchainNet } from 'src/app/shared/config';
import { blockchainNetType } from 'src/app/shared/config';
import { UserWallet } from 'src/app/models/userwallet';
import { StellarCommonsService } from './stellar-commons.service';

@Injectable({
  providedIn: 'root'
})
export class SellOfferServiceService {
  userSignedTransaction: string;
 // networkType:any;
  net: Networks;
  constructor(private network:StellarCommonsService) { }
  sellNft(
    asset_code: string,
    asset_issuer: string,
    signerPK: string,
    nftAmmount: string,
    nftPrice: number,

  ) {
    return new Promise((resolve, reject) => {
      //let sourceKeypair = Keypair.fromSecret(signerSK); //because the distributor has the authority to sell
      this.net =this.network.getNetwork()
      // if (blockchainNetType === "live") {
      //   this.networkType= Networks.PUBLIC
      // } else {
      //   this.networkType= Networks.TESTNET
      // }
      var asset = new Asset(asset_code, asset_issuer);
      var sellingAsset = Asset.native();
      var opts = {
        fee: '100',
        timebounds: {
          minTime: '0',
          maxTime: '0',
        },
        networkPassphrase:this.net,
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
          let walletf = new UserWallet();
          walletf = new FreighterComponent(walletf)
          this.userSignedTransaction = await walletf.signTransaction(transaction)
          const transactionToSubmit = TransactionBuilder.fromXDR(
            this.userSignedTransaction,
            this.net
          );
          console.timeLog("transaction in sign")
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
