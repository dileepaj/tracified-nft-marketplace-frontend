// import { PhantomComponent } from './phantom/phantom.component';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MetamaskComponent } from './metamask/metamask.component';
import { FreighterComponent } from './freighter/freighter.component';
import { UserWallet } from '../models/userwallet';
import { PhantomComponent } from './phantom/phantom.component';
import { WalletSidenavService } from '../services/wallet-sidenav.service';
import { BigNumber, ethers } from 'ethers';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css'],
})
export class WalletComponent implements OnInit {
  showAllWallets: boolean = false;
  tabIndex: number = 0;
  walletConnected: boolean = false;
  freighterConnected: boolean = false;
  address: string = '';
  userPK: any;
  balance: string = '0';
  usd: string = '';
  walletName: string = '';
  loading: boolean = false;
  constructor(
    private walletService: WalletSidenavService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    //check whether the wallet is already connected
    this.isMetaMask();
  }

  async metmask() {
    let metmaskWallet = new UserWallet();
    metmaskWallet = new MetamaskComponent(metmaskWallet);
    this.loading = true;
    metmaskWallet.initWallelt((address: string) => {
      this.address = address;
      this.walletName = 'MetaMask';

      if (this.address !== '' && this.address !== undefined) {
        this.getBalance();
        this.walletConnected = true;
        this.freighterConnected = false;
      }
    });
  }
  async freighter() {
    let freighterWallet = new UserWallet();
    freighterWallet = new FreighterComponent(freighterWallet);
    this.loading = true;
    freighterWallet.initWallelt();
    this.userPK = await freighterWallet.getWalletaddress();
    this.address = this.userPK;
    if (this.address !== '' && this.address !== undefined) {
      this.walletName = 'Freighter';
      this.getFreighterBalance(freighterWallet);
      this.walletConnected = true;
    }
  }
  async phantom() {
    let phantomWallet = new UserWallet();
    phantomWallet = new PhantomComponent(phantomWallet);
    this.loading = true;
    phantomWallet.initWallelt((key : string) => {
      this.address = key;
      if (this.address !== '' && this.address !== undefined) {
        this.walletName = 'Phantom';
        this.getPhantomBalance(phantomWallet);
        this.walletConnected = true;
      }
    });
    this.userPK = await phantomWallet.getWalletaddress();

  }

   //get wallet balance
  private getFreighterBalance(wallet : UserWallet) {
    wallet.getBalance(this.address, (balance : any) => {
      this.balance = balance;
      this.convertToUSD('stellar')
    });
  }

  //get wallet balance
  private getBalance() {
    const provider = new ethers.providers.Web3Provider(window.ethereum!);
    provider
      .getBalance(this.address)
      .then((balance: BigNumber) => {
        const eth = ethers.utils.formatEther(balance.toString());
        this.balance = parseFloat(eth).toFixed(4);
        this.convertToUSD('ethereum');
      })
      .catch(() => {
        this.loading = false;
        this.balance = '0.0000';
        this.usd = '0.00';
      });
  }

  //convert balance to usd
  private convertToUSD(blockchain : string) {
    fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${blockchain}`
    )
      .then((res) => res.json())
      .then((res) => {
        const rate = res[0].current_price;
        const eth = parseFloat(this.balance);
        this.usd = (eth * rate).toFixed(2);
        this.loading = false;
      })
      .catch(() => {
        this.loading = false;
        this.usd = '0.00';
      });
  }

  public close() {
    this.walletService.close();
  }

   //get wallet balance
  private getPhantomBalance(wallet : UserWallet) {
    wallet.getBalance(this.address, (b : any) => {
      this.balance = b.toFixed(2);
      this.convertToUSD('solana');
    })
  }

  private isMetaMask() {
    if (typeof (window as any).ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum!);
      provider.listAccounts().then((d: any) => {
        if (d.length > 0) {
          this.address = d[0];
          this.walletConnected = true;
          this.walletName = 'MetaMask';
          this.loading = true;
          this.getBalance();
        } else {
          this.walletConnected = false;
        }
      });
    }
  }

}
