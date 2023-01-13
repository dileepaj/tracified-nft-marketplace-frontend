import albedo from '@albedo-link/intent';
import { Injectable } from '@angular/core';
import { blockchainNet, blockchainNetType } from 'src/app/shared/config';
import { Asset, Networks, Operation, Server, TransactionBuilder } from 'stellar-sdk';

@Injectable({
  providedIn: 'root'
})
export class SaleOfferService {
  res: string;

  constructor() { }
  sellNft(
    asset_code: string,
    asset_issuer: string,
    signerPK: string,
    nftAmmount: string,
    nftPrice: number,
  ) {
    return new Promise((resolve, reject) => {
      //let sourceKeypair = Keypair.fromSecret(signerSK); //because the distributor has the authority to sell
      if (blockchainNetType === "live") {
        Networks.PUBLIC
      } else {
        Networks.TESTNET
      }
      var asset = new Asset(asset_code, asset_issuer);
      var sellingAsset = Asset.native();
      // var totalsaleprice = nftPrice-(royalty+commission)
      var opts = {
        fee: '100',
        timebounds: {
          minTime: '0',
          maxTime: '0',
        },
        networkPassphrase: Networks.PUBLIC,
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
              network: Networks.PUBLIC,
              submit :true
           })

        })
        .then((transactionToSubmit) => {
          resolve(transactionToSubmit);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

