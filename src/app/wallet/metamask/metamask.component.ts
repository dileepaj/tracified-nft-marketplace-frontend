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
    commission:string,
    _callback? : any
  ): Promise<any> {
    if (blockchain == 'ethereum') {
      const _priceInWei = ethers.utils.parseEther((price).toString())
      const _price= ethers.BigNumber.from(_priceInWei)
      const commissionInWei=ethers.utils.parseEther(commission)
      const _commission=ethers.BigNumber.from(commissionInWei)
      const str = nftsvgHash;
      const encoder = new TextEncoder();
      const _nfthash = encoder.encode(str);
      const contract = await EthereumMarketServiceService.getContract(true);
      const transaction = await contract['listNFT'](
        _nfthash,
        _price,
       // { gasLimit: 3000000 },
        {value: _commission}// 
      )
      .catch(error=>{       
        _callback()!
      })
      const tx = await transaction.wait();
      return tx;
    }
    if (blockchain == 'polygon') {
      const _priceInWei = ethers.utils.parseEther((price).toString())
      const _price= ethers.BigNumber.from(_priceInWei)
      const commissionInWei=ethers.utils.parseEther(commission)
      const _commission=ethers.BigNumber.from(commissionInWei)
      const str = nftsvgHash;
      const encoder = new TextEncoder();
      const _nfthash = encoder.encode(str);
      const contract = await PolygonMarketServiceService.getContract(true);
      const transaction = await contract['listNFT'](
        _nfthash,
        _price,
       // { gasLimit: 3000000 },
        {value: _commission}// 
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
    itemID: string,
    price:string,
    _callback? : any
  ): Promise<any> {
    if (blockchain == 'ethereum') {
      const _priceInWei = ethers.utils.parseEther((price).toString())
      const _price= ethers.BigNumber.from(_priceInWei).toNumber()
      const contract = await EthereumMarketServiceService.getContract(true);
      const transaction = await contract['buyNFT'](
        parseInt(itemID),
       // { gasLimit: 3000000 },
        {value: _price}
      )
      .catch(error=>{
        _callback()!
      })
      const tx = await transaction.wait();
      return tx;
    } else if (blockchain == 'polygon') {
      const _priceInWei = ethers.utils.parseEther((price).toString())
      const _price= ethers.BigNumber.from(_priceInWei).toNumber()
      const contract = await PolygonMarketServiceService.getContract(true);
      const transaction = await contract['buyNFT'](
        parseInt(itemID),
        {value: _price}
      )
      .catch(error=>{
        _callback()!
      })
      const tx = await transaction.wait();
      return tx;
    }
  }



}
