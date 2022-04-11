import { NewsletterService } from './../../../services/newsletterService/newsletter.service';
import { Validators } from '@angular/forms';
import { NewsLetter } from './../../../../models/newsletterModel';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-newsletter',
  templateUrl: './add-newsletter.component.html',
  styleUrls: ['./add-newsletter.component.css']
})
export class AddNewsletterComponent implements OnInit {
  controlGroup:FormGroup;
  value="";
  addnewsLetter : Subscription;
  constructor(public service : NewsletterService) { 

  }
  //creating an object form the newsletter class
  newsletter : NewsLetter = new NewsLetter("","","","","","");

  //applied the required validator to all inputs in the html page
  ngOnInit(): void {
    this.controlGroup = new FormGroup({
      topic : new FormControl(this.newsletter.topic,Validators.required),
      author : new FormControl(this.newsletter.author,Validators.required),
      date : new FormControl(this.newsletter.date,Validators.required),
      publisher : new FormControl(this.newsletter.publisher,Validators.required),
      weblink : new FormControl(this.newsletter.weblink,Validators.required),
      description : new FormControl(this.newsletter.description,Validators.required)
    });
  }

 /**
  * save() function will retrieve the data from the input feilds in the html page and add it to the newletter class 
  */
  save(){
    this.newsletter.topic=this.formValue('topic');
    this.newsletter.author=this.formValue('author');
    this.newsletter.date=this.formValue('date');
    this.newsletter.publisher=this.formValue('publisher');
    this.newsletter.weblink=this.formValue('weblink');
    this.newsletter.description=this.formValue('description');
    // If condition does a prescesnse check on each of the input feilds to check if there are any epmty entries and will show an alert
    // message to the user informing them to fill all the feilds
    if(
      this.newsletter.topic=="" ||
      this.newsletter.author==""||
      this.newsletter.date==""||
      this.newsletter.publisher==""||
      this.newsletter.weblink==""||
      this.newsletter.description==""
    ){
      alert("please data in all feilds!")
    }
    else{
      //If there is no empty feilds the service call will be made
      this.addnewsLetter=this.service.add(this.newsletter).subscribe()
      alert("news paper has been published!")
    }
  }
  imageSelection(fileInputEvent: any) {
    console.log(fileInputEvent.target.files[0]);
  }
  private formValue(controlName: string): any {
    return this.controlGroup.get(controlName)!.value;
  }

}
