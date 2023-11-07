import { Injectable } from '@angular/core';
import { WalletType } from 'src/app/models/enums/wallets';
import { StellarCommonsService } from './stellar-commons.service';
import { Asset, Memo, Operation, Server, TimeoutInfinite, TransactionBuilder } from 'stellar-sdk';
import { blockchainNet } from 'src/app/shared/config';
import { BlockchainConfig, environment } from 'src/environments/environment';
import { UserWallet } from 'src/app/models/userwallet';
import { FreighterComponent } from 'src/app/wallet/freighter/freighter.component';
import albedo from '@albedo-link/intent';
@Injectable({
  providedIn: 'root'
})
export class TransactionBuilderService {
  net: any;
  userSignedTransaction: any;
  constructor(
    private network: StellarCommonsService
  ) { }
  /**
 * Puts an NFT (Non-Fungible Token) on sale in a Stellar-based marketplace.
 * @param _sellerPK - The public key of the seller's Stellar account.
 * @param _assetCode - The asset code of the NFT.
 * @param _issuerPK - The public key of the asset issuer.
 * @param _price - The price at which the NFT is listed for sale.
 * @param _wallet - The type of wallet to use for signing the transaction.
 * @param _HasRoyalties - A boolean indicating whether royalties are applicable for the sale.
 * @param _royalties - The amount of royalties (optional, default is 0).
 * @returns A Promise that resolves with the signed transaction in base64 format.
 */
  putNFTOnSale(
    _sellerPK: string,
    _assetCode: string,
    _issuerPK, _price: number,
    _wallet: WalletType,
    _HasRoyalties: boolean,
    _royalties: number = 0): Promise<any> {
    return new Promise((resolve, reject) => {
      this.net = this.network.getNetwork();
      let asset = new Asset(_assetCode, _issuerPK)
      let otps = { fee: BlockchainConfig.STELLAR_BASE_FEE, networkPassphrase: this.net }
      let server = new Server(blockchainNet)
      server.loadAccount(_sellerPK).then(async (account) => {
        var transaction = new TransactionBuilder(account, otps)
          .addMemo(Memo.text("NFT put on sale"))
          //marketplace key creates a trust-line to receive the asset
          .addOperation(
            Operation.changeTrust({
              asset: asset,
              limit: '1',
              source: BlockchainConfig.STELLAR_MARKETPLACE_KEY
            })
          )
          .addOperation(
            Operation.manageData({
              name: "nft_price",
              value: _price.toString(),
              source: _sellerPK
            })
          )
          //seller will send the asset from their account to marketplace account
          .addOperation(
            Operation.payment({
              asset: asset,
              destination: BlockchainConfig.STELLAR_MARKETPLACE_KEY,
              amount: '1',
              source: _sellerPK
            })
          )
          //Once asset is transferred Sellers trust-line will be removed
          .addOperation(
            Operation.changeTrust({
              asset: asset,
              limit: '0',
              source: _sellerPK
            })
          )
        if (_HasRoyalties) {
          transaction.addOperation(
            Operation.manageData({
              name: "Royalty_amount",
              value: _royalties.toString()
            })
          );
        }
        transaction.setTimeout(TimeoutInfinite)
        let builtTransaction = transaction.build();
        if (_wallet === WalletType.FREIGHTER_WALLET) {
          let walletFreighter = new UserWallet();
          walletFreighter = new FreighterComponent(walletFreighter);
          this.userSignedTransaction = await walletFreighter.signTransaction(builtTransaction)
          const transactionToSubmit = TransactionBuilder.fromXDR(
            this.userSignedTransaction,
            this.net
          );
          resolve(transactionToSubmit.toEnvelope().toXDR().toString('base64'));
        } else {
          let txn = builtTransaction.toEnvelope().toXDR().toString('base64');
          albedo.tx({
            xdr: txn,
            network: this.net,
            submit: false,
          }).then(signedTransaction => {
            resolve(signedTransaction.signed_envelope_xdr)
          })
        }


      }).catch((err) => {
        reject(err)
      });
    });
  }


  /**
 * Purchase an NFT (Non-Fungible Token) from a Stellar-based marketplace.
 * @param asset_code - The asset code of the NFT.
 * @param asset_issuer - The public key of the NFT asset issuer.
 * @param buyerPK - The public key of the buyer's Stellar account.
 * @param nftPrice - The price of the NFT, including royalties and commission.
 * @param previousOwnerNFTPK - The public key of the previous owner of the NFT.
 * @param royalty - The royalty amount (if applicable).
 * @param commission - The commission amount to be paid to a specific key.
 * @param hasRoyalties - A boolean indicating whether royalties are included.
 * @param wallet - The type of wallet to use for signing the transaction.
 * @param _callback - An optional callback function.
 * @returns A Promise that resolves with the signed transaction in base64 format.
 */
  purchaseNFT(
    asset_code: string,
    asset_issuer: string,
    buyerPK: string,
    nftPrice: string,
    previousOwnerNFTPK: string,
    royalty: string="0",
    commission: string,
    hasRoyalties: boolean,
    wallet: WalletType,
    _callback?: any,

  ):Promise<any> {
    return new Promise((resolve, reject) => {
      this.net = this.network.getNetwork();
      var asset = new Asset(asset_code, asset_issuer); //for buyer --> gateway
      var claimer = previousOwnerNFTPK;
      let server = new Server(blockchainNet);
      server.loadAccount(buyerPK).then(async (account) => {
        var transaction = new TransactionBuilder(account, {
          fee: BlockchainConfig.STELLAR_BASE_FEE,
          networkPassphrase: this.net
        })
          .addOperation(
            //buyer of asset creates a trust line
            Operation.changeTrust({
              asset: asset,
              limit: "1",
              source: buyerPK,
            })
          )
          .addOperation(
            //buyer will recive the asset
            Operation.payment({
              amount: "1",
              asset: asset,
              destination: buyerPK,
              source: BlockchainConfig.STELLAR_MARKETPLACE_KEY
            })
          )
          .addOperation(
            //marketplace key will receive the price of the NFT. this amount contains royalties(optional) and commission.
            Operation.payment({
              amount: nftPrice,
              asset: Asset.native(),
              destination: BlockchainConfig.STELLAR_MARKETPLACE_KEY,
              source: buyerPK
            })
          )
          .addOperation(
            //commission is payed to Tracified key
            Operation.payment({
              asset: Asset.native(),
              destination: environment.tracifiedStellarPK,
              amount: commission,
              source: buyerPK
            })
          )
          .addOperation(
            //removing the trust line of the asset that was transferred from Tracified key
            Operation.changeTrust({
              asset: asset,
              limit: "0",
              source: BlockchainConfig.STELLAR_MARKETPLACE_KEY
            })
          )
        if (hasRoyalties) {
          transaction.addOperation(
            Operation.payment({
              amount: royalty,
              asset: Asset.native(),
              destination: claimer,
              source: BlockchainConfig.STELLAR_MARKETPLACE_KEY
            })
          )
        }

        transaction.setTimeout(TimeoutInfinite)
        let builtTransaction = transaction.build()

        if (wallet === WalletType.FREIGHTER_WALLET) {
          let walletFreighter = new UserWallet();
          walletFreighter = new FreighterComponent(walletFreighter);
          this.userSignedTransaction = await walletFreighter.signTransaction(
            builtTransaction
          );
          const transactionToSubmit = TransactionBuilder.fromXDR(
            this.userSignedTransaction,
            this.net
          );
          resolve(transactionToSubmit.toEnvelope().toXDR().toString('base64'));
        } else {
          let txn = builtTransaction.toEnvelope().toXDR().toString('base64');
          albedo.tx({
            xdr: txn,
            network: this.net,
            submit: false,
          }).then(signedTransaction => {
            resolve(signedTransaction.signed_envelope_xdr)
          })
        }

      }).catch(err=>{
        reject(err)
      })
    })
  }
}
