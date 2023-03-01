import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {

  constructor(private router: Router, private _location: Location) { }

  ngOnInit(): void {
  }

  public goBack() {
    this._location.back();
  }

  public docs() {
    this.router.navigate(['/docs']);
  }

  public tracified() {
    window.open('https://tracified.com/', '_blank');
  }

}
