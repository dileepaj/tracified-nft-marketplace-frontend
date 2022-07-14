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
  constructor(private _location: Location) {}

  ngOnInit(): void {
    this.mint = {
      NFTName: '',
      NftContentURL: '',
      Description: ' ',
      Collection: '',
      imgObjectID: '',
      svg: new SVG('', '', 'NA'),
    };
  }

  public changeTab(event: any, index: number) {
    this.selectedIndex = index;
    this.imgSrc = event.image;
    this.mint = event.mint;
  }

  public back() {
    this._location.back();
  }
}
