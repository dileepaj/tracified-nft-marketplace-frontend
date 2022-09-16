import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {
 

  constructor(private _location: Location, private router:Router,private route:ActivatedRoute) { }

 
  ngOnInit(): void {
   
 
}

  async Mail(){
//   const client = new MessageClient({ username: USERNAME, apiKey: API_KEY});
// const response = await client.sendMessage({
//   to: 'test@example.net',
//   from: 'test@example.com',
//   plain: 'test message',
//   html:  '<h1>Test Message</h1>',
//   subject: "hello world"
// });
}


}
