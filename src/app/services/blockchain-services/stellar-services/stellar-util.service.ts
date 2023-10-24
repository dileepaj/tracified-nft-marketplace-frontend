import { Injectable } from '@angular/core';
import { StellarCommonsService } from './stellar-commons.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIConfigENV, BlockchainConfig, ENV, StellarWalletTypes } from 'src/environments/environment';
import { Asset, Operation, Server, TimeoutInfinite, TransactionBuilder, xdr } from 'stellar-sdk';
import { blockchainNet } from 'src/app/shared/config';
import { UserWallet } from 'src/app/models/userwallet';
import { FreighterComponent } from 'src/app/wallet/freighter/freighter.component';
import albedo from '@albedo-link/intent';
import { Issuer } from 'src/app/models/minting';

@Injectable({
  providedIn: 'root',
})
export class StellarUtilService {
  networkBaseURL = ENV.BLOCKCHAIN_NETWORK;
  networkURL = `${this.networkBaseURL}/accounts`;
  gatewayBaseURL = APIConfigENV.gatewayBaseURL;
  net: any;
  userSignedTransaction: any;
  constructor(
    private network: StellarCommonsService,
    private http: HttpClient,
  ) { }

  /**
   * @function setHeaders - set headers for an API request
   * @param none
   */
  private setHeaders(): HttpHeaders {
    const headersConfig = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    return new HttpHeaders(headersConfig);
  }

  getStellarAccountStatus(publicKey: string): Observable<any> {
    return this.http.get(`${this.networkURL}/${publicKey}`, {
      headers: this.setHeaders(),
    });
  }

  isAssetAvailableAccount(assetList: any, assetName: string) {
    for (const item of assetList) {
      if (item.asset_code === assetName && parseFloat(item.balance) > 0) {
        return true;
      }
    }
    return false;
  }

  getOffersForAccount(publicKey: string) {
    return this.http.get(`${this.networkURL}/${publicKey}/offers`, {
      headers: this.setHeaders(),
    });
  }
  getOfferIDForAsset(offers: any, assetName: string) {
    for (const item of offers) {
      if (item.buying.asset_code === assetName) {
        return item.id
      } 
    }
    return -1
  }
  getXDRToDeleteOfferAndTrustLine(userPK, offerID, asset_code, assetIssuer, wallet: StellarWalletTypes,nftPrice) {
    return new Promise((resolve, reject) => {
      var buyAsset = new Asset(asset_code, assetIssuer);
      var sellingAsset = Asset.native();
      this.net = this.network.getNetwork();
      var asset = new Asset(asset_code, assetIssuer);
      var opts = { fee: '50000', networkPassphrase: this.net };
      let server = new Server(blockchainNet);
      server.loadAccount(BlockchainConfig.STELLAR_SPONSOR_KEY).then(async (account) => {
        var transaction = new TransactionBuilder(account, opts)
          .addOperation(
            Operation.beginSponsoringFutureReserves({
              sponsoredId: userPK,
              source: BlockchainConfig.STELLAR_SPONSOR_KEY
            }))
          .addOperation(
            Operation.manageBuyOffer({
              selling: sellingAsset,
              buying: buyAsset,
              buyAmount: '0',
              price: nftPrice,
              offerId: offerID,
              source:userPK
            })
          )
          .addOperation(
            Operation.endSponsoringFutureReserves({
              source: userPK
            }))
          .addOperation(
            Operation.beginSponsoringFutureReserves({
              sponsoredId: userPK,
              source: BlockchainConfig.STELLAR_SPONSOR_KEY
            }))
          .addOperation(
            Operation.changeTrust({
              asset: asset,
              limit: '0',
              source: userPK,
            })
          )
          .addOperation(Operation.endSponsoringFutureReserves({
            source: userPK
          }))
          .setTimeout(TimeoutInfinite)
          .build();

        if (wallet === StellarWalletTypes.FREIGHTER_WALLET) {
          let walletFreighter = new UserWallet();
          walletFreighter = new FreighterComponent(walletFreighter);
          this.userSignedTransaction = await walletFreighter.signTransaction(
            transaction
          );
          const transactionToSubmit = TransactionBuilder.fromXDR(
            this.userSignedTransaction,
            this.net
          );
          resolve(transactionToSubmit.toEnvelope().toXDR().toString('base64'));
        } else {
          let txn = transaction.toEnvelope().toXDR().toString('base64');
          albedo.tx({
            xdr: txn,
            network: this.net,
            submit: false,
          }).then(signedTransaction => {
            resolve(signedTransaction.signed_envelope_xdr)
          })
        }
      }).catch((err) => {
        reject(err);
      });
    });
  }
  SubmitXDRToDeleteOfferAndTrustLine(_xdr: string, _issuer: string): Observable<any> {
    let data = {
      xdr: _xdr,
      accountIssuer: _issuer
    }
    return this.http.post(`${this.gatewayBaseURL}/nft/breaktrustline`, data, {
      headers: this.setHeaders()
    })
  }
}

