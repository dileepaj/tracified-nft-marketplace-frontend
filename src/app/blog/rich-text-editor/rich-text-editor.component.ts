import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-rich-text-editor',
  templateUrl: './rich-text-editor.component.html',
  styleUrls: ['./rich-text-editor.component.css']
})
export class RichTextEditorComponent implements OnInit {

  constructor() { }
  title = 'Tracified rich text editor';
  public  data :string ="" ;  
   save() {
    let jsondata  =JSON.parse(JSON.stringify(this.data))
    console.log("data retrevied:",this.data)
    console.log("html data type:",typeof(jsondata))
   console.log(jsondata)
  }
  testsave() {
    alert("data");
  }

  ngOnInit(): void {
  }

}
