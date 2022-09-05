import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mint-popup',
  templateUrl: './mint-popup.component.html',
  styleUrls: ['./mint-popup.component.css'],
})
export class MintPopupComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<MintPopupComponent>,
    private router: Router
  ) {}

  ngOnInit(): void {}

  public close() {
    this.dialogRef.close();
    // let data: any = this.data
    // console.log("bc ",this.data)
    // this.router.navigate(['/user-dashboard'], {
    //   queryParams: { blockchain: this.data },
    // });
  }

  public onClickYes() {
    this.router.navigate(['/mint2']);
    this.close();
  }
}
