import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MintPopupComponent } from '../mint-popup/mint-popup.component';
import { timer } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { DialogService } from 'src/app/services/dialog-services/dialog.service';
@Component({
  selector: 'app-mint3',
  templateUrl: './mint3.component.html',
  styleUrls: ['./mint3.component.css'],
})
export class Mint3Component implements OnInit {
  @Input() blockchain: string;
  @Output() proceed: EventEmitter<any> = new EventEmitter();
  @Output() mintagain: EventEmitter<any> = new EventEmitter();
  data: any;
  event: any = 'refresh';
  alive: boolean = true;
  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private dialogService : DialogService
  ) {}

  openDialog() {
    this.dialogService.openMintAgain().subscribe((res) => {
      if(res) {
        this.mintagain.emit();
      }
    })
  }

  save(): void {}

  showInProfile() {
    let data: any = this.data;
    this.router.navigate(['/user-dashboard'], {
      queryParams: { blockchain: this.data },
    });
  }

  ngOnChanges(): void {
    this.data = this.blockchain;
  }

  ngOnInit(): void {}
  ngOnDestroy() {
    this.alive = false;
  }

  public goToProfile(): void {
    this.router.navigate(['/user-dashboard/overview'], {
      queryParams: { blockchain: this.blockchain },
    });
  }
}
