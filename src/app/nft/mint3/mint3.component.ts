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
  @Input() user: string;
  @Output() proceed: EventEmitter<any> = new EventEmitter();
  @Output() mintagain: EventEmitter<any> = new EventEmitter();
  data: any;
  event: any = 'refresh';
  alive: boolean = true;
  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private dialogService: DialogService
  ) {}

  openDialog() {
    this.dialogService.openMintAgain().subscribe((res) => {
      if (res) {
        this.mintagain.emit();
      }
    });
  }

  save(): void {}

  showInProfile() {
    this.router.navigate(['/user-dashboard/myitems'], {
      queryParams: { user: this.user, blockchain: this.blockchain,filter:"All" },
    });
  }

  ngOnChanges(): void {}

  ngOnInit(): void {}
  ngOnDestroy() {
    this.alive = false;
  }
}
