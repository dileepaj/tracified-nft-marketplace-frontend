import { MetamaskComponent } from 'src/app/wallet/metamask/metamask.component';
import { UserWallet } from './../../../models/userwallet';
import { Injectable } from '@angular/core';
import { ethers } from "ethers";
import { environment } from 'src/environments/environment';
import detectEthereumProvider from "@metamask/detect-provider";
import NFT from "src/contracts/ethereum/market.json";
import { SnackbarServiceService } from '../../snackbar-service/snackbar-service.service';

@Injectable({
  providedIn: 'root'
})
export class EthereumMarketServiceService {

  constructor(private snackbarService : SnackbarServiceService) { }

  
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

  public async getListingID( _callback? : any): Promise<any> {
    const contract = await EthereumMarketServiceService.getContract(true)
    const transaction = await contract['getAvailableListingId']()
    .catch(error=>{
      _callback()!
      this.snackbarService.openSnackBar("Something went wrong : "+ " Transaction failed", 'error')
    })
    const tx = await transaction
    return tx
  }

  
  public async createSaleOffer(nftsvgHash:string,price:number,commission:string, _callback? :any): Promise<any> {
    let metmaskWallet = new UserWallet();
    metmaskWallet = new MetamaskComponent(metmaskWallet);
    const tx = metmaskWallet.createSaleOffer('ethereum', nftsvgHash,price,commission,_callback)
    return tx

  }

  public async BuyNFT(_itemID: string,price:string,  _callback? :any): Promise<any> {
    let metmaskWallet = new UserWallet();
    metmaskWallet = new MetamaskComponent(metmaskWallet);
    const tx = metmaskWallet.buynft('ethereum',_itemID,price, _callback)
    return tx
  }


}

