import { Component, OnInit } from '@angular/core';
import { ApiServicesService } from 'src/app/services/api-services/api-services.service';
import { Subscription } from 'src/app/models/mail';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackbarServiceService } from 'src/app/services/snackbar-service/snackbar-service.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  subscribe: Subscription = new Subscription('');
  controlGroup: FormGroup;

  constructor(private service:ApiServicesService, private snackbarService:SnackbarServiceService) { }

  ngOnInit(): void {
    this.controlGroup = new FormGroup({
      //validation
      Mail: new FormControl(this.subscribe.mail, Validators.required)})
  }

  private formValue(controlName: string): any {
    return this.controlGroup.get(controlName)!.value;
  }

  subscribeNow(){
    this.subscribe.mail = this.formValue('Tag');
    console.log("tags :",this.subscribe.mail)
this.service.addSubscription(this.subscribe).subscribe(res=>{
  this.snackbarService.openSnackBar("Request to subscribe sent")
})
  }
}
