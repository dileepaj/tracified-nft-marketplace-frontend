import { Injectable } from '@angular/core';
import {
  Operation,
  Keypair,
  TransactionBuilder,
  Server,
  Asset,
  Networks,
  Memo
} from "stellar-sdk";
import { blockchainNet } from 'src/app/shared/config';
import { blockchainNetType } from 'src/app/shared/config';
import { FreighterComponent } from 'src/app/wallet/freighter/freighter.component';
import { UserWallet } from 'src/app/models/userwallet';

@Injectable({
  providedIn: 'root'
})
export class TrustLineByBuyerServiceService {
  userSignedTransaction: any;

  constructor() { }
  trustlineByBuyer(asset_code:string, asset_issuer:string, userPK:string,nftPrice:string,previousOwnerNFTPK:string) {
    let royalty=(parseFloat(nftPrice)*(0.02)).toFixed(6).toString();


    return new Promise((resolve, reject) => {
      //let sourceKeypair = Keypair.fromSecret(signerSK); //buyers secret key
      if (blockchainNetType === "live") {
        Networks.TESTNET
      } else {
        Networks.PUBLIC
      }

      var buyAsset = new Asset(asset_code, asset_issuer);
      var sellingAsset = Asset.native();

      const senderPublickKey = userPK;
      var asset = new Asset(asset_code, asset_issuer); //for buyer --> gateway
      var claimer ='GDHV5JPMQXAFASJS6TNRCOTGH7VPYDKLLHQ4C3VYT6ELR56CFA4XOTSC'
      let server = new Server(blockchainNet);
      server
        .loadAccount(userPK)
        .then(async (account) => {
          var transaction = new TransactionBuilder(account, { fee:'100', networkPassphrase: Networks.TESTNET,})
            .addOperation(
              Operation.changeTrust({
                asset: asset,
                limit: "1",
                source: senderPublickKey,
              })
            ) 
            .addMemo(Memo.text("Payment has been made!"))
            .addOperation(
              Operation.payment({
                destination:claimer,
                asset:Asset.native(),
                amount: royalty,
                source: senderPublickKey,
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
            .setTimeout(60000)
            .build();
            let walletf = new UserWallet();
            walletf = new FreighterComponent(walletf);
            this.userSignedTransaction = await walletf.signTransaction(transaction)
            const transactionToSubmit = TransactionBuilder.fromXDR(
              this.userSignedTransaction,
              Networks.TESTNET
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
