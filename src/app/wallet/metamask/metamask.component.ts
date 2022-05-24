import { Component, OnInit } from '@angular/core';
import { Wallet } from 'src/app/models/wallet';
import { walletOptions } from 'src/app/models/walletoptions';
@Component({
  selector: 'app-metamask',
  templateUrl: './metamask.component.html',
  styleUrls: ['./metamask.component.css']
})
export class MetamaskComponent extends walletOptions implements OnInit {
  public signTransaction(): void {
    throw new Error('Method not implemented.');
  }


  constructor(wallet:Wallet) {
    super();
    this.decoratorWallet = wallet;
  }

  ngOnInit(): void {
  }
  async initWallelt(): Promise<void> {
    if (typeof (window as any).ethereum  !== 'undefined') {
      const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' })
        .catch((e: { message: any; }) => {
          console.error(e.message)
          return
        })
        this.walletAddress=accounts;
    }
    else{
      alert("Please Install Metamask")
      window.location.href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
      
    }
  }
  public getWalletaddress(): string {
    return this.walletAddress[0];
  }
  public disconenctWallet(): void {
    throw new Error('Method not implemented.');
  }
}
