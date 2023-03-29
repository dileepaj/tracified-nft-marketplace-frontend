import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { userAgreementPromt2 } from 'src/app/models/confirmDialog';

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
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: userAgreementPromt2,
    private matDialogRef: MatDialogRef<ConfirmSellComponent>
  ) { }

  ngOnInit(): void {
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
    this.convertToUSD();
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


  private convertToUSD() {
    fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${this.blockchain}`
    )
      .then((res) => res.json())
      .then((res) => {
        const rate = res[0].current_price;
        const src = parseFloat(this.serviceFee);
        const tot = parseFloat(this.total);
        const roy = parseFloat(this.royalty);
        const gtot = parseFloat(this.grandTotal)
        this.serviceFeeUSD = (src * rate).toFixed(2);
        this.totalUSD = (tot * rate).toFixed(2);
        this.royaltyUSD =(roy * rate).toFixed(2);
        this.gtotalUSD = (gtot * rate).toFixed(2);
      })
      .catch(() => {
        this.serviceFeeUSD = '0.00';
        this.totalUSD = '0.00';
        this.royaltyUSD='0.00';
        this.gtotalUSD='0.00';
      });
  }

}
