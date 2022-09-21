import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-help-center',
  templateUrl: './help-center.component.html',
  styleUrls: ['./help-center.component.css'],
})
export class HelpCenterComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  public navigate(location: string) {
    this.router.navigate([location]);
  }
}
