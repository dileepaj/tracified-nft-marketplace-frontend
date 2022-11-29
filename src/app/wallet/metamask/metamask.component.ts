import { Component, OnInit } from '@angular/core';
import { Wallet } from 'src/app/models/wallet';
import { walletOptions } from 'src/app/models/walletoptions';
import detectEthereumProvider from '@metamask/detect-provider';
import { EthereumMarketServiceService } from 'src/app/services/contract-services/marketplace-services/ethereum-market-service.service';
import { ethers } from 'ethers';
import { PolygonMarketServiceService } from 'src/app/services/contract-services/marketplace-services/polygon-market-service.service';
import { EthereumMintService } from 'src/app/services/contract-services/ethereum-mint.service';
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
    if (typeof (window as any).ethereum !== 'undefined') {
      await (window as any).ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((addresses: any) => {
          this.walletAddress = addresses[0];
          if (_callback !== undefined) {
            _callback(addresses[0]);
          }
        })
        .catch((e: { message: any }) => {
          console.error(e.message);
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
    nftcontract: string,
    tokenId: number,
    price: string,
    listingPrice: string
  ): Promise<any> {
    if (blockchain == 'ethereum') {
      const contract = await EthereumMarketServiceService.getContract(true);
      const transaction = await contract['sellNFT'](
        nftcontract,
        tokenId,
        ethers.utils.parseEther(price.toString()),
        {
          value: ethers.utils.parseEther('0.1'),
        }
      );
      const tx = await transaction.wait();
      return tx;
    }
    if (blockchain == 'polygon') {
      const contract = await PolygonMarketServiceService.getContract(true);
      const transaction = await contract['createMarketItem'](
        nftcontract,
        tokenId,
        ethers.utils.parseEther(price.toString()),
        { value: ethers.utils.parseEther('0.25') }
      );
      const tx = await transaction.wait();
      return tx;
    }
  }
  public async buynft(
    blockchain: string,
    nftcontract: string,
    itemId: number,
    price: string,
    listingPrice: string,
    royalty:string,
    seller:string
  ): Promise<any> {
    if (blockchain == 'ethereum') {
      const contract = await EthereumMarketServiceService.getContract(true);
      const val = price.toString();
      const transaction = await contract['createMarketSale'](
        nftcontract,
        itemId,
        ethers.utils.parseEther(royalty.toString()),
        seller,
        { value: ethers.utils.parseEther(price.toString()) }
      );
      const tx = await transaction.wait();
      return tx;
    } else if (blockchain == 'polygon') {
      const contract = await PolygonMarketServiceService.getContract(true);
      const transaction = await contract['createMarketSale'](
        nftcontract,
        itemId,
        ethers.utils.parseEther(royalty.toString()),
        seller,
        { value: ethers.utils.parseEther(price.toString()) }
      );
      const tx = await transaction.wait();
      return tx;
    }
  }

 
  
}
