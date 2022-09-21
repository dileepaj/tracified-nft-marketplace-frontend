import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css'],
})
export class ContactUsComponent implements OnInit {
  @ViewChild('fileUpload') fileUpload: ElementRef<HTMLElement>;
  file: File;
  name: string = '';
  constructor() {}

  ngOnInit(): void {}

  public onChange(event: any) {
    this.file = event.target.files[0];
    this.name = this.file.name;
  }

  //trigger file input click event
  public triggerClick() {
    let el: HTMLElement = this.fileUpload.nativeElement;
    el.click();
  }

  @HostListener('dragover', ['$event']) public onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  @HostListener('drop', ['$event']) public onDrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    if (evt.target.id === 'cntct-dnd' || evt.target.id === 'cntct-dnd-label') {
      let files = evt.dataTransfer.files;
      let valid_files: Array<File> = files;
      this.file = valid_files[0];
      this.name = this.file.name;
    }
  }
}
