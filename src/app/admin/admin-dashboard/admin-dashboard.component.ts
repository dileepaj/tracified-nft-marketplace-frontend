import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Route } from '@angular/router';
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  opened: boolean = true;
  //route : ActivatedRoute
  data : any
  constructor(private router: Router,private route : ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.data = JSON.parse(params['data']);
      console.log('data passed :', this.data);})
  }

  public toggleSidenav() {
    this.opened = !this.opened;
  }

  public currentRoute(): string {
    return this.router.url;
  }
  public logout(){
    this.router.navigate(['/login'])
  }
}
 