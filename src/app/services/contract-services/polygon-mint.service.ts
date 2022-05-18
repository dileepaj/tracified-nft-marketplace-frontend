import { Injectable } from '@angular/core';
import { ethers } from "ethers";
import { environment } from 'src/environments/environment';
import detectEthereumProvider from "@metamask/detect-provider";
import NFT from "src/contracts/polygon/mint.json";


@Injectable({
  providedIn: 'root'
})
export class PolygonMintService {

  constructor() { }

  
  private static async getWebProvider(requestAccounts = true) {
    const provider: any = await detectEthereumProvider()
  
    if (requestAccounts) {
      await provider.request({ method: 'eth_requestAccounts' })
    }
    return new ethers.providers.Web3Provider(provider)
  }


  private static async getContract(bySigner=false) {

    const provider = await PolygonMintService.getWebProvider()
    const signer = provider.getSigner()

    return new ethers.Contract(
      environment.contractAddressNFTPolygon,
      NFT,
      bySigner ? signer : provider,
    )
  }

  
  public async mintInPolygon(reciever: string, tokenURI: string): Promise<any> {
    console.log(reciever,tokenURI)
    const contract = await PolygonMintService.getContract(true)
    const transaction = await contract['mintNFT'](
      reciever,
      tokenURI
    )
    const tx = await transaction.wait()
  
    console.log("----------------------------tx",tx)
    console.log("----------------------------tx",transaction)
    console.log("----------------------------token id ",parseInt(tx.logs[0].topics[3]))
    return tx
  }

  // public async getTokenID(tokenURI: string): Promise<any> {
  //   console.log(tokenURI)
  //   const contract = await PolygonMintService.getContract(true)
  //   const transaction = await contract['getTokenID'](
  //     tokenURI
  //   )
  //   const tx = await transaction.wait()
    
  //   console.log("----------------------------tx",tx)
  //   console.log("----------------------------tx[]",tx[1])
  //   console.log("----------------------------tx",transaction)
  //   console.log("----------------------------tx",transaction[0])
  //   return tx
  // }

  // public async getTokenID(tokenURI: string): Promise<any[]> {
  //   const contract = await PolygonMintService.getContract(true)

  //   return await contract['getTokenID'](tokenURI)
  // }

  


}