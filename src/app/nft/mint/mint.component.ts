import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { Collection } from 'src/app/models/collection';
import { CollectionService } from 'src/app/services/api-services/collection.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Mint2, Image, SVG } from 'src/app/models/minting';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import CryptoJS from 'crypto-js';
import { ApiServicesService } from 'src/app/services/api-services/api-services.service';
import { SnackbarServiceService } from 'src/app/services/snackbar-service/snackbar-service.service';
import { MatDialog } from '@angular/material/dialog';
import { CodeviewComponent } from '../codeview/codeview.component';
import { UserWallet } from 'src/app/models/userwallet';
import { FreighterComponent } from 'src/app/wallet/freighter/freighter.component';
import { PhantomComponent } from 'src/app/wallet/phantom/phantom.component';
import { MetamaskComponent } from 'src/app/wallet/metamask/metamask.component';
import { DialogService } from 'src/app/services/dialog-services/dialog.service';

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
  svg: SVG = new SVG('', '', 'NA');
  mint: Mint2 = new Mint2('', '', '', '', '', this.svg); //declaring model to mint and post
  svgresult;
  email: string = '';
  blockchain: any;
  constructor(
    private service: CollectionService,
    private router: Router,
    private _sanitizer: DomSanitizer,
    private apiService: ApiServicesService,
    private snackBar: SnackbarServiceService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private dialogService: DialogService,
  ) {}

  sendToMint2(): void {
    //function to pass data to the next component
    //getting form data and equaling it to the model
    this.mint.NftContentURL = this.hash;
    this.mint.Collection = this.formValue('Collection');
    this.mint.NFTName = this.formValue('NFTName');
    this.mint.Description = this.formValue('Description');
    this.mint.svg = this.svg;
  
    //let data :any=this.mint;
    // this.router.navigate(['./mint2'], {
    //   queryParams: { data: JSON.stringify(this.mint) },
    // });
  }

 
  ngOnInit(): void {
    console.log("which scrennnnnnn--------------------")
    // this.route.queryParams.subscribe((params) => {
    //   this.collection.userId = JSON.parse(params['data']);
    // });
   
    //validation of form data
    this.controlGroupMint = new FormGroup({
      Email: new FormControl(this.email, Validators.required),
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
      this.snackBar.openSnackBar('Please upload an SVG');
    } else if (this.formValue('Collection') == '') {
      this.snackBar.openSnackBar('Please select a collection for your NFT');
    } else if (this.formValue('NFTName') == '') {
      this.snackBar.openSnackBar('Please name your NFT');
    } else if (this.formValue('Description') == '') {
      this.snackBar.openSnackBar('Please add a discription for your NFT');
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

  public async selectWallet(wallet: string) {
    console.log("wallet is",wallet)
    if(wallet=="metamask"){
      let metamaskwallet = new UserWallet();
      metamaskwallet = new MetamaskComponent(metamaskwallet);
      await metamaskwallet.initWallelt()
      var key=  metamaskwallet.getWalletaddress()
      this.blockchain="ethereum or polygon"
       if(key!=null){
        console.log("data: ",this.email,wallet, key)
        this.apiService
        .getEndorsement(key)
        .subscribe((result: any) => {
          if (result.Status == null || result.Status == '') {
            this.dialogService
              .confirmDialog({
                title: 'Public Key Endorsment',
                message:
                  'Your account is not endorsed. Would you like to get your account Endorsed now',
                confirmText: 'Yes',
                cancelText: 'No',
              })
              .subscribe((res) => {
                if (res) {
                  //alert("You are not endorsed. Get endorsed now")
                  let arr:any=[this.blockchain,this.email]
                  this.router.navigate(['./signUp'], {
                    queryParams: { data: JSON.stringify(arr) },
                  });
                }
              });
            }else{
              this.proceed.emit({
                email:this.email,
                wallet,
                key:key
              });
            }
          });
      
       }else{
        window.location.href = 'https://metamask.io/';
       }
    }
    if(wallet=="freighter"){
      let freighter = new UserWallet();
          freighter = new FreighterComponent(freighter);
          await freighter.initWallelt();
          var key =await freighter.getWalletaddress()
       if(key!=null){
        console.log("data: ",this.email,wallet, key)
        this.apiService
        .getEndorsement(key)
        .subscribe((result: any) => {
          if (result.Status == null || result.Status == '') {
            this.dialogService
              .confirmDialog({
                title: 'Public Key Endorsment',
                message:
                  'Your account is not endorsed. Would you like to get your account Endorsed now',
                confirmText: 'Yes',
                cancelText: 'No',
              })
              .subscribe((res) => {
                if (res) {
                  //alert("You are not endorsed. Get endorsed now") 
                   let arr:any=[this.blockchain,this.email]
                  this.router.navigate(['./signUp'], {
                    queryParams: { data: JSON.stringify(arr) },
                  });
                }
              });
            }else{
              this.proceed.emit({
                email:this.email,
                wallet,
                key:key
              });
            }
          });
      
       }else{
        window.location.href = 'https://metamask.io/';
       }
    }
    if(wallet=="phantom"){
      let phantomWallet = new UserWallet();
      phantomWallet = new PhantomComponent(phantomWallet);
     await phantomWallet.initWallelt()
     var key=await phantomWallet.getWalletaddress()
    if(key!=null){
      console.log("data: ",this.email,wallet, key)
      this.apiService
      .getEndorsement(key)
      .subscribe((result: any) => {
        if (result.Status == null || result.Status == '') {
          this.dialogService
            .confirmDialog({
              title: 'Public Key Endorsment',
              message:
                'Your account is not endorsed. Would you like to get your account Endorsed now',
              confirmText: 'Yes',
              cancelText: 'No',
            })
            .subscribe((res) => {
              if (res) {
                //alert("You are not endorsed. Get endorsed now")
                let arr:any=[this.blockchain,this.email]
                this.router.navigate(['./signUp'], {
                  queryParams: { data: JSON.stringify(arr) },
                });
              }
            });
          }else{
            this.proceed.emit({
              email:this.email,
              wallet,
              key:key
            });
          }
        });
    
     }else{
      window.location.href = 'https://metamask.io/';
     }
    }
  }

  }

  

