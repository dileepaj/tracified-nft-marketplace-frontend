import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PreviewImage } from 'src/app/models/confirmDialog';

@Component({
  selector: 'app-nft-preview',
  templateUrl: './nft-preview.component.html',
  styleUrls: ['./nft-preview.component.css']
})
export class NftPreviewComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data:PreviewImage) { }

  ngOnInit(): void {
  }

}
