import { MetaMask } from './../../models/metmaskWallet';
import { Component, OnInit } from '@angular/core';
import { PhantomWallet } from 'src/models/phantomWallet';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  async metmask(){
     let metmask = new MetaMask();
     metmask.initWallelt();
  }

  async freighter(){
    if ((window as any).freighterApi.isConnected()) {
      alert("User has Freighter!");
    }
    else{
      console.log("error wallet not detected");
    }
  }
  async phantom(){
    let phantomWallet = new PhantomWallet();
    phantomWallet.initWallelt();
  }
  disconnectPhantom(){
    (window as any).solana.disconnect()
    (window as any).solana.on('disconnect',()=>{console.log("Disconnected")})
  }
}
