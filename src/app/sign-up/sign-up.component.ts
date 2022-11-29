import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Endorse } from '../models/endorse';
import { UserWallet } from '../models/userwallet';
import { ApiServicesService } from '../services/api-services/api-services.service';
import { FreighterComponent } from '../wallet/freighter/freighter.component';
import { PhantomComponent } from '../wallet/phantom/phantom.component';
import { MetamaskComponent } from '../wallet/metamask/metamask.component';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../services/dialog-services/dialog.service';
import { SnackbarServiceService } from '../services/snackbar-service/snackbar-service.service';
import { ConfirmDialogText, OkDialogText, SnackBarText } from '../models/confirmDialog';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  controlGroup: FormGroup;
  addSubscription: Subscription;
  endorse: Endorse = new Endorse('', '', '', '', '', '', '');
  signerPK: string = '';
  data: any;
  mail: any;
  blockchain: any;
  constructor(
    private service: ApiServicesService,
    private _location: Location,
    private route:ActivatedRoute,
    private dialogService:DialogService,
    private snackbarSrevice:SnackbarServiceService,
  ) {}

  

  async save(): Promise<void> {
    //getting form data and sending it to the collection service to post
    //getting form data and equalling it to to model variables

    this.endorse.Name = this.formValue('Name');
    this.endorse.Email = this.mail;
    this.endorse.Contact = this.formValue('Contact');
    this.endorse.Description = this.formValue('Description');
    this.endorse.Blockchain = this.blockchain;
    this.endorse.Status = 'Pending';

    if (this.endorse.Blockchain == 'stellar') {
      let freighterWallet = new UserWallet();
      freighterWallet = new FreighterComponent(freighterWallet);
      await freighterWallet.initWallelt();
      this.signerPK = await freighterWallet.getWalletaddress();
      this.endorse.PublicKey = this.signerPK;
    }

    if (this.endorse.Blockchain == 'solana') {
      let phantomWallet = new UserWallet();
      phantomWallet = new PhantomComponent(phantomWallet);
      await phantomWallet.initWallelt();
      this.signerPK = await phantomWallet.getWalletaddress();
      this.endorse.PublicKey = this.signerPK;
    }

    if (
      this.endorse.Blockchain == 'ethereum or polygon'
    ) {
      let metamaskwallet = new UserWallet();
      metamaskwallet = new MetamaskComponent(metamaskwallet);
      await metamaskwallet.initWallelt();
      this.signerPK = await metamaskwallet.getWalletaddress();
      this.endorse.PublicKey = this.signerPK;
    }

    if (this.endorse.PublicKey != null) {
      //sending data to the service
      this.dialogService.confirmDialog({
        title : ConfirmDialogText.ENDORSMENT_SIGN_UP_TITLE,
        message : ConfirmDialogText.MINT1_PK_ENDORSMENT_MESSAGE,
        confirmText : ConfirmDialogText.CONFIRM_BTN,
        cancelText : ConfirmDialogText.CANCEL_BTN
      }).subscribe(result=>{
        if(result){
          this.service.endorse(this.endorse).subscribe(res=>{
            if(res!=null || res!=""){
              this.dialogService.okDialog({
                title : OkDialogText.ENDORSMENT_SENT_TITLE,
                message : OkDialogText.ENDORSMENT_SENT_MESSAGE,
                confirmText : OkDialogText.OKAY_BTN
              }).subscribe(res=>{
                 this.back()
              })
            }
          });

        }
      })
      
    } else {
      this.snackbarSrevice.openSnackBar(SnackBarText.ERROR_MESSAGE)
    }
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params)=>{
      this.data=JSON.parse(params['data']);
this.mail=this.data[1]
this.blockchain=this.data[0]
    })
    //validating form data
    this.controlGroup = new FormGroup({
      Name: new FormControl(this.endorse.Name, Validators.required),
      Email: new FormControl(this.endorse.Email, Validators.required),
      Contact: new FormControl(this.endorse.Contact, Validators.required),
      Description: new FormControl(
        this.endorse.Description,
        Validators.required
      ),
    });
    //calling the save function
   // this.save();
  }

  //initializing input in html to formValue function
  private formValue(controlName: string): any {
    return this.controlGroup.get(controlName)!.value;
  }

  public resetValues() {
    this.controlGroup.reset();
  }

  public back() {
    this._location.back();
  }
}
