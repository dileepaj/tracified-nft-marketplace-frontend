import { Component, OnInit } from '@angular/core';
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
  List: any[] = [];
  MyList: any[] = [];
  collection: any;
  nfts: any;
  Decryption: any;
  dec: string;
  imageSrc: any;
  data: any;
  key: any;
  loading: boolean = false;
  thumbnailSRC: any;
  pk: any;
  paginationflag: boolean=false;
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
    });
    this.collection = this.data;
    this.key = this.pk;
    this.MyList.splice(0);
    this.List.splice(0);
    this.loading = true;
    this.service
      .getNFTByCollectionName(this.collection)
      .subscribe((res: any) => {
        this.nfts = res.Response;
        if (this.nfts == null) {
          this.ngOnInit();
        } else {
          for (let x = 0; x < this.nfts.length; x++) {
            if (this.nfts[x].creatoruserid == this.key) {
              this.MyList.push(this.nfts[x]);
            }
          }
          this.showNFT(this.MyList);
        }
        this.loading = false;
      });
  }

  public back() {
    this._location.back();
  }

  showNFT(arr: any[]) {
    this.List.splice(0);
    for (let a = 0; a < arr.length; a++) {
      if(this.paginationflag==false){
      this.nft.getSVGByHash(arr[a].imagebase64).subscribe((res: any) => {
        this.Decryption = res.Response.Base64ImageSVG;
        if(arr[a].attachmenttype == "image/jpeg" || arr[a].attachmenttype == "image/jpg" ||arr[a].attachmenttype == "image/png"){
          this.imageSrc =this._sanitizer.bypassSecurityTrustResourceUrl(this.Decryption.toString())
        }else{
          this.dec = btoa(this.Decryption);
      var str2 = this.dec.toString();
      var str1 = new String( "data:image/svg+xml;base64,");
      var src = str1.concat(str2.toString());
      this.imageSrc = this._sanitizer.bypassSecurityTrustResourceUrl(src);
        }
        this.nft.getThumbnailId(arr[a].id).subscribe(async(thumbnail:any)=>{
     
          this.paginationflag=true
              if(thumbnail==""){
                     this.thumbnailSRC=this.imageSrc
                  }else{
                    this.thumbnailSRC = this._sanitizer.bypassSecurityTrustResourceUrl(thumbnail.Response.thumbnail);
                  }
        card.thumbnail=this.thumbnailSRC
        if(card.thumbnail!=""){
          this.paginationflag=false
        }
          })
        let card: MyNFTCard = new MyNFTCard('', '', '', '', '','');
        card.ImageBase64 = this.imageSrc;
       // card.thumbnail=this.thumbnailSRC
        card.NFTIdentifier = arr[a].nftidentifier;
        card.NFTName = arr[a].nftname;
        card.Blockchain = arr[a].blockchain;
        card.SellingStatus = arr[a].sellingstatus;
        this.List.push(card);
      });
    }
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
}
