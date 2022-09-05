import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MintPopupComponent } from '../mint-popup/mint-popup.component';
@Component({
  selector: 'app-mint3',
  templateUrl: './mint3.component.html',
  styleUrls: ['./mint3.component.css'],
})
export class Mint3Component implements OnInit {
  @Output() proceed: EventEmitter<any> = new EventEmitter();
  data: any;
  constructor(public dialog: MatDialog,private route: ActivatedRoute,private router: Router,) {}

  openDialog() {
    const dialogRef = this.dialog.open(MintPopupComponent);
  }

  save(): void {}

  showInProfile(){
    let data: any = this.data
    console.log("bc ",this.data)
    this.router.navigate(['/user-dashboard'], {
      queryParams: { blockchain: this.data },
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.data = JSON.parse(params['data']);
      console.log('DATA recived: ', this.data);})
  }
}
