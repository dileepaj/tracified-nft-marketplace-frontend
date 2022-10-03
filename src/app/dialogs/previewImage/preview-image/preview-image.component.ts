import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PreviewImage } from 'src/app/models/confirmDialog';

@Component({
  selector: 'app-preview-image',
  templateUrl: './preview-image.component.html',
  styleUrls: ['./preview-image.component.css']
})
export class PreviewImageComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data:PreviewImage) { }

  ngOnInit(): void {
  }

}
