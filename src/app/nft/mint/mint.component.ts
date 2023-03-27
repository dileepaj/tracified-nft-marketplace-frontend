import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { Collection } from 'src/app/models/collection';
import { CollectionService } from 'src/app/services/api-services/collection.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Mint2, Image, SVG } from 'src/app/models/minting';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiServicesService } from 'src/app/services/api-services/api-services.service';
import { SnackbarServiceService } from 'src/app/services/snackbar-service/snackbar-service.service';
import { MatDialog } from '@angular/material/dialog';
import { CodeviewComponent } from '../codeview/codeview.component';
import { UserWallet } from 'src/app/models/userwallet';
import { FreighterComponent } from 'src/app/wallet/freighter/freighter.component';
import { PhantomComponent } from 'src/app/wallet/phantom/phantom.component';
import { MetamaskComponent } from 'src/app/wallet/metamask/metamask.component';
import { DialogService } from 'src/app/services/dialog-services/dialog.service';
import { ConfirmDialogText, SnackBarText } from 'src/app/models/confirmDialog';
import albedo from '@albedo-link/intent';
import { FirebaseAnalyticsService } from 'src/app/services/firebase/firebase-analytics.service';

@Component({
  selector: 'app-mint',
  templateUrl: './mint.component.html',
  styleUrls: ['./mint.component.css'],
})
export class MintComponent implements OnInit {
  @Output() proceed: EventEmitter<any> = new EventEmitter();
  public image: Image;
  addSubscription: Subscription;
  imageSrc: any = '';
  base64: string = '';
  file: File;
  base64Output: string;
  controlGroupMint: FormGroup;
  CollectionList: any;
  Encoded: string;
  collection: Collection = new Collection(
    'user1',
    'collectionName',
    'org',
    'blockchain'
  ); //declaring model to get collections
  // mint:Mint2 = new Mint2('','','','','',this.svg)//declaring model to mint and post
  loading: boolean;
  imgSrc: any;
  hash: any;
  svg: SVG = new SVG('', '', 'NA', '', '');
  mint: Mint2 = new Mint2('', '', '', '', '', this.svg); //declaring model to mint and post
  svgresult;
  email: string = '';
  blockchain: any;
  albedopk: string;
  constructor(
    private service: CollectionService,
    private router: Router,
    private _sanitizer: DomSanitizer,
    private apiService: ApiServicesService,
    private snackBar: SnackbarServiceService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private firebaseanalytics: FirebaseAnalyticsService
  ) {}

  sendToMint2(): void {
    //function to pass data to the next component
    //getting form data and equaling it to the model
    this.mint.NftContentURL = this.hash;
    this.mint.Collection = this.formValue('Collection');
    this.mint.NFTName = this.formValue('NFTName');
    this.mint.Description = this.formValue('Description');
    this.mint.svg = this.svg;
  }

  ngOnInit(): void {
    this.firebaseanalytics.logEvent('page_load', {
      page_name: 'wallet_selectionpage',
    });
    //validation of form data
    this.controlGroupMint = new FormGroup({
      Email: new FormControl(this.email, [
        Validators.required,
        Validators.email,
      ]),
    });
  }

  //getting input to formValue function from html code
  private formValue(controlName: string): any {
    return this.controlGroupMint.get(controlName)!.value;
  }

  /**
   * @function reset - reset the entered form values
   */
  reset() {
    this.controlGroupMint.reset();
  }

  /**
   * @function onClickSubmit - User input validations
   */
  onClickSubmit() {
    if (!this.image) {
      this.snackBar.openSnackBar(SnackBarText.MINT1_UPLOAD_SVG_WARNING, 'info');
    } else if (this.formValue('Collection') == '') {
      this.snackBar.openSnackBar(
        SnackBarText.MINT1_COLLECTION_SELECTION_WARNING,
        'info'
      );
    } else if (this.formValue('NFTName') == '') {
      this.snackBar.openSnackBar(SnackBarText.MINT1_NFT_NAME_WARNING, 'info');
    } else if (this.formValue('Description') == '') {
      this.snackBar.openSnackBar(
        SnackBarText.MINT1_NFT_DESCRIPTION_WARNING,
        'info'
      );
    } else {
      this.sendToMint2();
    }
  }

  //open the popup for the code view
  public openDialog() {
    const dialogRef = this.dialog.open(CodeviewComponent, {
      data: {
        imgSrc: this.Encoded,
      },
    });
  }

  getShortenKey(key:string){
    let keyPart1 = key.substring(0,4)
    let keyPart2 = key.substring(key.length-4)
    let finalkey =`${keyPart1}....${keyPart2}`
    return finalkey
  }

  public async selectWallet(wallet: string) {
    if (this.controlGroupMint.get('Email')?.errors) {
      this.snackBar.openSnackBar('Please enter a valid email address', 'info');
      return;
    }
    if (wallet == 'metamask') {
      let metamaskwallet = new UserWallet();
      metamaskwallet = new MetamaskComponent(metamaskwallet);
      await metamaskwallet.initWallelt();
      var key = metamaskwallet.getWalletaddress();
      this.blockchain = 'ethereum or polygon';
      if (key != null) {
        this.firebaseanalytics.logEvent('wallet_activated:', {
          wallet_name: wallet,
        });
        this.firebaseanalytics.setUserProperties({ UserWallet: wallet });
        this.apiService.getEndorsement(key).subscribe((result: any) => {
          if (
            result.Status == null ||
            result.Status == 'Declined' ||
            result.Status == ''
          ) {
            this.firebaseanalytics.logEvent('user_account_status', {
              status_response: result.Status,
              account_status: 'account not endorsed or is Declined',
              action: 'Triggered pop up window',
              blockchain_name: 'Etheruem or Polygon',
            });
            this.dialogService
              .confirmDialog({
                title: ConfirmDialogText.MINT1_PK_ENDORSMENT_TITLE,
                message: ConfirmDialogText.MINT1_PK_ENDORSMENT_MESSAGE_P1 + `${this.getShortenKey(key)} for Ethereum/Polygon ` + ConfirmDialogText.MINT1_PK_ENDORSMENT_MESSAGE_P2,
                confirmText: ConfirmDialogText.CONFIRM_BTN,
                cancelText: ConfirmDialogText.CANCEL_BTN,
              })
              .subscribe((res) => {
                this.firebaseanalytics.logEvent('popUp-Triggered', {
                  popup_name: 'Endorsment Confirmation popup',
                  Triggered_for: 'Etheruem/Polygon',
                  reason: 'User public key not endrosed',
                });
                if (res) {
                  this.firebaseanalytics.logEvent('popup_response', {
                    btn_clicked: 'yes',
                    Triggered_for: 'Etheruem/Polygon',
                  });
                  let arr: any = [this.blockchain, this.email, wallet];
                  this.firebaseanalytics.logEvent('page_change', {
                    current_page: 'mint1 screen',
                    page_directed_to: 'Endorsment signup page',
                  });
                  this.router.navigate(['./signUp'], {
                    queryParams: { data: JSON.stringify(arr) },
                  });
                }
              });
          } else if (result.Status == 'Pending') {
            this.dialogService.okDialog({
              title: 'Endorsement in Pending',
              message:
                'Please be informed that your endorsement request has been sent to Tracified and will be reviewed within 48 hours after submission',
              confirmText: ConfirmDialogText.CONFIRM_BTN,
            });
          } else {
            this.proceed.emit({
              email: this.email,
              wallet,
              key: key,
            });
          }
        });
      }
    }
    if (wallet == 'freighter') {
      let details = navigator.userAgent;

      let regexp = /android|iphone|kindle|ipad/i;

      let isMobileDevice = await regexp.test(details);

      if (isMobileDevice) {
        alert("You're on your mobile! Redirecting to Albedo")
        await albedo
        .publicKey({
          require_existing: true,
        })
        .then((res: any) => {
          this.albedopk = res.pubkey;
        });
      var key = this.albedopk;
      this.blockchain = 'stellar';
      if (key != null) {
        this.firebaseanalytics.logEvent('wallet_activated:', {
          wallet_name: wallet,
        });
        this.firebaseanalytics.setUserProperties({ UserWallet: wallet });
        this.apiService.getEndorsement(key).subscribe((result: any) => {
          if (
            result.Status == null ||
            result.Status == 'Declined' ||
            result.Status == ''
          ) {
            this.firebaseanalytics.logEvent('user_account_status', {
              status_response: result.Status,
              account_status: 'account not endorsed or is Declined',
              action: 'Triggered pop up window',
              blockchain_name: 'Stellar-Albedo',
            });
            this.dialogService
              .confirmDialog({
                title: ConfirmDialogText.MINT1_PK_ENDORSMENT_TITLE,
                message: ConfirmDialogText.MINT1_PK_ENDORSMENT_MESSAGE_P1 + `${this.getShortenKey(key)} for Stellar ` + ConfirmDialogText.MINT1_PK_ENDORSMENT_MESSAGE_P2,
                confirmText: ConfirmDialogText.CONFIRM_BTN,
                cancelText: ConfirmDialogText.CANCEL_BTN,
              })
              .subscribe((res) => {
                this.firebaseanalytics.logEvent('popUp-Triggered', {
                  popup_name: 'Endorsment Confirmation popup',
                  Triggered_for: 'Setellar-Albedo',
                  reason: 'User public key not endrosed',
                });
                if (res) {
                  this.firebaseanalytics.logEvent('popup_response', {
                    btn_clicked: 'yes',
                    Triggered_for: 'Stellar-Freighter',
                  });
                  let arr: any = [this.blockchain, this.email, wallet];
                  this.firebaseanalytics.logEvent('page_change', {
                    current_page: 'mint1 screen',
                    page_directed_to: 'Endorsment signup page',
                  });
                  this.router.navigate(['./signUp'], {
                    queryParams: { data: JSON.stringify(arr) },
                  });
                }
              });
          } else if (result.Status == 'Pending') {
            this.dialogService.okDialog({
              title: 'Endorsement in Pending',
              message:
                'Please be informed that your endorsement request has been sent to Tracified and will be reviewed within 48 hours after submission',
              confirmText: ConfirmDialogText.CONFIRM_BTN,
            });
          } else {
            this.proceed.emit({
              email: this.email,
              wallet,
              key: key,
            });
          }
        });
      } else {
        window.location.href = 'https://albedo.link/';
      }

      } else {
     
        let freighter = new UserWallet();
        freighter = new FreighterComponent(freighter);
        await freighter.initWallelt();
        var key = await freighter.getWalletaddress();
        this.blockchain = 'stellar';
        if (key != null) {
          this.firebaseanalytics.logEvent('wallet_activated:', {
            wallet_name: wallet,
          });
          this.firebaseanalytics.setUserProperties({ UserWallet: wallet });
          this.apiService.getEndorsement(key).subscribe((result: any) => {
            if (
              result.Status == null ||
              result.Status == 'Declined' ||
              result.Status == ''
            ) {
              this.firebaseanalytics.logEvent('user_account_status', {
                status_response: result.Status,
                account_status: 'account not endorsed or is Declined',
                action: 'Triggered pop up window',
                blockchain_name: 'Stellar-Freighter',
              });
              this.dialogService
                .confirmDialog({
                  title: ConfirmDialogText.MINT1_PK_ENDORSMENT_TITLE,
                  message: ConfirmDialogText.MINT1_PK_ENDORSMENT_MESSAGE,
                  confirmText: ConfirmDialogText.CONFIRM_BTN,
                  cancelText: ConfirmDialogText.CANCEL_BTN,
                })
                .subscribe((res) => {
                  this.firebaseanalytics.logEvent('popUp-Triggered', {
                    popup_name: 'Endorsment Confirmation popup',
                    Triggered_for: 'Stellar-Freighter',
                    reason: 'User public key not endrosed',
                  });
                  if (res) {
                    this.firebaseanalytics.logEvent('popup_response', {
                      btn_clicked: 'yes',
                      Triggered_for: 'Stellar-Freighter',
                    });
                    let arr: any = [this.blockchain, this.email, wallet];
                    this.firebaseanalytics.logEvent('page_change', {
                      current_page: 'mint1 screen',
                      page_directed_to: 'Endorsment signup page',
                    });
                    this.router.navigate(['./signUp'], {
                      queryParams: { data: JSON.stringify(arr) },
                    });
                  }
                });
            } else if (result.Status == 'Pending') {
              this.dialogService.okDialog({
                title: 'Endorsement in Pending',
                message:
                  'Please be informed that your endorsement request has been sent to Tracified and will be reviewed within 48 hours after submission',
                confirmText: ConfirmDialogText.CONFIRM_BTN,
              });
            } else {
              this.proceed.emit({
                email: this.email,
                wallet,
                key: key,
              });
            }
          });
        }
      }
    }

    if (wallet == 'albedo') {
      let details = navigator.userAgent;

      let regexp = /android|iphone|kindle|ipad/i;

      let isMobileDevice = await regexp.test(details);

      if (isMobileDevice) {
        await albedo
        .publicKey({
          require_existing: true,
        })
        .then((res: any) => {
          this.albedopk = res.pubkey;
        });
      var key = this.albedopk;
      this.blockchain = 'stellar';
      if (key != null) {
        this.firebaseanalytics.logEvent('wallet_activated:', {
          wallet_name: wallet,
        });
        this.firebaseanalytics.setUserProperties({ UserWallet: wallet });
        this.apiService.getEndorsement(key).subscribe((result: any) => {
          if (
            result.Status == null ||
            result.Status == 'Declined' ||
            result.Status == ''
          ) {
            this.firebaseanalytics.logEvent('user_account_status', {
              status_response: result.Status,
              account_status: 'account not endorsed or is Declined',
              action: 'Triggered pop up window',
              blockchain_name: 'Stellar-Albedo',
            });
            this.dialogService
              .confirmDialog({
                title: ConfirmDialogText.MINT1_PK_ENDORSMENT_TITLE,
                message: ConfirmDialogText.MINT1_PK_ENDORSMENT_MESSAGE_P1 + `${this.getShortenKey(key)} for Stellar ` + ConfirmDialogText.MINT1_PK_ENDORSMENT_MESSAGE_P2,
                confirmText: ConfirmDialogText.CONFIRM_BTN,
                cancelText: ConfirmDialogText.CANCEL_BTN,
              })
              .subscribe((res) => {
                this.firebaseanalytics.logEvent('popUp-Triggered', {
                  popup_name: 'Endorsment Confirmation popup',
                  Triggered_for: 'Setellar-Albedo',
                  reason: 'User public key not endrosed',
                });
                if (res) {
                  this.firebaseanalytics.logEvent('popup_response', {
                    btn_clicked: 'yes',
                    Triggered_for: 'Stellar-Freighter',
                  });
                  let arr: any = [this.blockchain, this.email, wallet];
                  this.firebaseanalytics.logEvent('page_change', {
                    current_page: 'mint1 screen',
                    page_directed_to: 'Endorsment signup page',
                  });
                  this.router.navigate(['./signUp'], {
                    queryParams: { data: JSON.stringify(arr) },
                  });
                }
              });
          } else if (result.Status == 'Pending') {
            this.dialogService.okDialog({
              title: 'Endorsement in Pending',
              message:
                'Please be informed that your endorsement request has been sent to Tracified and will be reviewed within 48 hours after submission',
              confirmText: ConfirmDialogText.CONFIRM_BTN,
            });
          } else {
            this.proceed.emit({
              email: this.email,
              wallet,
              key: key,
            });
          }
        });
      } else {
        window.location.href = 'https://albedo.link/';
      }
      } else {
       alert("You're on your PC, redirecting with freigter")
       let freighter = new UserWallet();
       freighter = new FreighterComponent(freighter);
       await freighter.initWallelt();
       var key = await freighter.getWalletaddress();
       this.blockchain = 'stellar';
       if (key != null) {
         this.firebaseanalytics.logEvent('wallet_activated:', {
           wallet_name: wallet,
         });
         this.firebaseanalytics.setUserProperties({ UserWallet: wallet });
         this.apiService.getEndorsement(key).subscribe((result: any) => {
           if (
             result.Status == null ||
             result.Status == 'Declined' ||
             result.Status == ''
           ) {
             this.firebaseanalytics.logEvent('user_account_status', {
               status_response: result.Status,
               account_status: 'account not endorsed or is Declined',
               action: 'Triggered pop up window',
               blockchain_name: 'Stellar-Freighter',
             });
             this.dialogService
               .confirmDialog({
                 title: ConfirmDialogText.MINT1_PK_ENDORSMENT_TITLE,
                 message: ConfirmDialogText.MINT1_PK_ENDORSMENT_MESSAGE,
                 confirmText: ConfirmDialogText.CONFIRM_BTN,
                 cancelText: ConfirmDialogText.CANCEL_BTN,
               })
               .subscribe((res) => {
                 this.firebaseanalytics.logEvent('popUp-Triggered', {
                   popup_name: 'Endorsment Confirmation popup',
                   Triggered_for: 'Stellar-Freighter',
                   reason: 'User public key not endrosed',
                 });
                 if (res) {
                   this.firebaseanalytics.logEvent('popup_response', {
                     btn_clicked: 'yes',
                     Triggered_for: 'Stellar-Freighter',
                   });
                   let arr: any = [this.blockchain, this.email, wallet];
                   this.firebaseanalytics.logEvent('page_change', {
                     current_page: 'mint1 screen',
                     page_directed_to: 'Endorsment signup page',
                   });
                   this.router.navigate(['./signUp'], {
                     queryParams: { data: JSON.stringify(arr) },
                   });
                 }
               });
           } else if (result.Status == 'Pending') {
             this.dialogService.okDialog({
               title: 'Endorsement in Pending',
               message:
                 'Please be informed that your endorsement request has been sent to Tracified and will be reviewed within 48 hours after submission',
               confirmText: ConfirmDialogText.CONFIRM_BTN,
             });
           } else {
             this.proceed.emit({
               email: this.email,
               wallet,
               key: key,
             });
           }
         });
       }
      }
     
    }
    if (wallet == 'phantom') {
      let phantomWallet = new UserWallet();
      phantomWallet = new PhantomComponent(phantomWallet);
      await phantomWallet.initWallelt();
      this.blockchain = 'solana';
      var key = await phantomWallet.getWalletaddress();
      if (key != null) {
        this.firebaseanalytics.logEvent('wallet_activated:', {
          wallet_name: wallet,
        });
        this.firebaseanalytics.setUserProperties({ UserWallet: wallet });
        this.apiService.getEndorsement(key).subscribe((result: any) => {
          if (
            result.Status == null ||
            result.Status == 'Declined' ||
            result.Status == ''
          ) {
            this.firebaseanalytics.logEvent('user_account_status', {
              status_response: result.Status,
              account_status: 'account not endorsed or is Declined',
              action: 'Triggered pop up window',
              blockchain_name: 'Solana',
            });
            this.dialogService
              .confirmDialog({
                title: ConfirmDialogText.MINT1_PK_ENDORSMENT_TITLE,
                message: ConfirmDialogText.MINT1_PK_ENDORSMENT_MESSAGE_P1 + `${this.getShortenKey(key)} for Solana ` + ConfirmDialogText.MINT1_PK_ENDORSMENT_MESSAGE_P2,
                confirmText: ConfirmDialogText.CONFIRM_BTN,
                cancelText: ConfirmDialogText.CANCEL_BTN,
              })
              .subscribe((res) => {
                this.firebaseanalytics.logEvent('popUp-Triggered', {
                  popup_name: 'Endorsment Confirmation popup',
                  Triggered_for: 'Solana',
                  reason: 'User public key not endrosed',
                });
                if (res) {
                  this.firebaseanalytics.logEvent('popup_response', {
                    btn_clicked: 'yes',
                    Triggered_for: 'Solana',
                  });
                  let arr: any = [this.blockchain, this.email, wallet];
                  this.firebaseanalytics.logEvent('page_change', {
                    current_page: 'mint1 screen',
                    page_directed_to: 'Endorsment signup page',
                  });
                  this.router.navigate(['./signUp'], {
                    queryParams: { data: JSON.stringify(arr) },
                  });
                }
              });
          } else if (result.Status == 'Pending') {
            this.dialogService.okDialog({
              title: 'Endorsement in Pending',
              message:
                'Please be informed that your endorsement request has been sent to Tracified and will be reviewed within 48 hours after submission',
              confirmText: ConfirmDialogText.CONFIRM_BTN,
            });
          } else {
            this.proceed.emit({
              email: this.email,
              wallet,
              key: key,
            });
          }
        });
      }
    }
  }
}
