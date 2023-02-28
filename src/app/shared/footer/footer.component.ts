import { Component, OnInit } from '@angular/core';
import { ApiServicesService } from 'src/app/services/api-services/api-services.service';
import { Subscription } from 'src/app/models/mail';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackbarServiceService } from 'src/app/services/snackbar-service/snackbar-service.service';
import { Router } from '@angular/router';
import { APIConfigENV } from 'src/environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  subscribe: Subscription = new Subscription('');
  controlGroup: FormGroup;
  private readonly marketplaceBaseURL = APIConfigENV.marketplaceBaseURL
  private readonly mkURL:string=this.marketplaceBaseURL
  private readonly tracifiedhelp = APIConfigENV.tracifiedhelpDocsbaseURL
   readonly mkHome:string=`${this.mkURL}home`
   readonly mkETHURL:string=`${this.mkURL}explore?blockchain=ethereum&filter=all`
   readonly mkPolygon:string=`${this.mkURL}explore?blockchain=polygon&filter=all`
   readonly mkStellar:string=`${this.mkURL}explore?blockchain=stellar&filter=all`
   readonly mkSolana:string=`${this.mkURL}explore?blockchain=solana&filter=all`
   readonly mkBlog:string=`${this.mkURL}nft-story`
   readonly mkFaq:string=`${this.mkURL}faq`
   readonly mkHelpCenter:string=`${this.mkURL}help-center`
   readonly helpDocsMK:string=`${this.tracifiedhelp}docs/NFTPlatofrm/marketplace/introtoMarketplace`
   readonly mkContact_us:string=`${this.mkURL}contact-us`
   readonly mkDocs:string=`${this.mkURL}docs`
  constructor(
    private service:ApiServicesService,
    private snackbarService:SnackbarServiceService,
    private router : Router
  ) {

  }

  ngOnInit(): void {
    this.controlGroup = new FormGroup({
      //validation
      Mail: new FormControl(this.subscribe.mail, Validators.required)})
  }

  private formValue(controlName: string): any {
    return this.controlGroup.get(controlName)!.value;
  }

  subscribeNow(){
    this.subscribe.mail = this.formValue('Mail');
    this.service.checkifSubscribed(this.subscribe.mail).subscribe((subresponse:any)=>{
        if(subresponse =="not subscribed"){
          this.service.addSubscription(this.subscribe).subscribe(res=>{
          this.snackbarService.openSnackBar("Request to subscribe sent")
          })
        }else if(subresponse == "subscribed"){
          this.snackbarService.openSnackBar("This email is subscribed to the newsletter")
        }
    })
  }

  public isHome() : boolean {
    if(this.router.url === '/') {
      return true;
    }
    else {
      return false;
    }
  }
}
