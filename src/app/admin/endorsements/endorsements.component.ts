import { Float } from '@solana/buffer-layout';

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExecFileSyncOptionsWithStringEncoding } from 'child_process';
import { Subscription } from 'rxjs';
import { UpdateStatus } from 'src/app/models/endorse';
import { ApiServicesService } from 'src/app/services/api-services/api-services.service';

@Component({
  selector: 'app-endorsements',
  templateUrl: './endorsements.component.html',
  styleUrls: ['./endorsements.component.css'],
})
export class EndorsementsComponent implements OnInit {
  controlGroup: FormGroup;
  addSubscription: Subscription;
  rating: string;
  description: string;
  review : string
  data: any;
  public PKval : any
  constructor(private route: ActivatedRoute,private service:ApiServicesService,private router:Router) {
    }

  //Fuction will retreive data from the .html file and initiate the service call to save a user reivew
  save(): void {
    alert(
      `${this.formValue('rating')} stars, "${this.formValue('description')}"`
    );
  }
  details= new FormGroup({

  })

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.data = JSON.parse(params['data']);
      console.log('data recvide :', this.data);
      console.log("pk : "+this.data.PublicKey)
      this.PKval =this.data.PublicKey
    })
    /**
     * Adds the requeired validator for rating and validation. when the user tries to submit empty data Visual feedback
     * will apear
     */
    this.controlGroup = new FormGroup({
      rating: new FormControl(this.rating, Validators.required),
      description: new FormControl(this.description, Validators.required),
    });
  }

  public acceptEndorsment(){
    this.rating=this.formValue('rating')
    this.description=this.formValue('description')
    console.log("review and rating: ",this.review,this.rating)
    var updateEndorstment =new UpdateStatus("Accepted",this.data.PublicKey,this.description,this.rating);
    console.log("dat a sent: ",updateEndorstment)
    this.service.updateEndorsementStatus(updateEndorstment).subscribe((result:any)=>{
      console.log("accepted result:",result)
      if(result!=""){
        this.router.navigate(['/admin-dashboard'])
      }
    })
  }

  public declineEndorsment(){
    this.rating=this.formValue('rating')
    this.description=this.formValue('description')
    console.log("review and rating: ",this.review,this.rating)
    var updateEndorstment = new UpdateStatus("Declined",this.data.PublicKey,this.description,this.rating)
    console.log("dat a sent: ",updateEndorstment)
    this.service.updateEndorsementStatus(updateEndorstment).subscribe((result:any)=>{
      if(result!=""){
        this.router.navigate(['/admin-dashboard'])
      }
      
    })
  }
  private formValue(controlName: string): any {
    return this.controlGroup.get(controlName)!.value;
  }
}
