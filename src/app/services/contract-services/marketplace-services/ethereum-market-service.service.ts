import { MetamaskComponent } from 'src/app/wallet/metamask/metamask.component';
import { UserWallet } from './../../../models/userwallet';
import { Injectable } from '@angular/core';
import { ethers } from "ethers";
import { environment } from 'src/environments/environment';
import detectEthereumProvider from "@metamask/detect-provider";
import NFT from "src/contracts/ethereum/market.json";

@Injectable({
  providedIn: 'root'
})
export class EthereumMarketServiceService {

  constructor() { }

  
  private static async getWebProvider(requestAccounts = true) {
    const provider: any = await detectEthereumProvider()
  
    if (requestAccounts) {
      await provider.request({ method: 'eth_requestAccounts' })
    }
    return new ethers.providers.Web3Provider(provider)
  }


  public static async getContract(bySigner=false) {
   
    const provider = await EthereumMarketServiceService.getWebProvider()
    const signer = provider.getSigner()

    return new ethers.Contract(
      environment.contractAddressMKEthereum,
      NFT,
      bySigner ? signer : provider,
    )
  }

  
  public async createSaleOffer(nftcontract: string,tokenId:number,price:number): Promise<any> {
    // const contract = await EthereumMarketServiceService.getContract(true)
    // const transaction = await contract['sellNFT'](
    //   nftcontract,
    //   tokenId,
    //   price,
    //   {value: ethers.utils.parseEther('1')
    //   }
    // )
    // const tx = await transaction.wait()
    // return tx
    let metmaskWallet = new UserWallet();
    metmaskWallet = new MetamaskComponent(metmaskWallet);
    const tx = metmaskWallet.createSaleOffer('ethereum',nftcontract, tokenId, price,'1')
    return tx

  }

  public async BuyNFT(nftcontract: string,itemId:number,price:number): Promise<any> {
    // const contract = await EthereumMarketServiceService.getContract(true)
    // const val =price.toString()
    // const transaction = await contract['createMarketSale'](
    //   nftcontract,
    //   itemId,
    //   {value: ethers.utils.parseEther('1'),
    //  }
    // )
    // const tx = await transaction.wait()
    // return tx
    let metmaskWallet = new UserWallet();
    metmaskWallet = new MetamaskComponent(metmaskWallet);
    const tx = metmaskWallet.buynft('ethereum',nftcontract, itemId, price,'1')
    return tx
  }


}

