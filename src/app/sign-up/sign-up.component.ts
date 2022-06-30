import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Endorse } from '../models/endorse';
import { UserWallet } from '../models/userwallet';
import { ApiServicesService } from '../services/api-services/api-services.service';
import { FreighterComponent } from '../wallet/freighter/freighter.component';
import { PhantomComponent } from '../wallet/phantom/phantom.component';
import { MetamaskComponent } from '../wallet/metamask/metamask.component';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  controlGroup: FormGroup;
  addSubscription: Subscription;
  endorse:Endorse=new Endorse('','','','','','','')
  signerPK:string=''
  constructor(private service:ApiServicesService) { }

  async save(): Promise<void> {//getting form data and sending it to the collection service to post
    //getting form data and equalling it to to model variables
    
   this.endorse.Name = this.formValue('Name');
   this.endorse.Email = this.formValue('Email');
   this.endorse.Contact = this.formValue('Contact');
   this.endorse.Description = this.formValue('Description');
   this.endorse.Blockchain= this.formValue('Blockchain');
   this.endorse.Status='Pending'
   if(this.endorse.Blockchain=='stellar'){
    let freighterWallet = new UserWallet();
    freighterWallet = new FreighterComponent(freighterWallet)
    await freighterWallet.initWallelt()
     this.signerPK = await freighterWallet.getWalletaddress()
   this.endorse.PublicKey = this.signerPK
   }

   if(this.endorse.Blockchain=='solana'){
    let phantomWallet = new UserWallet();
    phantomWallet = new PhantomComponent(phantomWallet)
    await phantomWallet.initWallelt()
   this.signerPK = await phantomWallet.getWalletaddress()
   this.endorse.PublicKey = this.signerPK
   }

   if(this.endorse.Blockchain=='ethereum' || this.endorse.Blockchain=='polygon'){
    let metamaskwallet = new UserWallet();
    metamaskwallet = new MetamaskComponent(metamaskwallet)
    await metamaskwallet.initWallelt()
   this.signerPK = await metamaskwallet.getWalletaddress()
   this.endorse.PublicKey = this.signerPK
   }
  
  
   if (this.endorse.PublicKey!=null) {
     //sending data to the service
     this.service.endorse(this.endorse).subscribe();
   } else {
     console.log("User PK not connected or not endorsed");
   }
 }

  ngOnInit(): void {
   //validating form data
   this.controlGroup = new FormGroup({
    userId: new FormControl(this.endorse.PublicKey, Validators.required),
    Name:new FormControl(this.endorse.Name,Validators.required),
    Email:new FormControl(this.endorse.Email,Validators.required),
    Contact:new FormControl(this.endorse.Contact,Validators.required),
    Description:new FormControl(this.endorse.Description,Validators.required),
    Blockchain:new FormControl(this.endorse.Blockchain,Validators.required),

  });
  //calling the save function
  this.save();
}

//initializing input in html to formValue function
private formValue(controlName: string): any {
  return this.controlGroup.get(controlName)!.value;
}


}
