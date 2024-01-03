import albedo from '@albedo-link/intent';
import { Injectable } from '@angular/core';
import { UserWallet } from 'src/app/models/userwallet';
import { FreighterComponent } from 'src/app/wallet/freighter/freighter.component';
import { MetamaskComponent } from 'src/app/wallet/metamask/metamask.component';
import { PhantomComponent } from 'src/app/wallet/phantom/phantom.component';
import { DeviceTypeDetectorService } from './device-type-detector.service';

@Injectable({
  providedIn: 'root',
})
export class PubkeyvalidatorService {
  constructor(private deviceTyoeDetexctor: DeviceTypeDetectorService) {}

  /**
   * Retrieves the active public key based on the specified blockchain and user's public key.
   *
   * @param pubkey - The user's public key.
   * @param blockchain - The blockchain for which to retrieve the active public key (e.g., 'stellar', 'ethereum', 'polygon', 'solana').
   * @returns The active public key. If the provided public key is not the same as the active one, the active public key is returned; otherwise, the provided public key is returned.
   */
  async GetActivePubKey(pubkey: string, blockchain: string) {
    let walletAddress = '';
    let wallet = new UserWallet();
    switch (blockchain) {
      case 'stellar':
        let isMobile = await this.deviceTyoeDetexctor.getDeviceType();
        if (isMobile) {
          await albedo
            .publicKey({ require_existing: true })
            .then((res: any) => {
              walletAddress = res.pubkey;
            });
          break;
        } else {
          wallet = new FreighterComponent(wallet);
          await wallet.initWallelt();
          walletAddress = await wallet.getWalletaddress();
          break;
        }
      case 'etereuem':
      case 'polygon':
        wallet = new MetamaskComponent(wallet);
        await wallet.initWallelt();
        walletAddress = await wallet.getWalletaddress();
        break;
      case 'solana':
        wallet = new PhantomComponent(wallet);
        await wallet.initWallelt();
        walletAddress = await wallet.getWalletaddress();
        break;
    }
    if (pubkey != walletAddress) {
      return walletAddress;
    }
    return pubkey;
  }
}
