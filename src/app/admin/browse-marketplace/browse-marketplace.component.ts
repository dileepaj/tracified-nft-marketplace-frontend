import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { interval, timer } from 'rxjs';
import { Endorse } from 'src/app/models/endorse';
import { ApiServicesService } from 'src/app/services/api-services/api-services.service';
import { DialogService } from 'src/app/services/dialog-services/dialog.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { UserFAQService } from 'src/app/services/userFAQService/user-faq.service';
import { APIConfigENV } from 'src/environments/environment';

@Component({
  selector: 'app-browse-marketplace',
  templateUrl: './browse-marketplace.component.html',
  styleUrls: ['./browse-marketplace.component.css'],
})
export class BrowseMarketplaceComponent implements OnInit {
  tabIndex : number = 0;
  pendingEndorsments:any[];
  public showEndorsementLoader : boolean = false;
  public showFaqLoader : boolean = false;
  public notifications

  constructor(private router:Router,private service:ApiServicesService,private userFAQAPI:UserFAQService,public loaderService: LoaderService,private dialogService: DialogService) {}


  public clicked(item: any){
    this.router.navigate(['/admin-dashboard/endorsements'],{
      queryParams:{data: JSON.stringify(item)}
    })
  }
  public sendFAQData(item:any){
    this.router.navigate(['/admin-dashboard/AnswerUserFAQ'],{
      queryParams:{data:JSON.stringify(item)}
    })
  }
  ngOnInit(): void {
    this.showEndorsementLoader = true;
    this.showFaqLoader = true;
    this.loaderService.isLoading.next(false)
    let status="Pending"

    const timer$ = timer(0,APIConfigENV.APIIntervalTimer);
    timer$.subscribe((data)=>{
       this.loaderService.isLoading.next(false)
        this.service.getEndorsementByStatus(status).subscribe((data:any)=>{
          this.pendingEndorsments=data.Response;
        });
        this.loaderService.isLoading.next(false)
        this.showEndorsementLoader = false;

        this.userFAQAPI.getPendingQuestions().subscribe((pendingQuestions:any)=>{
          this.showFaqLoader = false;
          this.notifications=pendingQuestions.Response;
        })
    })

  }

  public changeTab(index : number) {
    this.tabIndex = index;
  }
}
