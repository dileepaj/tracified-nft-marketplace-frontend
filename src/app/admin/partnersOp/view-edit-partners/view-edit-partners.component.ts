import { Component, OnInit } from '@angular/core';
import { UpdatePartners } from 'src/app/models/admin';
import { ApiServicesService } from 'src/app/services/api-services/api-services.service';
@Component({
  selector: 'app-view-edit-partners',
  templateUrl: './view-edit-partners.component.html',
  styleUrls: ['./view-edit-partners.component.css']
})
export class ViewEditPartnersComponent implements OnInit {
partnerList:any
partners:UpdatePartners
  constructor(private service:ApiServicesService) { }

  update(){
    
  }

  ngOnInit(): void {
    this.service.getPartners().subscribe(res=>{
    res=this.partnerList
    })
  }


}
