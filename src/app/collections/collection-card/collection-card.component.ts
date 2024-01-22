import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Collection } from 'src/app/models/collection';

@Component({
  selector: 'app-collection-card',
  templateUrl: './collection-card.component.html',
  styleUrls: ['./collection-card.component.css'],
})
export class CollectionCardComponent implements OnInit {
  @Input() data: Collection;
  @Input() key: string;
  @Input() selectedblockchain: string;
  thumbnail: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.thumbnail = `https://ipfs.filebase.io/ipfs/${this.data.cid}`;
  }

  public goToNfts() {
    if (this.router.url.includes('user-dashboard')) {
      this.router.navigate(['./user-dashboard/mynfts'], {
        queryParams: {
          collection: this.data.CollectionName,
          user: this.key,
          blockchain: this.selectedblockchain,
          filter: 'BOUGHT',
        }, //this.data
      });
    } else {
      this.router.navigate(['/explore/nfts'], {
        queryParams: {
          collection: this.data.CollectionName,
          blockchain: 'stellar',
          filter: 'all',
        },
      });
    }
  }
}
