import { Component, OnInit } from '@angular/core';

export interface Collection {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-mint',
  templateUrl: './mint.component.html',
  styleUrls: ['./mint.component.css']
})
export class MintComponent implements OnInit {

  collection: Collection[] = [
    { value: 'Animals', viewValue: 'Animals' },
    { value: 'Gucci', viewValue: 'Gucci' },
    { value: 'Ruri', viewValue: 'Ruri' },
    { value: 'Kantela', viewValue: 'Kantela' },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
