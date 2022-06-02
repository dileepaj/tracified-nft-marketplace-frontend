import { Observable } from 'rxjs';
import { GetNFT } from './../../models/nft';
import { MatrixViewService } from './../../services/matrix-view/matrix-view.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})
export class ExploreComponent implements OnInit {

  constructor(
    private service:MatrixViewService
    
  ) { }
  onSaleNftData;
  identifier = "A101"
  async ngOnInit(): Promise<void> {
      console.log("start retreival")
      await this.service.getNFTOnSale(this.identifier).subscribe((data:any)=>{
        this.onSaleNftData=data
        console.log("data retreived :",data.Response[0].collection)
        console.log("data: ",this.onSaleNftData)
      })
      
  }

}
