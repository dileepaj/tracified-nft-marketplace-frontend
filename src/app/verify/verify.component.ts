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
  controlGroup: FormGroup;
  userId: any;
  user:any

  constructor(private _location: Location, private router:Router,private route:ActivatedRoute) { }

  async save(): Promise<void> {
    this.userId = this.formValue('userId');
    this.router.navigate(['./mint'],{
      queryParams:{data:JSON.stringify(this.userId)}
      });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params)=>{
      this.userId=JSON.parse(params['data']);
  })

    this.controlGroup = new FormGroup({
      userId: new FormControl(this.userId, Validators.required),
  });
}

private formValue(controlName: string): any {
  return this.controlGroup.get(controlName)!.value;
}

public back() {
  this._location.back();
}

}
