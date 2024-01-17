import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CollectionService } from 'src/app/services/api-services/collection.service';
import { Location } from '@angular/common';
import { NftReviewsComponent } from 'src/app/nft-reviews/nft-reviews.component';
import { NftServicesService } from 'src/app/services/api-services/nft-services/nft-services.service';
import { Collection, MyCollection } from 'src/app/models/collection';

@Component({
  selector: 'app-user-collections',
  templateUrl: './user-collections.component.html',
  styleUrls: ['./user-collections.component.css']
})
export class UserCollectionsComponent implements OnInit {
  @ViewChildren('theLastItem', { read: ElementRef })
  theLastItem: QueryList<ElementRef>;
  collections: Collection[];
  loading: boolean = false;
  nextPageLoading: boolean = false;
  observer: any;
  currentPage: number = 1;
  paginationInfo: any;
  responseArrayLength: number = 0;
  key :string = ''
  selectedblockchain: string = ''
  
  constructor(private route:ActivatedRoute, private service:NftServicesService, private _location: Location,  private router: Router,private collection: CollectionService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params)=>{
      this.key=(params['user']);
      this.selectedblockchain=(params['blockchain'])
    })

    if (this.key != null) {
      this.loading = true;
    this.collections = [];

    this.intersectionObserver();
    this.getAllCollections();
  }

}

  showNFT(collection){
    this.router.navigate(['./user-dashboard/mynfts'], {
      queryParams: { collection: collection,user:this.key,blockchain:this.selectedblockchain},//this.data
    });
  }

  private getAllCollections() {
    if (!this.loading) {
      this.nextPageLoading = true;
    }

    this.collection.getCollectionPK(this.key, 8, this.currentPage).subscribe(async (data: any) => {
        
        if (data != undefined || data.Content != null) {
          this.collections.push(...data.Content);
          this.paginationInfo = data.PaginationInfo;
        }
        this.loading = false;
        this.nextPageLoading = false;
      });
  }

  ngAfterViewInit() {
    this.theLastItem?.changes.subscribe((d) => {
      if (d.last) this.observer.observe(d.last.nativeElement);
    });
  }

  intersectionObserver() {
    const option = {
      root: null,
      rootMargin: '0px',
      threshold: 1,
    };

    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (this.paginationInfo.nextpage !== 0) {
          this.currentPage++;
          this.getAllCollections();
        }
      }
    }, option);
  }

  public back() {
    this._location.back();
  }

}