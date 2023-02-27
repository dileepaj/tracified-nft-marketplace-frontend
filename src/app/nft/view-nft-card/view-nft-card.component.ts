import { Component, OnInit } from '@angular/core';
import { NftServicesService } from 'src/app/services/api-services/nft-services/nft-services.service';
import { NFTMarket } from 'src/app/models/nft';
import { ActivatedRoute, Router } from '@angular/router';
import CryptoJS from 'crypto-js';
import { DomSanitizer } from '@angular/platform-browser';
import { SVG, Track } from 'src/app/models/minting';
import { SnackbarServiceService } from 'src/app/services/snackbar-service/snackbar-service.service';
@Component({
  selector: 'app-view-nft-card',
  templateUrl: './view-nft-card.component.html',
  styleUrls: ['./view-nft-card.component.css'],
})
export class ViewNftCardComponent implements OnInit {
  Decryption: any;
  NFTList: any;
  List:any[]=[];
  svg: SVG = new SVG('', '', 'NA','','');
  nft: NFTMarket = new NFTMarket(
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    ''
  );
  imageSrc: any;
  dec: string;
  data: any;
  constructor(
    private service: NftServicesService,
    private router: Router,
    private _sanitizer: DomSanitizer,
    private route:ActivatedRoute,
    private snackbar: SnackbarServiceService,
  ) {}


  createStory(){
    let data:any[]=[this.NFTList.Identifier,this.NFTList.NftIssuingBlockchain]
    this.router.navigate(['./createblog'], {
      queryParams: { data: JSON.stringify(data) },
    });
  }

  sendToSellNFT(): void {
    let data: any = this.NFTList;
    this.router.navigate(['./sell'], {
      queryParams: { data: JSON.stringify(data) },
    });
  }

  showInProfile(){
    let data: any = this.NFTList.NftIssuingBlockchain;
    this.router.navigate(['/user-dashboard'], {
      queryParams: { blockchain: this.NFTList.NftIssuingBlockchain },
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params)=>{
      this.data=JSON.parse(params['data']);})
    this.nft.InitialDistributorPK =this.data;
    if (this.nft.InitialDistributorPK != null) {
      this.service
        .getLastNFTDetails(this.nft.InitialDistributorPK)
        .subscribe((data: any) => {
          this.NFTList = data;
          if (this.NFTList == null) {
            this.ngOnInit();
          }
          this.svg.Hash = this.NFTList.ImageBase64;
          this.service.getSVGByHash(this.svg.Hash).subscribe((res: any) => {
            this.Decryption = res.Response.Base64ImageSVG;
            if(this.NFTList.attachmenttype == "image/jpeg" || this.NFTList.attachmenttype == "image/jpg" ||this.NFTList.attachmenttype == "image/png"){
              this.imageSrc =this._sanitizer.bypassSecurityTrustResourceUrl(this.Decryption.toString())
            }else{
              this.dec = btoa(this.Decryption);
          var str2 = this.dec.toString();
          var str1 = new String( "data:image/svg+xml;base64,");
          var src = str1.concat(str2.toString());
          this.imageSrc = this._sanitizer.bypassSecurityTrustResourceUrl(src);
            }
            this.service.getTXNByBlockchainandIdentifier(this.NFTList.Identifier,this.NFTList.NftIssuingBlockchain).subscribe((txn:any)=>{
              for( let x=0; x<(txn.Response.length); x++){
                let card:Track= new Track('','','');
                card.NFTName=txn.Response[x].NFTName
                card.Status=txn.Response[x].Status
                card.NFTTxnHash=txn.Response[x].NFTTxnHash
                this.List.push(card)
              }
            })
          });
        });
    } else {
      this.snackbar.openSnackBar(
        'User PK not connected or not endorsed',
        'info'
      );
    }
  }

  public goToExplore() {
    this.router.navigate(['/explore'], {
      queryParams: { blockchain: 'ethereum', filter: 'uptodate' },
    });
  }
}
