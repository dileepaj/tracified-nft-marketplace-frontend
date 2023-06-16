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


  
  
  public async createSaleOffer(nftsvgHash:string,price:number, _callback? :any): Promise<any> {
    let metamaskWallet = new UserWallet();
    metamaskWallet = new MetamaskComponent(metamaskWallet);
    const tx=metamaskWallet.createSaleOffer('polygon', nftsvgHash, price,_callback);
    return tx;
  }

  public async BuyNFT(_itemID: string,  _callback? :any): Promise<any> {
    let metamaskWallet = new UserWallet();
    metamaskWallet = new MetamaskComponent(metamaskWallet);
    const tx=metamaskWallet.buynft('polygon', _itemID, _callback);
    return tx;
  }



}

