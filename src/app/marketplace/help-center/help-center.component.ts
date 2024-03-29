import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-help-center',
  templateUrl: './help-center.component.html',
  styleUrls: ['./help-center.component.css'],
})
export class HelpCenterComponent implements OnInit {
  constructor(private router: Router, private _location: Location) {}

  ngOnInit(): void {}

  public navigate(location: string) {
    this.router.navigate([location]);
  }

  public back() {
    this.router.navigate(['/']);
  }
}
