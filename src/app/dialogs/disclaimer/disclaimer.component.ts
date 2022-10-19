import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-disclaimer',
  templateUrl: './disclaimer.component.html',
  styleUrls: ['./disclaimer.component.css']
})
export class DisclaimerComponent implements OnInit {
  public acceptEnabled : boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  public onCheckedChange(e:any) {
    this.acceptEnabled = e.target.checked;
  }
}
