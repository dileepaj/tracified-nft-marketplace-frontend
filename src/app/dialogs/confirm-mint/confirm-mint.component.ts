import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialog, userAgreementPromt } from 'src/app/models/confirmDialog';
import { CurrencyConverterService } from 'src/app/services/api-services/crypto-currency-converter/currency-converter.service';
import { ConfirmComponent } from '../confirm/confirm.component';

@Component({
  selector: 'app-confirm-mint',
  templateUrl: './confirm-mint.component.html',
  styleUrls: ['./confirm-mint.component.css']
})
export class ConfirmMintComponent implements OnInit {
  serviceFee : any;
  total : any;
  serviceFeeUSD: string;
  totalUSD: string;
  blockchain : any;
  currency : string;
  public acceptEnabled: boolean = false;
  state: string;
  currencyRate: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: userAgreementPromt,
    private matDialogRef: MatDialogRef<ConfirmComponent>,
    private currencyConverter:CurrencyConverterService
  ) {}

  ngOnInit(): void {
    this.serviceFeeUSD = "...";
      this.totalUSD = "...";
    this.serviceFee = this.data.serviceFee?.toString()
    this.total = this.data.total?.toString()
    this.blockchain = this.data.blockchain?.toString()
    if(this.blockchain === 'ethereum' && this.data.isfiat===false) {
      this.currency = 'ETH'
    }
    else if(this.blockchain == 'polygon' && this.data.isfiat===false){
      this.currency = 'MATIC'
    }
    else if(this.blockchain === 'stellar' && this.data.isfiat===false) {
      this.currency = 'XLM'
    }
    else if(this.blockchain === 'solana' && this.data.isfiat===false) {
      this.currency = 'SOL'
    }else{
      this.currency = 'JPY'
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
    if(this.data.isfiat==true){
      this.currencyConverter.GetUSDratebyFiat("japanese-yen").subscribe(res => {
        this.currencyRate = res.data.rateUsd;
        return this.currencyRate;
      })
    }else{
      this.currencyConverter.GetUSDratebyBC(this.blockchain).subscribe(res => {
        this.currencyRate = res.data.priceUsd;
        return this.currencyRate;
      })
    }
  }
  private convertToUSD() {
    if(this.data.isfiat==true){
      this.currencyConverter.GetUSDratebyFiat("japanese-yen").subscribe(res => {
        this.currencyRate = res.data.rateUsd;
        const src = parseFloat(this.serviceFee);
        const tot = parseFloat(this.total);
        this.serviceFeeUSD = (src * this.currencyRate).toFixed(4);
        this.totalUSD = (tot * this.currencyRate).toFixed(4);
      })
    }else{
      this.currencyConverter.GetUSDratebyBC(this.blockchain).subscribe(res => {
        this.currencyRate = res.data.priceUsd;
        const src = parseFloat(this.serviceFee);
        const tot = parseFloat(this.total);
        this.serviceFeeUSD = (src * this.currencyRate).toFixed(4);
        this.totalUSD = (tot * this.currencyRate).toFixed(4);
      })
    }
  }
}
