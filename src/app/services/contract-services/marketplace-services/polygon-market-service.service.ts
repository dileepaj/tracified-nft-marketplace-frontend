import { MetamaskComponent } from './../../../wallet/metamask/metamask.component';
import { UserWallet } from 'src/app/models/userwallet';
import { Injectable } from '@angular/core';
import { ethers } from "ethers";
import { environment } from 'src/environments/environment';
import detectEthereumProvider from "@metamask/detect-provider";
import MK from "src/contracts/polygon/market.json";

@Injectable({
  providedIn: 'root'
})
export class PolygonMarketServiceService {

  constructor() { }

  
  private static async getWebProvider(requestAccounts = true) {
    const provider: any = await detectEthereumProvider()
  
    if (requestAccounts) {
      await provider.request({ method: 'eth_requestAccounts' })
    }
    return new ethers.providers.Web3Provider(provider)
  }


  public static async getContract(bySigner=false) {
   
    const provider = await PolygonMarketServiceService.getWebProvider()
    const signer = provider.getSigner()
    

    return new ethers.Contract(
      environment.contractAddressMKPolygon,
      MK,
      bySigner ? signer : provider,
    )
  }

  
  public async createSaleOffer(nftcontract: string,tokenId:number,price:string): Promise<any> {
    let metamaskWallet = new UserWallet();
    metamaskWallet = new MetamaskComponent(metamaskWallet);
    const tx=metamaskWallet.createSaleOffer('polygon', nftcontract, tokenId, price, '0.25');
    return tx;
  }

  public async BuyNFT(nftContract: string,itemId:number,price:string,royalty:string,seller:string): Promise<any> {
    console.log("hereeeeeeeeeeeeeeeeeee: ",price,royalty)
    let metamaskWallet = new UserWallet();
    metamaskWallet = new MetamaskComponent(metamaskWallet);
    const tx=metamaskWallet.buynft('polygon', nftContract, itemId, price, '0.25',royalty,seller);
    return tx;
  }



}

