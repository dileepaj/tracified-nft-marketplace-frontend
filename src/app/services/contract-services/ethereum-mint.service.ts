import { Injectable } from '@angular/core';
import { ethers} from "ethers";
import { environment } from 'src/environments/environment';
import detectEthereumProvider from "@metamask/detect-provider";
import NFT from "src/contracts/ethereum/mint.json";
import { SnackbarServiceService } from '../snackbar-service/snackbar-service.service';

@Injectable({
  providedIn: 'root'
})
export class EthereumMintService {
 gasPrice:any
  static gasPrice: ethers.BigNumber;
  constructor(private snackbarService : SnackbarServiceService) { }
  private static async getWebProvider(requestAccounts = true) {
    const provider: any = await detectEthereumProvider()
  
    if (requestAccounts) {
      await provider.request({ method: 'eth_requestAccounts' })
    }
    return new ethers.providers.Web3Provider(provider)
  }
  private static async getContract(bySigner=false) {
   
    const provider = await EthereumMintService.getWebProvider()
    const signer = provider.getSigner()
    return new ethers.Contract(
      environment.contractAddressNFTEthereum,
      NFT,
      bySigner ? signer : provider,
    )
  }

  
  public async mintInEthereum(reciever: string,name:string,proofBotData:string,tdpData:string, tokenURI: string, _callback? : any): Promise<any> {
    const contract = await EthereumMintService.getContract(true)
    const transaction = await contract['mintNFT'](
      reciever,
      name,
      proofBotData,
      tdpData,
      tokenURI,
      { gasLimit: 3000000 }
    )
    .catch(error=>{
      _callback()!
      this.snackbarService.openSnackBar("Something went wrong : "+error.message, 'error')
    })
    const tx = await transaction.wait()
    return tx
  }

  public async approveContract(tokenId:number, _callback? :any):Promise<any>{
    var marketcontract=environment.contractAddressMKEthereum
    const contract = await EthereumMintService.getContract(true)
    const transaction = await contract['approve'](
      marketcontract,
      tokenId,
      { gasLimit: 3000000 }
    )
    .catch(error=>{
      _callback()!
      this.snackbarService.openSnackBar("Something went wrong : "+error.message, 'error')
    })
    const tx = await transaction.wait()
    return tx
  }
}
