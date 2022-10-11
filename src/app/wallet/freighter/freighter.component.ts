import { Component, OnInit } from '@angular/core';
import { getPublicKey } from '@stellar/freighter-api';
import { Wallet } from 'src/app/models/wallet';
import { walletOptions } from 'src/app/models/walletoptions';
import { Memo, MemoType, Operation, Transaction, Server } from 'stellar-sdk';
import { signTransaction } from '@stellar/freighter-api';
import { base64 } from 'ethers/lib/utils';
@Component({
  selector: 'app-freighter',
  templateUrl: './freighter.component.html',
  styleUrls: ['./freighter.component.css'],
})
export class FreighterComponent implements Wallet, OnInit {
  private address: any;
  walletAddress: string;
  decoratorWallet: Wallet;
  constructor(wallet: Wallet) {
    this.decoratorWallet = wallet;
  }
  signTransactionPhantom(userPK: string, tracifiedAta: string): void {
    throw new Error('Method not implemented.');
  }
  buynft(
    blockchain: string,
    nftcontract: string,
    tokenId: number,
    price: string,
    listingPrice: string
  ): void {
    throw new Error('Method not implemented.');
  }
  createSaleOffer(
    blockchain: string,
    nftcontract: string,
    tokenId: number,
    price: string
  ): void {
    throw new Error('Method not implemented.');
  }
  currentUserAddress: string;

  ngOnInit(): void {}

  initWallelt() {
    if ((window as any).freighterApi.isConnected()) {
      return;
    } else {
      alert('Please Install Freighter');
      window.location.href =
        'https://chrome.google.com/webstore/detail/freighter/bcacfldlkkdogcmkkibnjlakofdplcbk?hl=en';
    }
  }
  getWalletaddress(): string {
    if ((window as any).freighterApi.isConnected()) {
    }
    this.address = this.retrievePublicKey();
    return this.address;
  }

  public signTransaction(
    transaction: Transaction<Memo<MemoType>, Operation[]>
  ): Promise<any> {
    let signedTransaction = signTransaction(transaction.toXDR(), 'TESTNET');
    return signedTransaction;
  }

  retrievePublicKey = async () => {
    let error = '';

    try {
      this.walletAddress = await getPublicKey();
    } catch (e) {
      console.log(e);
    }

    if (error) {
      return error;
    }

    return this.walletAddress;
  };

  public disconenctWallet(): void {
    throw new Error('Method not implemented.');
  }

  setaddress(address: string) {
    this.address = address;
  }
  getaddress() {
    return this.address;
  }

  getBalance(publicKey: string, _callback: any) {
    const server = new Server('https://horizon.stellar.org');
    server
      .loadAccount(publicKey)
      .then((account) => {
        const balance = Number.parseFloat(
          account.balances.find((b) => b.asset_type === 'native')!.balance
        );
        if (_callback !== undefined) {
          _callback(balance);
        }
      })
      .catch(() => {
        _callback(0);
      });
  }
}
