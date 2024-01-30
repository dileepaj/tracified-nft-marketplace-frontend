import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { SnackbarServiceService } from 'src/app/services/snackbar-service/snackbar-service.service';
import { CollectionService } from 'src/app/services/api-services/collection.service';
import { NftServicesService } from 'src/app/services/api-services/nft-services/nft-services.service';
import { Card, MyNFTCard } from 'src/app/models/marketPlaceModel';
import { timeStamp } from 'console';
import albedo from '@albedo-link/intent';
import { UserWallet } from 'src/app/models/userwallet';
import { FreighterComponent } from 'src/app/wallet/freighter/freighter.component';
import { MetamaskComponent } from 'src/app/wallet/metamask/metamask.component';
import { PhantomComponent } from 'src/app/wallet/phantom/phantom.component';

@Component({
  selector: 'app-my-items',
  templateUrl: './my-items.component.html',
  styleUrls: ['./my-items.component.css'],
})
export class MyItemsComponent implements OnInit {
  @ViewChildren('theLastItem', { read: ElementRef })
  @ViewChild('ddRef')
  ddRef: ElementRef<HTMLElement>;
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
  isOnBcDropdown: boolean = false;
  isOnOtherDropdown: boolean = false;
  selectedFilter: string = 'All';

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
      this.data = '';
      this.pk = params['user'];
      this.blockchain = params['blockchain'];
      this.selectedFilter = params['filter'];

      this.collection = this.data;
      this.key = this.pk;
      this.MyList.splice(0);
      this.List.splice(0);
      this.loading = true;
      if (this.blockchain !== '') {
        this.getNFts();
        this.intersectionFilterObserver();
      } else {
        this.loading = false;
      }
    });
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

    let bc = this.blockchain;
    let isfiat = false;
    if (this.blockchain === 'jpy') {
      bc = 'solana';
      isfiat = true;
    }

    this.service
      .getNFTByCollectionName(
        this.collection,
        bc,
        8,
        this.currentPage,
        this.pk,
        this.selectedFilter,
        isfiat
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
    const currLength = this.List.length;
    for (let a = 0; a < arr.length; a++) {
      if (this.paginationflag == false) {
        let card: MyNFTCard = new MyNFTCard('', '', '', '', '', '', '', '', '');
        card.Id = arr[a].Id;
        card.thumbnail = '';
        card.ImageBase64 = this.imageSrc;
        // card.thumbnail=this.thumbnailSRC
        card.NFTIdentifier = arr[a].nftidentifier;
        card.NFTName = arr[a].nftname;
        card.Blockchain = arr[a].blockchain;
        card.SellingStatus = arr[a].sellingstatus;
        card.CurrentPrice = arr[a].currentprice;
        card.CurrentOwnerPK = arr[a].currentownerpk;
        this.List.push(card);
        if (this.List.length === this.responseArrayLength) {
          this.loading = false;
          this.nextPageLoading = false;
        }
      }
    }

    this.setThumbnails(currLength);
  }

  public setThumbnails(curLength: number) {
    let count = 0;
    for (let x = curLength; x < this.List.length; x++) {
      this.thumbnailSRC = '';
      //this.paginationflag = true;

      this.nft
        .getThumbnailId(this.List[x].Id)
        .subscribe(async (thumbnail: any) => {
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

  public goBack() {
    this.router.navigate(['./user-dashboard/mycollections'], {
      queryParams: {
        collection: this.data,
        user: this.key,
        blockchain: this.blockchain,
      }, //this.data
    });
  }

  public closeFilterDropdown(dropdown?: string) {
    if (dropdown) {
      (document.querySelector(dropdown) as HTMLElement).style.display = 'none';
    } else {
      (
        document.querySelector('.filter-dropdown-content') as HTMLElement
      ).style.display = 'none';
    }
  }

  public openFilterDropdown(dropdown?: string) {
    if (dropdown) {
      (document.querySelector(dropdown) as HTMLElement).style.display = 'block';
    } else {
      (
        document.querySelector('.filter-dropdown-content') as HTMLElement
      ).style.display = 'block';
    }
  }

  public clickedOnDropdown(dropdown: string) {
    if (dropdown === '.bc-filters') {
      this.isOnBcDropdown = true;
    } else {
      this.isOnOtherDropdown = true;
    }
  }

  @HostListener('document:click')
  clickedOut() {
    /* if (!this.isOnBcDropdown) {
      this.closeFilterDropdown('.bc-filters');
    } */
    if (!this.isOnOtherDropdown) {
      this.closeFilterDropdown('.other-filters');
    }
    this.isOnBcDropdown = false;
    this.isOnOtherDropdown = false;
  }

  public setFilter(filter: string) {
    if (filter !== this.selectedFilter) {
      this.List.splice(0);

      this.closeFilterDropdown();
      this.router.navigate(['/user-dashboard/myitems'], {
        queryParams: {
          user: this.pk,
          blockchain: this.blockchain,
          filter,
        },
      });
      /* .then(() => {
          window.location.reload();
        }); */
    }
  }

  public async setBlockchain(blockchain: string) {
    /* if (blockchain == 'stellar') {
      let details = navigator.userAgent;

      let regexp = /android|iphone|kindle|ipad/i;

      let isMobileDevice = await regexp.test(details);

      if (isMobileDevice) {
        await albedo.publicKey({ require_existing: true }).then((re1s: any) => {
          

          this.List.splice(0);
    
          this.closeFilterDropdown();
          this.router
            .navigate(['/user-dashboard/mynfts'], {
              queryParams: {
                collection: this.collection,
                user: re1s.pubkey,
                blockchain
              },
            })

        });
      } else {
        let freighterWallet = new UserWallet();
        freighterWallet = new FreighterComponent(freighterWallet);
        await freighterWallet.initWallelt();
        let user = await freighterWallet.getWalletaddress();

        this.List.splice(0);
    
      this.closeFilterDropdown();
      this.router
        .navigate(['/user-dashboard/mynfts'], {
          queryParams: {
            collection: this.collection,
            user,
            blockchain
          },
        }).then((res) => {
          window.location.reload();
        });
        
      }
    } else if (blockchain == 'solana') {
     
      let phantomWallet = new UserWallet();
      phantomWallet = new PhantomComponent(phantomWallet);
      await phantomWallet.initWallelt();
      let user = await phantomWallet.getWalletaddress();

      this.List.splice(0);
    
      this.closeFilterDropdown();
      this.router
        .navigate(['/user-dashboard/mynfts'], {
          queryParams: {
            collection: this.collection,
            user,
            blockchain
          },
        }).then((res) => {
          window.location.reload();
        });
     
    } else if (blockchain == 'ethereum' || blockchain == 'polygon') {
      // this.snackBar.openSnackBar("Ethereum and Polygon NFTs coming soon!","info");
      // return
      let metamaskwallet = new UserWallet();
      metamaskwallet = new MetamaskComponent(metamaskwallet);
      await metamaskwallet.initWallelt();
      let user = await metamaskwallet.getWalletaddress();

      this.List.splice(0);
    
      this.closeFilterDropdown();
      this.router
        .navigate(['/user-dashboard/mynfts'], {
          queryParams: {
            collection: this.collection,
            user,
            blockchain
          },
        }).then((res) => {
          window.location.reload();
        });
      
    } else if (blockchain == 'usd') {
      this.List.splice(0);
    
      this.closeFilterDropdown();
      this.router
        .navigate(['/user-dashboard/mynfts'], {
          queryParams: {
            collection: this.collection,
            user: this.pk,
            blockchain
          },
        }).then((res) => {
          window.location.reload();
        });
     
    } */

    this.router
      .navigate(['/user-dashboard/mynfts'], {
        queryParams: {
          collection: this.collection,
          user: this.pk,
          blockchain,
        },
      })
      .then((res) => {
        window.location.reload();
      });
  }
}
