import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialog } from 'src/app/models/confirmDialog';
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
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialog,
    private matDialogRef: MatDialogRef<ConfirmComponent>
  ) {}

  ngOnInit(): void {
    this.serviceFee = this.data.serviceFee?.toString()
    this.total = this.data.serviceFee?.toString()
    this.blockchain = this.data.blockchain?.toString()
    if(this.blockchain === 'ethereum' || this.blockchain === 'polygon') {
      this.currency = 'ETH'
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
        this.serviceFeeUSD = (src * rate).toFixed(2);
        this.totalUSD = (tot * rate).toFixed(2);
      })
      .catch(() => {
        this.serviceFeeUSD = '0.00';
        this.totalUSD = '0.00';
      });
  }
}
