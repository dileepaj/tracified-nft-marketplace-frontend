import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Mint2, SVG } from 'src/app/models/minting';
import { Location } from '@angular/common';

@Component({
  selector: 'app-mint-nft',
  templateUrl: './mint-nft.component.html',
  styleUrls: ['./mint-nft.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class MintNftComponent implements OnInit {
  public selectedIndex: number = 0;
  public imgSrc: any = '';
  public mint: Mint2;
  public email: string;
  public wallet: string;
  public key: string;
  public blockchain: string;
  public user : string;
  constructor(private _location: Location) {}

  ngOnInit(): void {
    this.mint = {
      NFTName: '',
      NftContentURL: '',
      Description: ' ',
      Collection: '',
      imgObjectID: '',
      svg: new SVG('', '', 'NA','',''),
    };
  }

  public changeTab(event: any, index: number) {
    if (event.email !== '') {
      if (index == 1) {
        this.email = event.email;
        this.wallet = event.wallet;
        this.key = event.key;
      } else if (index == 2) {
        this.blockchain = event.blockchain;
        this.user = event.user;
      }
      this.selectedIndex = index;
    }

    /*   this.imgSrc = event.image;
    this.mint = event.mint; */
  }

  public mintAgain() {
    this.selectedIndex = 0;
    window.location.reload()
  }

  public back() {
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
    } else {
      this._location.back();
    }
  }
}
