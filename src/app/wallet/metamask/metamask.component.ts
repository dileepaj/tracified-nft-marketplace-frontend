import { Component, OnInit } from '@angular/core';
import { Wallet } from 'src/app/models/wallet';
import { walletOptions } from 'src/app/models/walletoptions';
import detectEthereumProvider from "@metamask/detect-provider";
import { EthereumMarketServiceService } from 'src/app/services/contract-services/marketplace-services/ethereum-market-service.service';
import { ethers } from 'ethers';
import { PolygonMarketServiceService } from 'src/app/services/contract-services/marketplace-services/polygon-market-service.service';
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
  public async createSaleOffer(blockchain:string,nftcontract: string,tokenId:number,price:number,listingPrice :string): Promise<any> {
    if(blockchain == 'ethereum'){
      console.log("eth activated")
      const contract = await EthereumMarketServiceService.getContract(true)
      const transaction = await contract['sellNFT'](
        nftcontract,
        tokenId,
        price,
        {
          value: ethers.utils.parseEther('1')
        }
      )
      const tx = await transaction.wait()
      return tx
    }
    if(blockchain=='polygon'){
      console.log("polygon activated")
      console.log("poly nft contract :",nftcontract)
      console.log("poly nft price :",price)
      console.log("poly tokenID: ",tokenId)
      const contract = await PolygonMarketServiceService.getContract(true)
      const transaction = await contract['createMarketItem'](
        nftcontract,
        tokenId,
        price,
        {value: ethers.utils.parseEther('0.25')}
      )
        const tx = await transaction.wait()
        return tx
    }
  }
  public async buynft(blockchain: string, nftcontract: string, itemId: number, price: number, listingPrice: string): Promise<any> {
    if(blockchain=='ethereum'){
      const contract = await EthereumMarketServiceService.getContract(true)
      const val =price.toString()
      const transaction = await contract['createMarketSale'](
        nftcontract,
        itemId,
        {value: ethers.utils.parseEther(price.toString()),
       }
      )
      const tx = await transaction.wait()
      return tx
    }
    else if(blockchain=='polygon'){
      const contract = await PolygonMarketServiceService.getContract(true)
      const transaction = await contract['createMarketSale'](
        nftcontract,
        itemId,
       {value: ethers.utils.parseEther(price.toString())
       }
      )
      const tx = await transaction.wait()
      return tx
    }
  }

  
}
