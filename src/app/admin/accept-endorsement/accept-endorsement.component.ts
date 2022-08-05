import { Component, OnInit } from '@angular/core';
import { ApiServicesService } from 'src/app/services/api-services/api-services.service';
import { UpdateStatus } from 'src/app/models/endorse';
import { Endorse } from 'src/app/models/endorse';

@Component({
  selector: 'app-accept-endorsement',
  templateUrl: './accept-endorsement.component.html',
  styleUrls: ['./accept-endorsement.component.css']
})
export class AcceptEndorsementComponent implements OnInit {
  CollectionList:any;
  status:string;
  update:UpdateStatus
  endorse:Endorse
  constructor(private service:ApiServicesService) { }

  // Update(){
  //   this.update.PublicKey=this.endorse.PublicKey
  //   this.update.Status="Confirmed"
  //   this.service.updateEndorsementStatus(this.update).subscribe()
  // }

  ngOnInit(): void {
    this.endorse.Status='Pending'
      this.service.getEndorsementByStatus(this.endorse.Status).subscribe((data:any)=>{
          this.CollectionList=data;
        });
    
  }

}
