import { Component, OnInit } from '@angular/core';
import { Wallet } from 'src/app/models/wallet';
import { walletOptions } from 'src/app/models/walletoptions';
import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';
import { WalletName, WalletReadyState } from '@solana/wallet-adapter-base';
import * as bs58 from 'bs58';
import { BlockchainConfig } from 'src/environments/environment';

@Component({
  selector: 'app-phantom',
  templateUrl: './phantom.component.html',
  styleUrls: ['./phantom.component.css'],
})
export class PhantomComponent extends walletOptions implements OnInit {
  readonly networkURL :any =BlockchainConfig.solananetworkURL;
  public signTransaction() {
    throw new Error('Method not implemented.');
  }
  public buynft(
    blockchain: string,
    _itemID: string,
  ): Promise<any> {
    throw new Error('Method not implemented.');
  }

  public async createSaleOffer(): Promise<any> {
    //! remove this code
    const network = '<NETWORK_URL>';
    const connection = new Connection(network);
    const transaction = new Transaction();
    const { signature } = await (window as any).solana.signAndSendTransaction(
      transaction
    );
    await connection.confirmTransaction(signature);
    //! -----------------------------------------------
  }

  override walletAddress: string;
  constructor(wallet: Wallet) {
    super();
    this.decoratorWallet = wallet;
  }

  ngOnInit(): void {}

  override async initWallelt(_callback?: any): Promise<void> {
    try {
      const resp = await (window as any).solana.connect();
      this.walletAddress = resp.publicKey.toString();
      if (_callback !== undefined) {
        _callback(this.walletAddress);
      }
    } catch (err:any){
      if (err.code!=4001){
        window.location.href = 'https://phantom.app/';
      }
    } 
      
    
  }
  override getWalletaddress(): string {
    return this.walletAddress;
  }

  override getBalance(publicKey: string, _callback?: any) {
    const connection = new Connection(this.networkURL);
    (async () => {
      const pk = new PublicKey(publicKey);
      let inSol= (await connection.getBalance(pk))/1000000000.00  //as balance comes in lamports
      let balance = inSol;
      /* console.log(`${balance / LAMPORTS_PER_SOL} SOL`); */
      if (_callback !== undefined) {
        _callback(balance);
      }
    })();
  }

  override disconenctWallet(): void {
    (window as any).solana
      .disconnect()(window as any)
      .solana.on('disconnect', () => {
      });
  }

  public override async signTransactionPhantom(
    userPK: string,
    tracifiedAta: string
  ): Promise<void> {}
}
