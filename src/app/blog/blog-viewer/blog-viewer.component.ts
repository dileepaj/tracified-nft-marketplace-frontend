import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
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
  nftstory: any;

  constructor(private route:ActivatedRoute,
    private service:ApiServicesService,
    private domSanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.data = JSON.parse(params['data']);
      console.log('data passed :', this.data);
      this.service.getAllStoryByNFTIdAndBlockchain('7kKKNXTut4jtZBDZNMSMAfY42r2CJum5RBXpwAvpYAD3','solana').subscribe((res1:any)=>{//this.data.nftidentifier,this.data.blockchain
        console.log("story retrieved ",res1)
        console.log("story retrieved ",res1.Response[0].NFTStory)
        
        this.story=res1.Response[0].NFTStory
        this.nftstory=this.domSanitizer.bypassSecurityTrustHtml(this.story)
      })
  })

}
}