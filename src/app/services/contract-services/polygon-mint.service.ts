import { Injectable } from '@angular/core';
import { ethers } from "ethers";
import { environment } from 'src/environments/environment';
import detectEthereumProvider from "@metamask/detect-provider";
import NFT from "src/contracts/polygon/mint.json";
import { SnackbarServiceService } from '../snackbar-service/snackbar-service.service';


@Injectable({
  providedIn: 'root'
})
export class PolygonMintService {

  constructor(private snackbarService: SnackbarServiceService) { }

  
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
  public async mintInPolygon(reciever: string, tokenURI: string, _callback? : any): Promise<any> {
    const contract = await PolygonMintService.getContract(true)
    const transaction = await contract['mintNFT'](
      reciever,
      tokenURI,
      { gasLimit: 3000000 }
    )
.catch(error=>{
  _callback()!
  this.snackbarService.openSnackBar("Something went wrong : "+"Transaction failed", 'error')
})
    const tx = await transaction.wait()
    .catch(error1=>{
      _callback()!
      this.snackbarService.openSnackBar("Something went wrong : "+ "Transaction failed", 'error')
    })
    return tx
  }

  public async approveContract(tokenId:number, _callback? : any):Promise<any>{
    var marketcontract=environment.contractAddressMKPolygon
    const contract = await PolygonMintService.getContract(true)
    const transaction = await contract['approve'](
      marketcontract,
      tokenId,
      { gasLimit: 3000000 }
    )
    .catch(error=>{
      _callback()!
      this.snackbarService.openSnackBar("Something went wrong : "+"Transcation failed", 'error')
    })
    const tx = await transaction.wait()
    return tx
  }
}
