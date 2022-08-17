import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { SVG, Track } from '../models/minting';
import { NFTMarket } from '../models/nft';
import { NftServicesService } from '../services/api-services/nft-services/nft-services.service';

@Component({
  selector: 'app-show-nft',
  templateUrl: './show-nft.component.html',
  styleUrls: ['./show-nft.component.css']
})
export class ShowNFTComponent implements OnInit {
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


  showInProfile(){
    
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params)=>{
      this.data=JSON.parse(params['data']);
      console.log("DATA recived: ",this.data)})

    if (this.data != null) {
      this.service
      // 2:nft identifer , 3:blockchain, 0:selling status , 1:svg
        .getNFTDetails(this.data[2],this.data[0],this.data[3])
        .subscribe((data: any) => {
          console.log("data: ",data)
          this.NFTList = data.Response[0];
          if (this.NFTList == null) {
            console.log('retrying...');
            this.ngOnInit();
          }
            this.service.getSVGByHash(this.NFTList.imagebase64).subscribe((res: any) => {
              console.log('service res:', res);
              this.Decryption = res.Response.Base64ImageSVG;
              console.log('decrypted sg:', this.Decryption);
              this.dec = btoa(this.Decryption);
              console.log('dec : ', this.dec);
              var str2 = this.dec.toString();
              var str1 = new String('data:image/svg+xml;base64,');
              var src = str1.concat(str2.toString());
              this.imageSrc = this._sanitizer.bypassSecurityTrustResourceUrl(src);
            });
            console.log("image src : ",this.imageSrc)
            this.service.getTXNByBlockchainandIdentifier(this.NFTList.nftidentifier,this.NFTList.blockchain).subscribe((txn:any)=>{
              console.log("TXNS :",txn)
              for( let x=0; x<(txn.Response.length); x++){
                let card:Track= new Track('','','');
                card.NFTName=txn.Response[x].NFTName
                card.Status=txn.Response[x].Status
                card.NFTTxnHash=txn.Response[x].NFTTxnHash
                this.List.push(card)
              }
            })
          
            //put correct bc name var
          if (this.NFTList.NftIssuingBlockchain == 'stellar') {
            this.NFTList.NFTIssuerPK = this.NFTList.NFTIssuerPK;
          }
          if (this.NFTList.Blockchain == 'solana') {
            this.NFTList.NFTIssuerPK = this.NFTList.MinterPK;
          }
          if (this.NFTList.Blockchain == 'polygon') {
            this.NFTList.NFTIssuerPK = this.NFTList.MintedContract;
          }
          if (this.NFTList.Blockchain == 'ethereum') {
            this.NFTList.NFTIssuerPK = this.NFTList.MintedContract;
          }
        });
    } else {
      console.log('User PK not connected or not endorsed');
    }
  }

  createStory(){
    let data:any[]=[this.NFTList.Identifier,this.NFTList.NftIssuingBlockchain]
    this.router.navigate(['./createblog'], {
      queryParams: { data: JSON.stringify(data) },
    });
  }

  sendToSellNFT(): void {
    let data: any = this.NFTList;
    this.router.navigate(['./nftresale'], {
      queryParams: { data: JSON.stringify(data) },
    });
  }

  public goToExplore() {
    this.router.navigate(['/explore'], {
      queryParams: { blockchain: 'ethereum', filter: 'uptodate' },
    });
  }
}
