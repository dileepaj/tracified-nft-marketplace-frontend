import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Route } from '@angular/router';
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  opened: boolean = true;
  smallScreen : boolean = false;
  //route : ActivatedRoute
  data : any
  constructor(private router: Router,private route : ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.data = JSON.parse(params['data']);
     })
     if (window.innerWidth < 1280) {
        this.opened = false;
        this.smallScreen = true;
      } else {
        this.opened = true;
        this.smallScreen = false;
      }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (window.innerWidth < 1280) {
      this.opened = false;
      this.smallScreen = true;
    } else {
      this.opened = true;
      this.smallScreen = false;
    }
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

  public closeSideNav() {
    if(this.smallScreen) {
      this.opened = false;
    }
  }
}
