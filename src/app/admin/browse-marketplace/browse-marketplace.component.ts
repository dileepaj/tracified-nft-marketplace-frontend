import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Endorse } from 'src/app/models/endorse';
import { ApiServicesService } from 'src/app/services/api-services/api-services.service';

@Component({
  selector: 'app-browse-marketplace',
  templateUrl: './browse-marketplace.component.html',
  styleUrls: ['./browse-marketplace.component.css'],
})
export class BrowseMarketplaceComponent implements OnInit {
  pendingEndorsments:any[]
  

  notifications: any[] = [
    {
      type: 'endorsement',
    },
    {
      type: 'chat',
      from: 'John Doe',
      topic: 'how does one mint nft with solana?',
    },
  ];
  
  constructor(private router:Router,private service:ApiServicesService) {}

  public clicked(item: any){
    this.router.navigate(['/admin-dashboard/endorsements'],{
      queryParams:{data: JSON.stringify(item)}
    })
  }

  ngOnInit(): void {
    let status="Pending"
    this.service.getEndorsementByStatus(status).subscribe((data:any)=>{
        this.pendingEndorsments=data.Response;
    });
  }
}
