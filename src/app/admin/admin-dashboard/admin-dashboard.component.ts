import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  opened: boolean = true;
  constructor() {}

  ngOnInit(): void {}

  public toggleSidenav() {
    this.opened = !this.opened;
  }
}
