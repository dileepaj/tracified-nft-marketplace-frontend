import { Float } from '@solana/buffer-layout';

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExecFileSyncOptionsWithStringEncoding } from 'child_process';
import { Subscription } from 'rxjs';
import { UpdateStatus } from 'src/app/models/endorse';
import { ApiServicesService } from 'src/app/services/api-services/api-services.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogService } from 'src/app/services/dialog-services/dialog.service';
import { SnackbarServiceService } from 'src/app/services/snackbar-service/snackbar-service.service';
import { ConfirmDialogText, SnackBarText } from 'src/app/models/confirmDialog';

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
  review: string
  data: any;
  public PKval: any
  constructor(private route: ActivatedRoute,
    private service: ApiServicesService,
    private router: Router,
    private dialogService: DialogService,
    private snackbar: SnackbarServiceService
  ) { }

  //Fuction will retreive data from the .html file and initiate the service call to save a user reivew
  save(): void {
    alert(
      `${this.formValue('rating')} stars, "${this.formValue('description')}"`
    );
  }
  details = new FormGroup({

  })

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.data = JSON.parse(params['data']);
      this.PKval = this.data.PublicKey
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

  //Triggered when user clicks on accpet endorstment button. "status" in DB is updated as accpeted along with the review and rating
  public acceptEndorsment() {
    this.rating = this.formValue('rating')
    this.description = this.formValue('description')
    if (this.rating != null && this.description != null) {
      var updateEndorstment = new UpdateStatus("Accepted", this.data.PublicKey, this.description, this.rating, this.data.Email);
      //opens to a confirmation dialog to get users approval before sending the update
      this.dialogService.confirmDialog({
        title: ConfirmDialogText.ADMIN_ENDORSE_USER_ACCEPT_TITLE,
        message: ConfirmDialogText.ADMIN_ENDORSE_USER_ACCEPT_MESSAGE,
        confirmText: ConfirmDialogText.ACCEPT_ENDORSMENT_BTN,
        cancelText: ConfirmDialogText.CANCEL_BTN
      }).subscribe(result => {
        if (result) {
          this.service.updateEndorsementStatus(updateEndorstment).subscribe((updateResult: any) => {
            //if the updation is scuccesfull the user will get routed back to the admin dashboard
            if (updateResult != "" || updateResult != null) {
              this.snackbar.openSnackBar(SnackBarText.ADMIN_ENDORSEMENT_ACCEPTED_SUCCESS, 'success')
              this.router.navigate(['/admin-dashboard'])
            } else {
              this.snackbar.openSnackBar(SnackBarText.ADMIN_ENDORSMENT_ACCEPTED_ERROR, 'error')
            }

          })
        }
      })
    } else {
      this.snackbar.openSnackBar(SnackBarText.ADMIN_ENDORSE_BLANK_INPUT_WARNING, 'info')
    }

  }

  //Triggered when user clicks on decline endorstment button. "status" in the DB is updated as declined along with the review and rating
  public declineEndorsment() {
    this.rating = this.formValue('rating')
    this.description = this.formValue('description')
    if (this.rating != null && this.description != null) {
      var updateEndorstment = new UpdateStatus("Declined", this.data.PublicKey, this.description, this.rating, this.data.Email)
      //opens to a confirmation dialog to get users approval before sending the update
      this.dialogService.confirmDialog({
        title: ConfirmDialogText.ADMIN_ENDORSE_USER_DECLINE_TITLE,
        message: ConfirmDialogText.ADMIN_ENDORSE_USER_DECLINE_MESSAGE,
        cancelText: ConfirmDialogText.CANCEL_BTN,
        confirmText: ConfirmDialogText.DECLINE_ENDORSMENT_BTN
      }).subscribe(result => {
        if (result) {
          this.service.updateEndorsementStatus(updateEndorstment).subscribe((updateEndorstment: any) => {
            //if the updation is scuccesfull the user will get routed back to the admin dashboard
            if (updateEndorstment) {
              this.snackbar.openSnackBar(SnackBarText.ADMIN_ENDORSMENT_DECLINED_SUCCESS, 'success')
              this.router.navigate(['/admin-dashboard'])
            }

          })
        }

      })
    } else {
      this.snackbar.openSnackBar(SnackBarText.ADMIN_ENDORSE_BLANK_INPUT_WARNING, 'info')
    }


  }
  private formValue(controlName: string): any {
    return this.controlGroup.get(controlName)!.value;
  }
}
