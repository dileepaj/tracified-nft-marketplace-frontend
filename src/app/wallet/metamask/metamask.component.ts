import { Component, OnInit } from '@angular/core';
import { Wallet } from 'src/app/models/wallet';
import { walletOptions } from 'src/app/models/walletoptions';
import detectEthereumProvider from '@metamask/detect-provider';
import { EthereumMarketServiceService } from 'src/app/services/contract-services/marketplace-services/ethereum-market-service.service';
import { ethers } from 'ethers';
import { PolygonMarketServiceService } from 'src/app/services/contract-services/marketplace-services/polygon-market-service.service';
import { EthereumMintService } from 'src/app/services/contract-services/ethereum-mint.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-metamask',
  templateUrl: './metamask.component.html',
  styleUrls: ['./metamask.component.css'],
})
export class MetamaskComponent extends walletOptions implements OnInit {
  public signTransaction(): void {
    throw new Error('Method not implemented.');
  }
  constructor(wallet: Wallet) {
    super();
    this.decoratorWallet = wallet;
  }

  ngOnInit(): void {}
  async initWallelt(_callback?: any): Promise<void> {
    if (typeof (window as any).ethereum != 'undefined') {
      await (window as any).ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((addresses: any) => {
          this.walletAddress = addresses[0];
          if (_callback !== undefined) {
            _callback(addresses[0]);
          }
        })
        .catch((e: { code:any,message: any }) => {
          return;
        });
    } else {
       window.location.href = 'https://metamask.io/';
    }
  }
  public getWalletaddress(): string {
    return this.walletAddress;
  }
  public disconenctWallet(): void {
    throw new Error('Method not implemented.');
  }
  public async createSaleOffer(
    blockchain: string,
    nftsvgHash: string,
    price:number,
    commission:string,
    _callback? : any
  ): Promise<any> {
    if (blockchain == 'ethereum') {
      console.log("-------------------data----------",blockchain,nftsvgHash,price,commission)
      const _priceInWei = ethers.utils.parseEther((price).toString())
      const _price= ethers.BigNumber.from(_priceInWei).toNumber()
      const commissionInWei=ethers.utils.parseEther(commission)
      const _commission=ethers.BigNumber.from(commissionInWei).toNumber()
      console.log("----------",_price)
      const str = nftsvgHash;
      const encoder = new TextEncoder();
      const _nfthash = encoder.encode(str);
      console.log("hash is",_nfthash);
      const contract = await EthereumMarketServiceService.getContract(true);
      console.log("------------contract----------",contract,_nfthash,_price,_commission)
      const transaction = await contract['listNFT'](
        _nfthash,
        _price,
       // { gasLimit: 3000000 },
        {value: _commission}// 
      )
      .catch(error=>{       
        _callback()!
      })
      console.log("transaction body : ",transaction)
      const tx = await transaction.wait();
      return tx;
    }
    if (blockchain == 'polygon') {
      console.log("-------------------data----------",blockchain,nftsvgHash,price,commission)
      const _priceInWei = ethers.utils.parseEther((price).toString())
      const _price= ethers.BigNumber.from(_priceInWei).toNumber()
      const commissionInWei=ethers.utils.parseEther(commission)
      const _commission=ethers.BigNumber.from(commissionInWei).toNumber()
      console.log("----------",_price)
      const str = nftsvgHash;
      const encoder = new TextEncoder();
      const _nfthash = encoder.encode(str);
      console.log("hash is",_nfthash);
      const contract = await PolygonMarketServiceService.getContract(true);
      const transaction = await contract['listNFT'](
        _nfthash,
        _price,
       // { gasLimit: 3000000 },
        {value: _commission}// 
      )
      .catch(error=>{
        _callback()!
      })
      const tx = await transaction.wait();
      return tx;
    }
  }

  public async buynft(
    blockchain: string,
    itemID: string,
    price:string,
    _callback? : any
  ): Promise<any> {
    if (blockchain == 'ethereum') {
      console.log("data is ",price,itemID)
      const _priceInWei = ethers.utils.parseEther((price).toString())
      const _price= ethers.BigNumber.from(_priceInWei).toNumber()
      const _itemID=parseInt(itemID)
      console.log("after conversin ",_itemID,_price)
      const contract = await EthereumMarketServiceService.getContract(true);
      const transaction = await contract['buyNFT'](
        _itemID,
       // { gasLimit: 3000000 },
        {value: _price}
      )
      .catch(error=>{
        _callback()!
      })
      const tx = await transaction.wait();
      return tx;
    } else if (blockchain == 'polygon') {
      console.log("data is ",price,itemID)
      const _priceInWei = ethers.utils.parseEther((price).toString())
      const _price= ethers.BigNumber.from(_priceInWei).toNumber()
      const _itemID=parseInt(itemID)
      console.log("after conversin ",_itemID,_price)
  
      const contract = await PolygonMarketServiceService.getContract(true);
      const transaction = await contract['buyNFT'](
        _itemID,
       // { gasLimit: 3000000 },
        {value: _price}
      )
      .catch(error=>{
        _callback()!
      })
      const tx = await transaction.wait();
      return tx;
    }
  }



}
