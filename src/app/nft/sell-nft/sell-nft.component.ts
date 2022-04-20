import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NFTMarket ,Sales} from 'src/app/models/nft';

@Component({
  selector: 'app-sell-nft',
  templateUrl: './sell-nft.component.html',
  styleUrls: ['./sell-nft.component.css']
})
export class SellNftComponent implements OnInit {
  controlGroupSell: FormGroup;
  nft:NFTMarket=new NFTMarket('','','','','','','','','','','','','','','','','','','','','','','','','')
  sale:Sales=new Sales('','')
  royalty:any;
  firstPrice:any;
  royaltyCharge:any;
  sellingPrice:any;
  constructor() { }
  Sell():void{
    this.nft.SellingStatus="ON SALE"
    this.royalty=parseInt(this.formValue('Royalty'));
    this.firstPrice=parseInt(this.formValue('Price'));
    this.royaltyCharge=this.firstPrice*(this.royalty/100)
    this.sellingPrice=this.firstPrice+this.royaltyCharge;
    this.nft.Price=this.sellingPrice.ToString();
    


  }
 

  ngOnInit(): void {
    this.controlGroupSell = new FormGroup({
      Price: new FormControl(this.sale.Price, Validators.required),
      Royalty:new FormControl(this.sale.Royalty,Validators.required),
      //SellingStatus:new FormControl(this.nft.SellingStatus,Validators.required),
    });
  }

  private formValue(controlName: string): any {
    return this.controlGroupSell.get(controlName)!.value;
  }

}
