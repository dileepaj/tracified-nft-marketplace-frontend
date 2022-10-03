import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Endorse } from 'src/app/models/endorse';
import { ApiServicesService } from 'src/app/services/api-services/api-services.service';
import { UserFAQService } from 'src/app/services/userFAQService/user-faq.service';

@Component({
  selector: 'app-browse-marketplace',
  templateUrl: './browse-marketplace.component.html',
  styleUrls: ['./browse-marketplace.component.css'],
})
export class BrowseMarketplaceComponent implements OnInit {
  pendingEndorsments:any[]
  public notifications
  
  // notifications: any[] = [
  //   {
  //     type: 'endorsement',
  //   },
  //   {
  //     type: 'chat',
  //     from: 'John Doe',
  //     topic: 'how does one mint nft with solana?',
  //   },
  //   {
  //     type: 'chat',
  //     from: 'John Doe',
  //     topic: 'how does one mint nft with solana?how does one mint nft with solana?how does one mint nft with solana?how does one mint nft with solana?how does one mint nft with solana?',
  //   },
  // ];
  
  constructor(private router:Router,private service:ApiServicesService,private userFAQAPI:UserFAQService) {}


  public clicked(item: any){
    this.router.navigate(['/admin-dashboard/endorsements'],{
      queryParams:{data: JSON.stringify(item)}
    })
  }
  public sendFAQData(item:any){
    console.log("data to be sent : ",item)
    this.router.navigate(['/admin-dashboard/AnswerUserFAQ'],{
      queryParams:{data:JSON.stringify(item)}
    })
  }
  ngOnInit(): void {
    let status="Pending"
    //function will return all the endorsments in bending status 
    this.service.getEndorsementByStatus(status).subscribe((data:any)=>{
        this.pendingEndorsments=data.Response;
    });

    this.userFAQAPI.getPendingQuestions().subscribe((pendingQuestions:any)=>{
      console.log("Pendong quesitons:",pendingQuestions)
      this.notifications=pendingQuestions.Response;
    })
  }
}
