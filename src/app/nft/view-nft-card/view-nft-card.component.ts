import { Component, OnInit } from '@angular/core';
import { NftServicesService } from 'src/app/services/api-services/nft-services/nft-services.service';
import { NFTMarket } from 'src/app/models/nft';
import { ActivatedRoute, Router } from '@angular/router';
import CryptoJS from 'crypto-js';
import { DomSanitizer } from '@angular/platform-browser';
import { SVG, Track } from 'src/app/models/minting';
@Component({
  selector: 'app-view-nft-card',
  templateUrl: './view-nft-card.component.html',
  styleUrls: ['./view-nft-card.component.css'],
})
export class ViewNftCardComponent implements OnInit {
  Decryption: any;
  NFTList: any;
  List:any[]=[];
  svg: SVG = new SVG('', '', 'NA');
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
    ''
  );
  imageSrc: any;
  dec: string;
  data: any;
  constructor(
    private service: NftServicesService,
    private router: Router,
    private _sanitizer: DomSanitizer,
    private route:ActivatedRoute
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
    
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params)=>{
      this.data=JSON.parse(params['data']);
      console.log("DATA recived: ",this.data)})
    this.nft.InitialDistributorPK =this.data;
    if (this.nft.InitialDistributorPK != null) {
      this.service
        .getLastNFTDetails(this.nft.InitialDistributorPK)
        .subscribe((data: any) => {
          console.log("data: ",data)
          this.NFTList = data;
          if (this.NFTList == null) {
            console.log('retrying...');
            this.ngOnInit();
          }
          this.svg.Hash = this.NFTList.ImageBase64;
          console.log('svg : ', this.svg.Hash);
          this.service.getSVGByHash(this.svg.Hash).subscribe((res: any) => {
            console.log('service res:', res);
            this.Decryption = res.Response.Base64ImageSVG;
            console.log('decrypted sg:', this.Decryption);
            this.dec = btoa(this.Decryption);
            console.log('dec : ', this.dec);
            var str2 = this.dec.toString();
            var str1 = new String('data:image/svg+xml;base64,');
            var src = str1.concat(str2.toString());
            this.imageSrc = this._sanitizer.bypassSecurityTrustResourceUrl(src);
            this.service.getTXNByBlockchainandIdentifier(this.NFTList.Identifier,this.NFTList.NftIssuingBlockchain).subscribe((txn:any)=>{
              console.log("TXNS :",txn)
              for( let x=0; x<(txn.Response.length); x++){
                let card:Track= new Track('','','');
                card.NFTName=txn.Response[x].NFTName
                card.Status=txn.Response[x].Status
                card.NFTTxnHash=txn.Response[x].NFTTxnHash
                this.List.push(card)
              }
            })
          });

          // if (this.NFTList.NftIssuingBlockchain == 'stellar') {
          //   this.NFTList.NFTIssuerPK = this.NFTList.NFTIssuerPK;
          // }
          // if (this.NFTList.Blockchain == 'solana') {
          //   this.NFTList.NFTIssuerPK = this.NFTList.;
          // }
          // if (this.NFTList.Blockchain == 'polygon') {
          //   this.NFTList.NFTIssuerPK = this.NFTList.MintedContract;
          // }
          // if (this.NFTList.Blockchain == 'ethereum') {
          //   this.NFTList.NFTIssuerPK = this.NFTList.MintedContract;
          // }
        });
    } else {
      console.log('User PK not connected or not endorsed');
    }
  }

  public goToExplore() {
    this.router.navigate(['/explore'], {
      queryParams: { blockchain: 'ethereum', filter: 'uptodate' },
    });
  }
}
