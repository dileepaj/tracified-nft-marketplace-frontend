import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { UpdateUserFAQResponse } from 'src/app/models/userFAQ';
import { UserFAQService } from 'src/app/services/userFAQService/user-faq.service';
import { SnackbarServiceService } from 'src/app/services/snackbar-service/snackbar-service.service';
import { DialogService } from 'src/app/services/dialog-services/dialog.service';
import { ConfirmDialogText, SnackBarText } from 'src/app/models/confirmDialog';
@Component({
  selector: 'app-add-edit-faqs',
  templateUrl: './add-edit-faqs.component.html',
  styleUrls: ['./add-edit-faqs.component.css']
})
export class AddEditFaqsComponent implements OnInit {
  public controlGroup: FormGroup;
  data: any;
  public questionID: any;
  answer: any;
  imagePath: any;
  imagepresent : boolean=true
  userFAQResponse : UpdateUserFAQResponse = new UpdateUserFAQResponse('','','')
  constructor(
    private route: ActivatedRoute,
    private _sanitizer: DomSanitizer,
    private faqApiService:UserFAQService,
    private router:Router,
    private snackbarService: SnackbarServiceService,
    private previewImage:DialogService,
    private dialogService: DialogService,
    private userFAQAPI:UserFAQService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.data = JSON.parse(params['data']);
      this.questionID =this.data.userquestionID
      this.userFAQAPI.getAttachmentbyqid(this.data.userquestionID).subscribe((res:any)=>{
        if(res.Response!=null || res.Response!="No Image"){
          this.imagepresent= true
          console.log("Image: ",res)
          this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,'+res.Response)
        }
        if(res.Response=="No Image"){
          console.log("helooo")
          this.imagepresent=false
        }
        console.log("bool val :",this.imagepresent)
      })
      
    })
    /**
     * Adds the requeired validator for rating and validation. when the user tries to submit empty data Visual feedback
     * will apear
     */
    this.controlGroup = new FormGroup({
      answer: new FormControl(this.answer, Validators.required),
    });
  }
  updateUserFAQ(){
    this.userFAQResponse.userquestionID = this.questionID
    this.userFAQResponse.status = "Closed"
    this.userFAQResponse.answer = this.formValue("answer")
    console.log("response obtained: ",this.userFAQResponse)
    this.dialogService.confirmDialog({
      title:ConfirmDialogText.ADMIN_FAQ_SUBMISSION_TITLE,
      message:ConfirmDialogText.ADMIN_FAQ_SUBMISSION_Message,
      confirmText:ConfirmDialogText.CONFIRM_BTN,
      cancelText:ConfirmDialogText.CANCEL_BTN
    }).subscribe(res=>{
      if (res){
        this.faqApiService.updateFAQ(this.userFAQResponse).subscribe((res:any)=>{
          if(res!=null){
            this.snackbarService.openSnackBar(SnackBarText.FAQ_SUBMISSION_SUCCESS)
            this.router.navigate(['/admin-dashboard'])
          }
        })
      }
    })
  }

  showimage(){
    this.previewImage.previewImage({
      image:this.imagePath
    })
  }
  private formValue(controlName: string): any {
    return this.controlGroup.get(controlName)!.value;
  }
}
