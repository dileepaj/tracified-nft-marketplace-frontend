import { Component, OnInit } from '@angular/core';
import { ApiServicesService } from 'src/app/services/api-services/api-services.service';

@Component({
  selector: 'app-view-partners',
  templateUrl: './view-partners.component.html',
  styleUrls: ['./view-partners.component.css']
})
export class ViewPartnersComponent implements OnInit {
partnerList:any

  constructor(private service:ApiServicesService) { }

  ngOnInit(): void {
    this.service.getPartners().subscribe(res=>{
    res=this.partnerList
    })
  }

}
