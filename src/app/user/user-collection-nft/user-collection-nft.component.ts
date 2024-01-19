import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { SnackbarServiceService } from 'src/app/services/snackbar-service/snackbar-service.service';
import { CollectionService } from 'src/app/services/api-services/collection.service';
import { NftServicesService } from 'src/app/services/api-services/nft-services/nft-services.service';
import { Card, MyNFTCard } from 'src/app/models/marketPlaceModel';
import { timeStamp } from 'console';

@Component({
  selector: 'app-user-collection-nft',
  templateUrl: './user-collection-nft.component.html',
  styleUrls: ['./user-collection-nft.component.css'],
})
export class UserCollectionNFTComponent implements OnInit {
  @ViewChildren('theLastItem', { read: ElementRef })
  theLastItem: QueryList<ElementRef>;
  List: any[] = [];
  MyList: any[] = [];
  collection: any;
  blockchain: string;
  nfts: any;
  Decryption: any;
  dec: string;
  imageSrc: any;
  data: any;
  key: any;
  loading: boolean = false;
  thumbnailSRC: any;
  pk: any;
  paginationflag: boolean = false;
  observer: any;
  currentPage: number = 1;
  nextPage: number = 1;
  nextPageLoading: boolean = false;
  responseArrayLength: number = 0;

  constructor(
    private router: Router,
    private nft: NftServicesService,
    private _sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private snackbarService: SnackbarServiceService,
    private service: CollectionService,
    private _location: Location
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.data = params['collection'];
      this.pk = params['user'];
      this.blockchain = params['blockchain'];
    });
    this.collection = this.data;
    this.key = this.pk;
    this.MyList.splice(0);
    this.List.splice(0);
    this.loading = true;
    if (this.collection !== '' && this.blockchain !== '') {
      this.getNFts();
      this.intersectionFilterObserver();
    } else {
      this.loading = false;
    }
  }

  ngAfterViewInit() {
    this.theLastItem?.changes.subscribe((d) => {
      if (d.last) this.observer.observe(d.last.nativeElement);
    });
  }

  public back() {
    this._location.back();
  }

  private getNFts() {
    if (!this.loading) {
      this.nextPageLoading = true;
    } else {
      this.responseArrayLength = 0;
    }

    this.service
      .getNFTByCollectionName(
        this.collection,
        this.blockchain,
        8,
        this.currentPage,
        this.pk
      )
      .subscribe(
        (res: any) => {
          
          if (Boolean(res)) {
            this.nfts = res.Response.content;
            this.nextPage = res.Response.PaginationInfo.nextpage;
            if (this.nfts == null) {
              this.ngOnInit();
            } else {
              this.responseArrayLength += this.nfts.length;
              for (let x = 0; x < this.nfts.length; x++) {
                if (this.nfts[x].creatoruserid == this.key) {
                  this.MyList.push(this.nfts[x]);
                }
              }
              this.showNFT(this.MyList);
            }
          } else {
            this.loading = false;
            this.nextPageLoading = false;
          }
          
        },
        (err) => {
          this.loading = false;
          this.nextPageLoading = false;
        }
      );
  }

  showNFT(arr: any[]) {
    this.List.splice(0);
    const currLength = this.List.length
    for (let a = 0; a < arr.length; a++) {
      if (this.paginationflag == false) {
        let card: MyNFTCard = new MyNFTCard('', '', '', '', '', '', '', '');
        card.Id = arr[a].Id
        card.thumbnail = ''
        card.ImageBase64 = this.imageSrc;
        // card.thumbnail=this.thumbnailSRC
        card.NFTIdentifier = arr[a].nftidentifier;
        card.NFTName = arr[a].nftname;
        card.Blockchain = arr[a].blockchain;
        card.SellingStatus = arr[a].sellingstatus;
        card.CurrentPrice = arr[a].currentprice
        this.List.push(card);
        if (this.List.length === this.responseArrayLength) {
          this.loading = false;
          this.nextPageLoading = false;
        }
      }
    }

    this.setThumbnails(currLength)
  }

  public setThumbnails (curLength: number) {
    let count = 0;
    for (let x = curLength; x < this.List.length; x++) {
      this.thumbnailSRC = '';
      //this.paginationflag = true;
   
      this.nft.getThumbnailId(this.List[x].Id).subscribe(async (thumbnail: any) => {
        //this.paginationflag = true;
        if (thumbnail == '') {
          this.thumbnailSRC = this.imageSrc;
        } else {
          this.thumbnailSRC = this._sanitizer.bypassSecurityTrustResourceUrl(
            thumbnail.Response.thumbnail
          );
        }
        this.List[x].thumbnail = this.thumbnailSRC;
        /* if (count >= 7) {
          this.paginationflag = false;
        } */
        count++;
      });

      
    }
  }

  seeNFT(id, status, blockchain) {
    if (status == 'Minted') {
      let data: any[] = ['Minted', id, blockchain];
      this.router.navigate(['./sell'], {
        queryParams: { data: JSON.stringify(data) },
      });
    }
    if (status == 'ON SALE') {
      let data: any[] = [id, blockchain];
      this.router.navigate(['./buyNft'], {
        queryParams: { data: JSON.stringify(data) },
      });
    }
    if (status == 'NOTFORSALE') {
      let data: any[] = ['NOTFORSALE', id, blockchain];
      this.router.navigate(['./sell'], {
        queryParams: { data: JSON.stringify(data) },
      });
    }
  }

  intersectionFilterObserver() {
    const option = {
      root: null,
      rootMargin: '0px',
      threshold: 1,
    };

    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (this.nextPage !== 0) {
          this.currentPage++;
          this.getNFts();
        }
      }
    }, option);
  }
}
