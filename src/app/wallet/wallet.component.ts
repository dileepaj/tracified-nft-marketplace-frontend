// import { PhantomComponent } from './phantom/phantom.component';
import { Component, OnInit } from '@angular/core';
import { MetamaskComponent } from './metamask/metamask.component';
import { FreighterComponent } from './freighter/freighter.component';
import { UserWallet } from '../models/userwallet';
import { PhantomComponent } from './phantom/phantom.component';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css'],
})
export class WalletComponent implements OnInit {
  showAllWallets: boolean = false;
  tabIndex: number = 0;
  walletConnected: boolean = true;

  constructor() {}

  ngOnInit(): void {}

  async metmask() {
    let metmaskWallet = new UserWallet();
    metmaskWallet = new MetamaskComponent(metmaskWallet);
    metmaskWallet.initWallelt();
  }
  async freighter() {
    let freighterWallet = new UserWallet();
    freighterWallet = new FreighterComponent(freighterWallet);
    freighterWallet.initWallelt();
    let userPK = await freighterWallet.getWalletaddress();
  }
  async phantom() {
    let phantomWallet = new UserWallet();
    phantomWallet = new PhantomComponent(phantomWallet);
    phantomWallet.initWallelt();
  }

  //exapnd popup
  public expand() {
    this.showAllWallets = true;
  }

  //collapse popup
  public collapse() {
    this.showAllWallets = false;
  }

  //change tab
  public changeTab(index: number) {
    this.tabIndex = index;
  }
}
