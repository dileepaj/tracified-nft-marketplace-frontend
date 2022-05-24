import { Component, OnInit } from '@angular/core';
import { Wallet } from 'src/app/models/wallet';
import { walletOptions } from 'src/app/models/walletoptions';

@Component({
  selector: 'app-phantom',
  templateUrl: './phantom.component.html',
  styleUrls: ['./phantom.component.css']
})
export class PhantomComponent extends walletOptions implements OnInit {
  public signTransaction() {
    throw new Error('Method not implemented.');
  }
  override walletAddress: string;
  constructor(wallet: Wallet) {
    super();
    this.decoratorWallet = wallet;
  }

  ngOnInit(): void {
  }

  override async initWallelt(): Promise<void> {
    try {
        const resp = await (window as any).solana.connect();
        this.walletAddress= resp.publicKey.toString()
    } catch (err) {
        console.log("cant get address !")
    }
  }
  override getWalletaddress(): string {
    return this.walletAddress;
  }
  override disconenctWallet(): void {
    (window as any).solana.disconnect()
    (window as any).solana.on('disconnect',()=>{console.log("Disconnected")})
  }

  

}
