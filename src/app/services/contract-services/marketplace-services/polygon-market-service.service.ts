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


  private static async getContract(bySigner=false) {
   
    const provider = await PolygonMarketServiceService.getWebProvider()
    const signer = provider.getSigner()
    

    return new ethers.Contract(
      environment.contractAddressMKPolygon,
      MK,
      bySigner ? signer : provider,
    )
  }

  
  public async createSaleOffer(nftcontract: string,tokenId:number,price:number): Promise<any> {
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

  public async BuyNFT(nftContract: string,itemId:number,price:number): Promise<any> {
    const contract = await PolygonMarketServiceService.getContract(true)
    const transaction = await contract['createMarketSale'](
      nftContract,
      itemId,
     {value: ethers.utils.parseEther(price.toString())
     }
    )
    const tx = await transaction.wait()
    return tx
  }



}

