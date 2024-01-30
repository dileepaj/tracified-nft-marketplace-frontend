import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Collection } from 'src/app/models/collection';
import { ChangeVisibilityDialogComponent } from '../change-visibility-dialog/change-visibility-dialog.component';

@Component({
  selector: 'app-collection-card',
  templateUrl: './collection-card.component.html',
  styleUrls: ['./collection-card.component.css'],
})
export class CollectionCardComponent implements OnInit {
  @Input() data: any;
  @Input() key: string;
  @Input() selectedblockchain: string;
  @Input() isUserProfile: boolean = false;
  thumbnail: string = '';

  constructor(private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    console.log(this.data.Id);
    this.thumbnail = `https://ipfs.filebase.io/ipfs/${this.data.cid}`;
  }

  public goToNfts(e: any) {
    if (this.router.url.includes('user-dashboard')) {
      if (e.target.id! !== 'more-icon') {
        this.router.navigate(['./user-dashboard/mynfts'], {
          queryParams: {
            collection: this.data.CollectionName,
            user: this.key,
            blockchain: this.selectedblockchain,
            filter: 'All',
          }, //this.data
        });
      }
    } else {
      this.router.navigate(['/explore/nfts'], {
        queryParams: {
          collection: this.data.CollectionName,
          blockchain: 'all',
          filter: 'all',
        },
      });
    }
  }

  public changeVisibility() {
    const dialogRef = this.dialog.open(ChangeVisibilityDialogComponent, {
      data: {
        id: this.data.Id,
        isPublic: this.data.ispublic,
      },
    });
  }
}
