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
    this.convert();
    this.mint.svg = this.svg;
    console.log('svg data sent to mint 2 :', this.svg);
    //let data :any=this.mint;
    this.router.navigate(['./mint2'], {
      queryParams: { data: JSON.stringify(this.mint) },
    });
  }

  convert(): void {
    this.svg.Base64ImageSVG = this.Encoded;
    this.svg.Hash = this.hash;
  }

  onFileChange(event: any) {
    this.file = event.target.files[0];
    this.uploadImage(event);
  }

  public uploadImage(event: Event) {
    this.loading = !this.loading;
    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = this._handleReaderLoaded.bind(this);
    this.loading = false; // Flag variable
  }

  //create base64 image
  private _handleReaderLoaded(readerEvt: any) {
    this.base64 = readerEvt.target.result;

    const unwantedText = 'data:image/svg+xml;base64,';
    this.base64 = this.base64.replace(unwantedText, '');
    let encoded: string = atob(this.base64);
    this.Encoded = encoded;

    this.hash = CryptoJS.SHA256(encoded).toString(CryptoJS.enc.Hex);
    this.updateImage();
    this.updateHTML();
  }

  public updateHTML() {
    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = (_event) => {
      this.imgSrc = reader.result;
      this.imageSrc = this._sanitizer.bypassSecurityTrustResourceUrl(
        this.imgSrc
      );
    };
  }

  private updateImage() {
    this.image = {
      ...this.image,
      Type: this.file.type,
      Base64Image: this.base64,
    };
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.collection.userId = JSON.parse(params['data']);
      console.log('DATA recived: ', this.collection.userId);
    });
    //getting collection data according to user PK
    if (this.collection.userId != null) {
      this.service
        .getCollectionName(this.collection.userId)
        .subscribe((data: any) => {
          this.CollectionList = data;
        });
    } else {
      console.log('User PK not connected or not endorsed');
    }
    //validation of form data
    this.controlGroupMint = new FormGroup({
      Collection: new FormControl(this.mint.Collection, Validators.required),
      NFTName: new FormControl(this.mint.NFTName, Validators.required),
      Description: new FormControl(this.mint.Description, Validators.required),
      file: new FormControl(this.mint.NftContentURL, [Validators.required]),
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

  public selectWallet(wallet: string) {
    console.log(this.email, wallet);
    this.proceed.emit({
      email: this.email,
      wallet,
    });
  }
}
