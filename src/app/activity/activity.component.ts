import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Track } from '../models/minting';
import { NftServicesService } from '../services/api-services/nft-services/nft-services.service';
@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit {
a:any=0;
b:any=0;
c:any=1;
  data: any;
  constructor(private service:NftServicesService, private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.data = JSON.parse(params['data']);
    this.service.getTXNByBlockchainandIdentifier(this.data.nftidentifier,this.data.blockchain).subscribe((txn:any)=>{
      for( let x=0; x<(txn.Response.length); x++){
        if(txn.Response[x].Status=="ON SALE"){
          (this.a)++
        }else{
          if(txn.Response[x].Status=="NOTFORSALE"){
            (this.b)++
          }
        }
      
      
      
       
      }
    })
  });
 
}
}