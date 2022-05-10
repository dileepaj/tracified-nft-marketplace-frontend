import { Injectable } from '@angular/core';
import { ethers, utils } from "ethers";
import { environment } from 'src/environments/environment';
import detectEthereumProvider from "@metamask/detect-provider";
import NFT from "src/contracts/ethereum/mint.json";
import { parseEther } from 'ethers/lib/utils';

@Injectable({
  providedIn: 'root'
})
export class EthereumMintService {
 gasPrice:any
  static gasPrice: ethers.BigNumber;
 // static gasprice: ethers.BigNumber;

  constructor() { }
 //gasprice:any;
  
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
    // console.log("--------------",provider.getCode(environment.contractAddressNFTEthereum))
    //this.gasprice = await provider.getGasPrice()
    
    return new ethers.Contract(
      environment.contractAddressNFTEthereum,
      NFT,
      bySigner ? signer : provider,
    )
  }

  
  public async mintInEthereum(reciever: string,name:string,proofBotData:string,tdpData:string, tokenURI: string): Promise<any> {
    const contract = await EthereumMintService.getContract(true)
    // const provider = await EthereumMintService.getWebProvider()
    // EthereumMintService.gasPrice = await provider.getGasPrice()
    // this.gasPrice= await provider.estimateGas({
    //   // Wrapped ETH address
    //   to: "0xc3B3511AB3b0892b20a618221b2d6e0BDAafc067",
    
    //   // `function deposit() payable`
    //   data: "0xa40d1b10000000000000000000000000999c020c60cfe6d1bca6c4d540fa9dac1f16c16300000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000160000000000000000000000000000000000000000000000000000000000000000e657468657265756d746f6b656e73000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000376686a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001761207465737420746f20636865636b206e6574776f726b000000000000000000000000000000000000000000000000000000000000000000000000000000000376686a0000000000000000000000000000000000000000000000000000000000",
    
    //   // 1 ether
    //   value: parseEther("0")
    // });

    //console.log("gas price",this.gasPrice)

    const transaction = await contract['mintNFT'](
      reciever,
      name,
      proofBotData,
      tdpData,
      tokenURI,
    //   {
    //    gasPrice: ethers.utils.parseUnits(utils.formatUnits(EthereumMintService.gasPrice, "gwei"),"gwei"),
    //    gasLimit: 3000000,
    //    value: ethers.utils.parseEther('0'),}
    //   //{gasPrice: ethers.utils.parseUnits('589090', 'gwei'), gasLimit: 1000000}
    //   //utils.formatUnits(EthereumMintService.gasPrice, "gwei")
    )
    console.log("----------------------------------------------------------------kkkkkk")
    const tx = await transaction.wait()
    console.log("----------------------------tx",tx)
    console.log("----------------------------transaction",transaction)
    console.log("----------------------------token id ",parseInt(tx.logs[0].topics[3]))
    console.log("----------------------------tx hash ",transaction.hash)
    return tx
  }


}
