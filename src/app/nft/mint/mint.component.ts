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
  constructor(
    private service: CollectionService,
    private router: Router,
    private _sanitizer: DomSanitizer,
    private apiService: ApiServicesService,
    private snackBar: SnackbarServiceService,
    public dialog: MatDialog,
    private route: ActivatedRoute
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
      var res=  metamaskwallet.getWalletaddress()
       if(res!=null){
        console.log("data: ",this.email,wallet)
        // const arr:any[]=[this.email,wallet]
        // this.router.navigate(['./mint2'],{
        //   queryParams:{data:JSON.stringify(arr)}
        //   });
        this.proceed.emit({
          email:this.email,
          wallet
        });
       }else{
        window.location.href = 'https://metamask.io/';
       }
    }
    if(wallet=="freighter"){
      let freighter = new UserWallet();
          freighter = new FreighterComponent(freighter);
          await freighter.initWallelt();
          var res =await freighter.getWalletaddress()
       if(res!=null){
        this.proceed.emit({
          email:this.email,
          wallet
        });
       }else{
        window.location.href = 'https://www.freighter.app/';
       }
    }
    if(wallet=="phantom"){
      let phantomWallet = new UserWallet();
      phantomWallet = new PhantomComponent(phantomWallet);
     await phantomWallet.initWallelt()
     var res=await phantomWallet.getWalletaddress()
    if(res!=null){
      this.proceed.emit({
          email:this.email,
          wallet
        });
    }else{
      window.location.href = 'https://phantom.app/';
    }
    }
  }

  }

  

