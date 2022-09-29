import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NFTStory } from 'src/app/models/nft';
import { ApiServicesService } from 'src/app/services/api-services/api-services.service';
import { DialogService } from 'src/app/services/dialog-services/dialog.service';
import { SnackbarServiceService } from 'src/app/services/snackbar-service/snackbar-service.service';
import {Location} from '@angular/common';
@Component({
  selector: 'app-rich-text-editor',
  templateUrl: './rich-text-editor.component.html',
  styleUrls: ['./rich-text-editor.component.css']
})
export class RichTextEditorComponent implements OnInit {
story:NFTStory=new NFTStory('','','')
  constructor(
    private route:ActivatedRoute,
    private service:ApiServicesService,
    private dialogService: DialogService,
    private snackbarService: SnackbarServiceService,
    private _location: Location) { }
  title = 'Tracified rich text editor';
  public  data :string ="" ;  
  result:any
   save() {
      this.story.NFTIdentifier=this.result[0]
      this.story.Blockchain=this.result[1]
      this.story.NFTStory=btoa(this.data)
      console.log("story data ",this.story)
      this.dialogService.confirmDialog({
        title : "NFT story save confirmation",
        message: "Are you sure you want to add this story to your NFT?",
        confirmText : "Yes",
        cancelText: "No"
        }).subscribe(res=>{
          if(res){
            this.service.addStory(this.story).subscribe(storyres=>{
              if(storyres!= null || storyres>0){
                this.snackbarService.openSnackBar("Successfully addded NFT story to NFT")
                this._location.back();
              }
              else{
                this.snackbarService.openSnackBar("Failed to add NFT story.Please try again")
              }
            })  
          }
        })
         
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.result = JSON.parse(params['data']);
      console.log('data recived 1212:', this.result);})

  }

}
