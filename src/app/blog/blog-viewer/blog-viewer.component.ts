import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiServicesService } from 'src/app/services/api-services/api-services.service';

@Component({
  selector: 'app-blog-viewer',
  templateUrl: './blog-viewer.component.html',
  styleUrls: ['./blog-viewer.component.css']
})
export class BlogViewerComponent implements OnInit {
  data: any;
  story: any;

  constructor(private route:ActivatedRoute,
    private service:ApiServicesService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.data = JSON.parse(params['data']);
      console.log('data passed :', this.data);
      this.service.getAllStoryByNFTIdAndBlockchain(this.data.nftidentifier,this.data.blockchain).subscribe((res1:any)=>{
        console.log("story retrieved ",res1)
        console.log("story retrieved ",res1.Response[0].NFTStory)
        
        this.story=res1.Response[0].NFTStory
      })
  })

}
}