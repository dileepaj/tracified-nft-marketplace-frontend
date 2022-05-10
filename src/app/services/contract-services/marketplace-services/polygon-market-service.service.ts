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
    console.log("-----------------inside polygon sell-----------------",nftcontract,price,tokenId)
    const contract = await PolygonMarketServiceService.getContract(true)
    
    // await contract['YOUR_PAYABLE_FUNCTION'](ALL, OTHER, PARAMETERS, {value: ethers.utils.parseEther(ETH_VALUE_AS_STRING)});
    const transaction = await contract['createMarketItem'](
      nftcontract,
      tokenId,
      price,
      {value: ethers.utils.parseEther('0.25')}
    )
    const tx = await transaction.wait()
    console.log(tx)
    console.log("----------------------------item id ",parseInt(tx.logs[3].topics[1]))
    return tx
  }

  public async BuyNFT(nftContract: string,itemId:number,price:number): Promise<any> {
    const contract = await PolygonMarketServiceService.getContract(true)
    console.log("----------price----------------",price.toString(),itemId,nftContract)
    const transaction = await contract['createMarketSale'](
      nftContract,
      itemId,
     {value: ethers.utils.parseEther(price.toString())
     }
    )
    const tx = await transaction.wait()

    console.log(tx)
    return tx
  }



}

