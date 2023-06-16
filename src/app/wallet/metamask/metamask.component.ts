import { Component, OnInit } from '@angular/core';
import { Wallet } from 'src/app/models/wallet';
import { walletOptions } from 'src/app/models/walletoptions';
import detectEthereumProvider from '@metamask/detect-provider';
import { EthereumMarketServiceService } from 'src/app/services/contract-services/marketplace-services/ethereum-market-service.service';
import { ethers } from 'ethers';
import { PolygonMarketServiceService } from 'src/app/services/contract-services/marketplace-services/polygon-market-service.service';
import { EthereumMintService } from 'src/app/services/contract-services/ethereum-mint.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-metamask',
  templateUrl: './metamask.component.html',
  styleUrls: ['./metamask.component.css'],
})
export class MetamaskComponent extends walletOptions implements OnInit {
  public signTransaction(): void {
    throw new Error('Method not implemented.');
  }
  constructor(wallet: Wallet) {
    super();
    this.decoratorWallet = wallet;
  }

  ngOnInit(): void {}
  async initWallelt(_callback?: any): Promise<void> {
    if (typeof (window as any).ethereum != 'undefined') {
      await (window as any).ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((addresses: any) => {
          this.walletAddress = addresses[0];
          if (_callback !== undefined) {
            _callback(addresses[0]);
          }
        })
        .catch((e: { code:any,message: any }) => {
          return;
        });
    } else {
       window.location.href = 'https://metamask.io/';
    }
  }
  public getWalletaddress(): string {
    return this.walletAddress;
  }
  public disconenctWallet(): void {
    throw new Error('Method not implemented.');
  }
  public async createSaleOffer(
    blockchain: string,
    nftsvgHash: string,
    price:number,
    _callback? : any
  ): Promise<any> {
    if (blockchain == 'ethereum') {
      const contract = await EthereumMarketServiceService.getContract(true);
      const transaction = await contract['listNFT'](
        price,
        nftsvgHash,
      )
      .catch(error=>{       
        _callback()!
      })
      const tx = await transaction.wait();
      return tx;
    }
    if (blockchain == 'polygon') {
      const contract = await PolygonMarketServiceService.getContract(true);
      const transaction = await contract['listNFT'](
        price,
        nftsvgHash,
      )
      .catch(error=>{
        _callback()!
      })
      const tx = await transaction.wait();
      return tx;
    }
  }

  public async buynft(
    blockchain: string,
    _itemID: string,
    _callback? : any
  ): Promise<any> {
    if (blockchain == 'ethereum') {
      const contract = await EthereumMarketServiceService.getContract(true);
      const transaction = await contract['buyNFT'](
        _itemID,
      )
      .catch(error=>{
        _callback()!
      })
      const tx = await transaction.wait();
      return tx;
    } else if (blockchain == 'polygon') {
      const contract = await PolygonMarketServiceService.getContract(true);
      const transaction = await contract['buyNFT'](
        _itemID,
      )
      .catch(error=>{
        _callback()!
      })
      const tx = await transaction.wait();
      return tx;
    }
  }



}
