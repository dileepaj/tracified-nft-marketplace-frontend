import albedo from '@albedo-link/intent';
import { Injectable } from '@angular/core';
import { blockchainNet, blockchainNetType } from 'src/app/shared/config';
import { Asset, Memo, Networks, Operation, Server, TransactionBuilder } from 'stellar-sdk';

@Injectable({
  providedIn: 'root'
})
export class TrustByBuyerService {

  constructor() { }

  trustlineByBuyer(asset_code:string, asset_issuer:string, userPK:string,nftPrice:string,previousOwnerNFTPK:string,royalty:string,commission:string) {
    let royalties=parseFloat(royalty)
    let commissioncharge=parseFloat(commission)
    let sellingprice=parseFloat(nftPrice)
    let TotalPrice=(sellingprice-(royalties+commissioncharge)).toString();
    
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
          var claimer =previousOwnerNFTPK
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
                  Operation.payment({
                    destination:"GDL7U4NZ6JGENCU7GMW2TQ3OQUE7NCUUFC7PG6SRAHNQWYGNP77XXYCV", //commission
                    asset:Asset.native(),
                    amount: commission,
                    source: senderPublickKey,
                  })
                )
                .addOperation(
                  Operation.manageBuyOffer({
                    selling: sellingAsset,
                    buying: buyAsset,
                    buyAmount: '1',
                    price: TotalPrice,
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
                let txn=  transaction.toEnvelope().toXDR().toString("base64");
               return albedo.tx({
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
    

