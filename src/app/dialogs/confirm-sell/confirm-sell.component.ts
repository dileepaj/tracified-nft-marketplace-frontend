import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { userAgreementPromt2 } from 'src/app/models/confirmDialog';
import { CurrencyConverterService } from 'src/app/services/api-services/crypto-currency-converter/currency-converter.service';

@Component({
  selector: 'app-confirm-sell',
  templateUrl: './confirm-sell.component.html',
  styleUrls: ['./confirm-sell.component.css']
})
export class ConfirmSellComponent implements OnInit {
  serviceFee : any;
  total : any;
  serviceFeeUSD: string;
  totalUSD: string;
  blockchain : any;
  currency : string;
  public acceptEnabled: boolean = false;
  state: string;
  royalty: any;
  grandTotal: any;
  royaltyUSD: string;
  gtotalUSD: string;
  currencyRate: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: userAgreementPromt2,
    private matDialogRef: MatDialogRef<ConfirmSellComponent>,
    private currencyConverter:CurrencyConverterService
  ) { }

  ngOnInit(): void {
    this.serviceFeeUSD = `...`;
    this.totalUSD = `...`;
    this.royaltyUSD =`...`;
    this.gtotalUSD = `...`;


    this.serviceFee = this.data.serviceFee?.toString()
    this.total = this.data.total?.toString()
    this.blockchain = this.data.blockchain?.toString()
    this.royalty = this.data.royaltyfee?.toString()
    this.grandTotal = this.data.grandTotalfee?.toString()
    if(this.blockchain === 'ethereum') {
      this.currency = 'ETH'
    }
    else if(this.blockchain == 'polygon'){
      this.currency = 'MATIC'
    }
    else if(this.blockchain === 'stellar') {
      this.currency = 'XLM'
    }
    else if(this.blockchain === 'solana') {
      this.currency = 'SOL'
    }
    this.getCurrencyRate().then(res=>{
      this.convertToUSD();
    })
    
  }

  
  public onCheckedChange(e: any) {
    this.acceptEnabled = e.target.checked;
  }

  public confirm() {
    this.matDialogRef.close(true);
  }

  public cancel() {
    this.matDialogRef.close(false);
  }


  public async getCurrencyRate(){
    this.currencyConverter.GetUSDratebyBC(this.blockchain).subscribe(res => {
      this.currencyRate = res.data.priceUsd;
      return this.currencyRate;
    })
  }
  private async convertToUSD() {
    const rate = this.currencyRate;
    const src = parseFloat(this.serviceFee);
    const tot = parseFloat(this.total);
    const roy = parseFloat(this.royalty);
    const gtot = parseFloat(this.grandTotal)
    this.currencyConverter.GetUSDratebyBC(this.blockchain).subscribe(res => {
      this.currencyRate = res.data.priceUsd;
      this.serviceFeeUSD = (src * this.currencyRate).toFixed(4);
      this.totalUSD = (tot * this.currencyRate).toFixed(4);
      this.royaltyUSD =(roy * this.currencyRate).toFixed(4);
      this.gtotalUSD = (gtot * this.currencyRate).toFixed(4);
    })
    

  }

}
