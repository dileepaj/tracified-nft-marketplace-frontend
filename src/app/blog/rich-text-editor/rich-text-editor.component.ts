import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NFTStory } from 'src/app/models/nft';
import { ApiServicesService } from 'src/app/services/api-services/api-services.service';
@Component({
  selector: 'app-rich-text-editor',
  templateUrl: './rich-text-editor.component.html',
  styleUrls: ['./rich-text-editor.component.css']
})
export class RichTextEditorComponent implements OnInit {
story:NFTStory=new NFTStory('','','')
  constructor(private route:ActivatedRoute, private service:ApiServicesService) { }
  title = 'Tracified rich text editor';
  public  data :string ="" ;  
  result:any
   save() {
      this.story.NFTIdentifier=this.result[0]
      this.story.Blockchain=this.result[1]
      this.story.NFTStory=btoa(this.data)
      console.log("story data ",this.story)
      this.service.addStory(this.story).subscribe(res=>{
        console.log("story is added ",res)
        this.service.getAllStoryByNFTIdAndBlockchain(this.story.NFTIdentifier,this.story.Blockchain).subscribe(res1=>{
          console.log("story retrieved ",res1)
        })
      })     
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.result = JSON.parse(params['data']);
      console.log('data recived 1212:', this.result);})

  }

}
