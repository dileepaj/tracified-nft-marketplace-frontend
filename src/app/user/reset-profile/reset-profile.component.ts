import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Endorse, UpdateEndorse } from 'src/app/models/endorse';
import { UserWallet } from 'src/app/models/userwallet';
import { ApiServicesService } from 'src/app/services/api-services/api-services.service';
import { FreighterComponent } from 'src/app/wallet/freighter/freighter.component';
import { MetamaskComponent } from 'src/app/wallet/metamask/metamask.component';
import { PhantomComponent } from 'src/app/wallet/phantom/phantom.component';

@Component({
  selector: 'app-reset-profile',
  templateUrl: './reset-profile.component.html',
  styleUrls: ['./reset-profile.component.css']
})
export class ResetProfileComponent implements OnInit {
  profileList:any;
  controlGroup: FormGroup;
  addSubscription: Subscription;
  endorse:UpdateEndorse=new UpdateEndorse('','','','','','')
  signerPK:string=''
  constructor(private service:ApiServicesService) { }

  async update(): Promise<void> {//getting form data and sending it to the collection service to post
    //getting form data and equalling it to to model variables
    
   this.endorse.Name = this.formValue('Name');
   this.endorse.Email = this.formValue('Email');
   this.endorse.Contact = this.formValue('Contact');
   this.endorse.Description = this.formValue('Description');
  if(this.endorse!= null){
    this.service.updateEndorsement(this.endorse).subscribe()
  }
 }

  async ngOnInit(): Promise<void> {
   //validating form data
   this.controlGroup = new FormGroup({
    userId: new FormControl(this.endorse.PublicKey, Validators.required),
    Name:new FormControl(this.endorse.Name,Validators.required),
    Email:new FormControl(this.endorse.Email,Validators.required),
    Contact:new FormControl(this.endorse.Contact,Validators.required),
    Description:new FormControl(this.endorse.Description,Validators.required),
    Blockchain:new FormControl(this.endorse.Blockchain,Validators.required),

  });

  this.endorse.Blockchain= this.formValue('Blockchain');
  if(this.endorse.Blockchain=='stellar'){
   let freighterWallet = new UserWallet();
   freighterWallet = new FreighterComponent(freighterWallet)
   await freighterWallet.initWallelt()
    this.signerPK = await freighterWallet.getWalletaddress()
  this.endorse.PublicKey = this.signerPK
  this.service.getEndorsement(this.endorse.PublicKey).subscribe(result=>{
    this.profileList=result
  })
  }

  if(this.endorse.Blockchain=='solana'){
   let phantomWallet = new UserWallet();
   phantomWallet = new PhantomComponent(phantomWallet)
   await phantomWallet.initWallelt()
  this.signerPK = await phantomWallet.getWalletaddress()
  this.endorse.PublicKey = this.signerPK
  this.service.getEndorsement(this.endorse.PublicKey).subscribe(result=>{
    this.profileList=result
  })
  }

  if(this.endorse.Blockchain=='ethereum' || this.endorse.Blockchain=='polygon'){
   let metamaskwallet = new UserWallet();
   metamaskwallet = new MetamaskComponent(metamaskwallet)
   await metamaskwallet.initWallelt()
  this.signerPK = await metamaskwallet.getWalletaddress()
  this.endorse.PublicKey = this.signerPK
  this.service.getEndorsement(this.endorse.PublicKey).subscribe(result=>{
  this.profileList=result
  })
  }
 
 
}

//initializing input in html to formValue function
private formValue(controlName: string): any {
  return this.controlGroup.get(controlName)!.value;
}



}
