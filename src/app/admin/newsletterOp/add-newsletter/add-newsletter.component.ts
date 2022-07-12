import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NewsLetter } from 'src/app/models/newsLetter';

@Component({
  selector: 'app-add-newsletter',
  templateUrl: './add-newsletter.component.html',
  styleUrls: ['./add-newsletter.component.css'],
})
export class AddNewsletterComponent implements OnInit {
  @ViewChild('fileUpload') fileUpload: ElementRef<HTMLElement>;
  controlGroup: FormGroup;
  newsLetter: NewsLetter = {
    topic: '',
    author: '',
    date: '',
    publisher: '',
    webLink: '',
    description: '',
  };
  file: File;
  base64: string = '';
  img: any = '';
  constructor() {}

  ngOnInit(): void {
    this.controlGroup = new FormGroup({
      topic: new FormControl(this.newsLetter.topic, Validators.required),
      author: new FormControl(this.newsLetter.author, Validators.required),
      date: new FormControl(this.newsLetter.date, Validators.required),
      publisher: new FormControl(
        this.newsLetter.publisher,
        Validators.required
      ),
      webLink: new FormControl(this.newsLetter.webLink, Validators.required),
      description: new FormControl(
        this.newsLetter.description,
        Validators.required
      ),
    });
  }

  //initializing input in html to formValue function
  private formValue(controlName: string): any {
    return this.controlGroup.get(controlName)!.value;
  }

  public save() {
    this.newsLetter.topic = this.formValue('topic');
    this.newsLetter.author = this.formValue('author');
    this.newsLetter.date = this.formValue('date');
    this.newsLetter.publisher = this.formValue('publisher');
    this.newsLetter.webLink = this.formValue('webLink');
    this.newsLetter.description = this.formValue('description');
    this.newsLetter.image = this.base64;
    console.log(this.newsLetter);
  }

  public onChange(event: any) {
    this.file = event.target.files[0];
    this.uploadImage(event);
  }

  //called when user uploads an image
  public uploadImage(event: Event) {
    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsBinaryString(this.file);
  }

  //create base64 image
  private _handleReaderLoaded(readerEvt: any) {
    this.base64 = readerEvt.target.result;
    this.newsLetter.image = this.base64;
    this.updateHTML();
  }

  //update html
  public updateHTML() {
    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = (_event) => {
      this.img = reader.result;
    };
  }

  //trigger file input click event
  public triggerClick() {
    let el: HTMLElement = this.fileUpload.nativeElement;
    el.click();
  }
}
