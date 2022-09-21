import { Blockchain } from './../../collections/create-collection/create-collection.component';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { map, Observable, startWith, Subscription } from 'rxjs';
import {
  NFT,
  Ownership,
  tags,
  Issuer,
  Minter,
  StellarTXN,
  Contracts,
  TXN,
  UpdateSVG,
  SVG,
} from 'src/app/models/minting';
import { MintService } from 'src/app/services/blockchain-services/mint.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TrustlinesService } from 'src/app/services/blockchain-services/stellar-services/trustlines.service';
import { Properties } from '../../shared/properties';
import { PolygonMintService } from 'src/app/services/contract-services/polygon-mint.service';
import { environment } from 'src/environments/environment';
import { EthereumMintService } from 'src/app/services/contract-services/ethereum-mint.service';
import { ApiServicesService } from 'src/app/services/api-services/api-services.service';
import { UserWallet } from 'src/app/models/userwallet';
import { PhantomComponent } from 'src/app/wallet/phantom/phantom.component';
import { MetamaskComponent } from 'src/app/wallet/metamask/metamask.component';
import { FreighterComponent } from 'src/app/wallet/freighter/freighter.component';
import { DomSanitizer } from '@angular/platform-browser';
import { NftServicesService } from 'src/app/services/api-services/nft-services/nft-services.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { DialogService } from 'src/app/services/dialog-services/dialog.service';
import { SnackbarServiceService } from 'src/app/services/snackbar-service/snackbar-service.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Description } from '@ethersproject/properties';
import CryptoJS from 'crypto-js';
import { CollectionService } from 'src/app/services/api-services/collection.service';
import { CodeviewComponent } from '../codeview/codeview.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-mint2',
  providers: [MintService, TrustlinesService, Properties],
  templateUrl: './mint2.component.html',
  styleUrls: ['./mint2.component.css'],
})
export class Mint2Component implements OnInit {
  //declaring models and variables
  @ViewChild('tagsInput') tagsInput: ElementRef<HTMLInputElement>;
  @ViewChild('fileUpload') fileUpload: ElementRef<HTMLElement>;
  @Output() proceed: EventEmitter<any> = new EventEmitter();
  @Input() email: string;
  @Input() wallet: string;
  stxn: StellarTXN = new StellarTXN('', '', '');
  contract: Contracts = new Contracts(
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    [],
    '',
    '0',
    '',
    '',
    '',
    ''
  );
  tag: tags = new tags('', '', []);
  own: Ownership = new Ownership('', '', '', '', 1);
  controlGroup: FormGroup;
  issuer: Issuer = new Issuer('');
  solMinter: any;
  List: any;
  addSubscription: Subscription;
  isLoadingPresent: boolean;
  loading: any;
  data: any;
  mint: NFT = new NFT(
    '',
    '',
    '',
    '',
    '',
    '',
    '0',
    '',
    [],
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    false,
    false
  );
  minter: Minter = new Minter('', '', '', '', '');
  tokenId: number;
  txn: TXN = new TXN('', '', '', '', '', '');
  svgUpdate: UpdateSVG = new UpdateSVG('', '');
  svg: SVG = new SVG('', '', 'NA');
  Decryption: any;
  dec: string;
  imageSrc: any;
  userPK: string;
  distributor: any;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl: FormControl = new FormControl('');
  filteredtags: Observable<string[]>;
  tags: string[] = ['carbon footprint','nfts', 'gems'];
  alltags: string[] = [];
  file: File;
  base64: string = '';
  img: any = '';
  Encoded: string;
  hash: any;
  onHover: boolean = false;
  CollectionList: any;
  ethereum: boolean;
  stellar: boolean;
  polygon: boolean;
  solana: boolean;

  constructor(
    private route: ActivatedRoute,
    private service: MintService,
    private trustService: TrustlinesService,
    private pmint: PolygonMintService,
    private emint: EthereumMintService,
    private apiService: ApiServicesService,
    private _sanitizer: DomSanitizer,
    private nft: NftServicesService,
    private router: Router,
    private loaderService: LoaderService,
    private dialogService: DialogService,
    private snackbar: SnackbarServiceService,
    private serviceCol: CollectionService,
    public dialog: MatDialog,
  ) {
    this.filteredtags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) =>
        tag ? this._filter(tag) : this.alltags.slice()
      )
    );

    console.log("inside constructor; ",this.wallet,this.email)
  }

  sendToMint3(): void {
    //getting form data to mint and post

    this.mint.Collection = this.formValue('Collection');
    this.mint.Copies = '1';
    this.mint.Categories = 'NFT SVG';
    this.mint.Tags = this.tags;
    this.mint.ArtistName = this.formValue('ArtistName');
    this.mint.ArtistProfileLink = this.formValue('ArtistProfileLink');
    this.mint.CurrentOwnerPK = this.mint.CreatorUserId;
    this.mint.SellingStatus = 'Minted';
    this.mint.SellingType = 'NFT';
    this.mint.DistributorPK = this.mint.CreatorUserId;
    this.mint.Status = 'Minted';
    (this.mint.Trending = false), (this.mint.HotPicks = false);
    //posting of mint data to backend via service
    if (this.mint.CreatorUserId != null) {
      this.addSubscription = this.service.addNFTBE(this.mint).subscribe();
    }
    this.pushOwner(); //calling function
    this.pushTag(); //calling fnction
  }
  pushOwner(): void {
    //posting owner data via service to backend
    this.own.NFTIdentifier = this.mint.NFTIdentifier;
    this.own.CurentOwnerPK = this.mint.CurrentOwnerPK;
    this.own.PreviousOwnerPK = 'none';
    this.own.Status = this.mint.Status;
    this.own.OwnerRevisionID = 1;
    if (this.mint.CreatorUserId != null) {
      this.addSubscription = this.service.addOwner(this.own).subscribe();
    }
  }

  public openDialog() {
    const dialogRef = this.dialog.open(CodeviewComponent,{
      data:{
        imgSrc:this.Encoded
      },
    });
  }


  pushTag(): void {
    //posting tag data via service to backend
    this.tag.NFTName = this.mint.NFTName;
    this.tag.userId = this.mint.CreatorUserId;
    this.tag.tags = this.tags;
    this.addSubscription = this.service.addTags(this.tag).subscribe();
  }

  saveTXNs(): void {
    this.txn.Blockchain = this.mint.Blockchain;
    this.txn.ImageURL = this.mint.Imagebase64;
    this.txn.NFTIdentifier = this.mint.NFTIdentifier;
    this.txn.NFTName = this.mint.NFTName;
    this.txn.NFTTxnHash = this.mint.NFTTxnHash;
    this.txn.Status = 'Minted';

    this.apiService.addTXN(this.txn).subscribe();
  }

  async getIssuer(): Promise<void> {
    //minting according to blockchain
    this.mint.Blockchain = this.formValue('Blockchain');
    this.mint.NFTName = this.formValue('NFTName');;
    this.mint.NftContentURL = this.formValue('NftContentURL');
    this.mint.Imagebase64 = this.hash;
    this.mint.Description = this.formValue('Description');;
    this.svgUpdate.Id = this.hash;

    if (this.mint.Blockchain == 'stellar') {
      //minting if blockchain == stellar
      this.service.createIssuer().subscribe(async (data: any) => {
        this.mint.NFTIssuerPK = data.NFTIssuerPK;
        this.mint.NFTIdentifier = this.mint.NFTIssuerPK;
        
        this.svg.blockchain = 'stellar';
        this.svg.Hash=this.hash
        this.svg.Base64ImageSVG=this.Encoded
        this.apiService.addSVG(this.svg).subscribe();

        if (this.mint.NFTIssuerPK != null) {
          let freighter = new UserWallet();
          freighter = new FreighterComponent(freighter);
          await freighter.initWallelt();
          this.userPK = await freighter.getWalletaddress();
          this.mint.CreatorUserId = this.userPK;
          this.pushTag()
          this.apiService.getEndorsement(this.userPK).subscribe((res: any) => {
            if (res.Status == null || res.Status == '') {
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
                    this.router.navigate(['./signUp'], {
                      queryParams: {
                        data: JSON.stringify(this.mint.Blockchain),
                      },
                    });
                  }
                });
            } else {
              this.sendToMint3();
              this.mintNFT(this.userPK);
            }
          });
        }
      });
    }

    if (this.mint.Blockchain == 'solana') {
      //minting if blockchain == solana
      let phantomWallet = new UserWallet();
      phantomWallet = new PhantomComponent(phantomWallet);
      await phantomWallet.initWallelt();
      this.mint.NFTIssuerPK = phantomWallet.getWalletaddress();
      this.mint.NFTIdentifier = this.mint.NFTIssuerPK;
      this.mint.CreatorUserId = this.mint.NFTIssuerPK;

      this.svg.blockchain = 'solana';
      this.svg.Hash=this.hash
      this.svg.Base64ImageSVG=this.Encoded
      this.apiService.addSVG(this.svg).subscribe();

      this.apiService
        .getEndorsement(this.mint.NFTIssuerPK)
        .subscribe((res: any) => {
          if (res.Status == null || res.Status == '') {
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
                  this.router.navigate(['./signUp'], {
                    queryParams: { data: JSON.stringify(this.mint.Blockchain) },
                  });
                }
              });
          } else {
            this.sendToMint3();
            this.mintNftSolana(this.mint.NFTIssuerPK);
          }
        });
    }

    if (this.mint.Blockchain == 'ethereum') {
      //minting if blockchain == ethereum
      this.loaderService.isLoading.next(true);
      let metamask = new UserWallet();
      metamask = new MetamaskComponent(metamask);
      await metamask.initWallelt();
      this.mint.NFTIssuerPK = metamask.getWalletaddress();
      this.mint.DistributorPK = metamask.getWalletaddress();
      this.mint.MintedContract = environment.contractAddressNFTEthereum;
      this.mint.MarketContract = environment.contractAddressMKEthereum;
      this.mint.CreatorUserId = this.mint.DistributorPK;
     
      this.svg.Hash=this.hash
      this.svg.Base64ImageSVG=this.Encoded
      this.svg.blockchain = 'ethereum';
      this.apiService.addSVG(this.svg).subscribe();


      this.apiService
        .getEndorsement(this.mint.DistributorPK)
        .subscribe((res: any) => {
          if (res.Status == null || res.Status == '') {
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
                  this.router.navigate(['./signUp'], {
                    queryParams: { data: JSON.stringify(this.mint.Blockchain) },
                  });
                }
              });
          } else {
            this.emint
              .mintInEthereum(
                this.mint.NFTIssuerPK,
                this.mint.NFTName,
                this.mint.Description,
                this.mint.NftContentURL,
                this.mint.Imagebase64
              )
              .then(async (res) => {
                this.mint.NFTTxnHash = res.transactionHash;
                this.tokenId = parseInt(res.logs[0].topics[3]);
                this.mint.NFTIdentifier = this.tokenId.toString();
                this.sendToMint3();
                this.saveContractInGateway();
                this.saveTXNs();
              });
          }
        });
    }

    if (this.mint.Blockchain == 'polygon') {
      //minting if blockchain == polygon
      let metamask = new UserWallet();
      metamask = new MetamaskComponent(metamask);
      await metamask.initWallelt();
      this.mint.NFTIssuerPK = metamask.getWalletaddress();
      this.mint.DistributorPK = metamask.getWalletaddress();
      this.mint.MintedContract = environment.contractAddressNFTPolygon;
      this.mint.MarketContract = environment.contractAddressMKPolygon;
      this.mint.CreatorUserId = this.mint.DistributorPK;
     
      this.svg.Hash=this.hash
      this.svg.Base64ImageSVG=this.Encoded
      this.svg.blockchain = 'polygon';
      this.apiService.addSVG(this.svg).subscribe();

      this.apiService
        .getEndorsement(this.mint.DistributorPK)
        .subscribe((res: any) => {
          if (res.Status == null || res.Status == '') {
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
                  this.router.navigate(['./signUp'], {
                    queryParams: { data: JSON.stringify(this.mint.Blockchain) },
                  });
                }
              });
          } else {
            this.pmint
              .mintInPolygon(this.mint.NFTIssuerPK, this.mint.Imagebase64)
              .then((res) => {
                this.mint.NFTTxnHash = res.transactionHash;
                this.tokenId = parseInt(res.logs[0].topics[3]);
                this.mint.NFTIdentifier = this.tokenId.toString();
                //this.apiService.updateSVGBlockchain(this.svgUpdate)
                this.sendToMint3();
                this.saveContractInGateway();
                this.saveTXNs();
                this.loaderService.isLoading.next(false);
              });
          }
        });
    }
  }

  saveContractInGateway() {
    this.contract.Asset_code = this.mint.NFTName;
    this.contract.ArtistLink = this.mint.ArtistProfileLink;
    this.contract.ArtistName = this.mint.ArtistName;
    this.contract.Categories = this.mint.Categories;
    this.contract.Collection = this.mint.Collection;
    this.contract.Copies = this.mint.Copies;
    this.contract.Description = this.mint.Description;
    this.contract.MarketplaceContract = this.mint.MarketContract;
    this.contract.MintNFTTxn = this.mint.NFTTxnHash;
    this.contract.NFTBlockChain = this.mint.Blockchain;
    this.contract.NFTContract = this.mint.MintedContract;
    this.contract.NFTLinks = this.mint.NftContentURL;
    this.contract.NFTURL = this.mint.Imagebase64;
    this.contract.OwnerPK = this.mint.CreatorUserId;
    this.contract.Tags = this.tags;
    this.contract.Identifier = this.mint.NFTIdentifier;
    this.service.addNFTGW(this.contract).subscribe((res) => {
      // this.router.navigate(['./mint3'], {
      //   queryParams: { data: JSON.stringify(this.mint.Blockchain) },
      // });
      this.proceed.emit({});
    });
  }

  updateMinter(): void {
    if (this.minter.NFTIssuerPK != null) {
      this.service.updateNFTSolana(this.minter).subscribe((res) => {
        this.saveTXNs();
        this.proceed.emit({});
      });
    } else {
      this.Minter();
    }
  }

  updateStellarTXN(): void {
    if (this.stxn.NFTTxnHash != null) {
      this.service.updateTXNStellar(this.stxn).subscribe((res) => {
        this.saveTXNs();
       this.proceed.emit({});

      });
    } else {
      this.TXNStellar();
    }
  }

  Minter(): void {
    if (this.mint.Imagebase64 != null) {
      this.minter.ImageBase64 = this.mint.Imagebase64;
      this.minter.Blockchain = this.mint.Blockchain;
      this.service
        .getMinter(this.minter.ImageBase64, this.minter.Blockchain)
        .subscribe((data: any) => {
          if (data == null) {
            this.Minter();
          }
          this.mint.NFTIssuerPK = data.NFTIssuerPK;
          this.mint.NFTTxnHash = data.NFTTxnHash;
          this.minter.NFTIssuerPK = this.mint.NFTIssuerPK;
          this.minter.NFTTxnHash = this.mint.NFTTxnHash;
          this.minter.NFTIdentifier = data.NFTIdentifier;
          this.distributor = data.CreatorUserID;
          this.updateMinter();
        });
    }
  }

  TXNStellar(): void {
    if (this.mint.Imagebase64 != null) {
      this.stxn.ImageBase64 = this.mint.NftContentURL;
      this.stxn.Blockchain = this.mint.Blockchain;
      this.service
        .getStellarTXN(this.stxn.ImageBase64, this.stxn.Blockchain)
        .subscribe((txn: any) => {
          if (txn == null) {
            this.TXNStellar();
          }
          this.mint.NFTTxnHash = txn.NFTTxnHash;
          this.stxn.NFTTxnHash = this.mint.NFTTxnHash;
          this.updateStellarTXN();
        });
    }
  }

  mintNFT(userPK: string): void {
    //minting nft using stellar
    if (this.mint.CreatorUserId != null) {
      //step 1. - change trust by distributor
      this.trustService
        .changeTrustByDistributor(
          this.mint.NFTName,
          this.mint.NFTIssuerPK,
          userPK
        )
        .then((transactionResult: any) => {
          if (transactionResult.successful) {
            this.service
              .minNFTStellar(
                //step 2. - mint
                transactionResult.successful,
                this.mint.NFTIssuerPK,
                userPK,
                this.mint.NFTName,
                this.mint.Imagebase64,
                this.mint.Description,
                this.mint.Collection,
                this.mint.Blockchain,
                this.mint.Tags,
                this.mint.Categories,
                this.mint.Copies,
                this.mint.NftContentURL,
                transactionResult.created_at,
                this.mint.ArtistName,
                this.mint.ArtistProfileLink
              )
              .then((res) => {
                this.TXNStellar();
              })
              .then((nft) => {
                if (this.isLoadingPresent) {
                  this.dissmissLoading();
                }
                //this.mint.NFTName="";
              })
              .catch((error) => {
                if (this.isLoadingPresent) {
                  this.dissmissLoading();
                }
              });
          } else {
            if (this.isLoadingPresent) {
              this.dissmissLoading();
            }
          }
        });
    } else {
      console.log('User PK not connected or not endorsed');
    }
  }

  dissmissLoading() {
    this.isLoadingPresent = false;
    this.loading.dismiss();
  }
  ngOnInit(): void {
    
  }
  ngOnChanges(): void {
      console.log("inside mint 2")
      console.log("wallet and email is: ",this.wallet, this.email)
      if(this.wallet=="metamask"){
        console.log("---------metamaask------")
      this.polygon=false
      this.stellar=true
      this.ethereum=false
      this.solana=true
       
      }
      if(this.wallet=="phantom"){
        console.log("---------phantom------")
        this.polygon=true
      this.stellar=true
      this.ethereum=true
      this.solana=false
      }
      if(this.wallet=="freighter"){
        console.log("---------frighter------")
        this.polygon=true
      this.stellar=false
      this.ethereum=true
      this.solana=true
      }
       if (this.email != null) {
      this.serviceCol
        .getCollectionName(this.email)
        .subscribe((data: any) => {
          this.CollectionList = data;
        });
    } else {
      console.log('User PK not connected or not endorsed');
    }

      //  })
    // });


    this.controlGroup = new FormGroup({
      //validation

      NFTName: new FormControl(this.mint.NFTName, Validators.required),
      Description: new FormControl(this.mint.Description, Validators.required),
      Collection: new FormControl(this.mint.Collection, Validators.required),
      Blockchain: new FormControl(this.mint.Blockchain, Validators.required),
      Categories: new FormControl(this.mint.Categories, Validators.required),
      Copies: new FormControl(this.mint.Copies, Validators.required),
      Tags: this.tagCtrl,
      NftContentURL: new FormControl(this.mint.NftContentURL),
      ArtistName: new FormControl(this.mint.ArtistName),
      ArtistProfileLink: new FormControl(this.mint.ArtistProfileLink),
      Issuer: new FormControl(this.mint.NFTIssuerPK),
    });

    this.controlGroup.get('Blockchain')?.setValue('ethereum');
    this.controlGroup.get('Collection')?.setValue('Collection');
  }

  private formValue(controlName: string): any {
    return this.controlGroup.get(controlName)!.value;
  }

  mintNftSolana(ownerPK: string) {
    return new Promise((resolve, reject) => {
      this.service
        .minNFTSolana(
          ownerPK, //distributer Public key
          this.mint.NFTName,
          this.mint.Imagebase64,
          this.mint.Description,
          this.mint.Collection,
          this.mint.Blockchain,
          this.mint.Tags,
          this.mint.Categories,
          this.mint.Copies,
          this.mint.NftContentURL,
          this.mint.ArtistName,
          this.mint.ArtistProfileLink
        )
        .then((nft) => {
          if (this.isLoadingPresent) {
            this.dissmissLoading();
          }
          this.Minter();
        })
        .catch((error) => {
          if (this.isLoadingPresent) {
            this.dissmissLoading();
          }
        });
    });
  }

  ///////////////////////////////////////

  add(event: any): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      if (this.tags.length < 4) {
        this.tags.push(value);

      }
    }

    // Clear the input value
    event.chipInput!.clear();

    this.tagCtrl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.tags.indexOf(fruit);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  selected(event: any): void {
    this.tags.push(event.option.viewValue);
    this.tagsInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.alltags.filter((fruit) =>
      fruit.toLowerCase().includes(filterValue)
    );
  }

  public create() {
    const vals = {
      Name: this.controlGroup.get('NFTName')?.value,
      Description: this.controlGroup.get('Description')?.value,
      Collection: this.controlGroup.get('Collection')?.value,
      Blockchain: this.controlGroup.get('Blockchain')?.value,
      Tags: this.tags,
    };
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
    const unwantedText = 'data:image/svg+xml;base64,';
    this.base64 = this.base64.replace(unwantedText, '');
    let encoded: string = atob(this.base64);
    this.Encoded = encoded;

    this.hash = CryptoJS.SHA256(encoded).toString(CryptoJS.enc.Hex);
    this.updateHTML();
  }

  //update html
  public updateHTML() {
    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = (_event) => {
      this.img = reader.result;
      this.imageSrc = this._sanitizer.bypassSecurityTrustResourceUrl(this.img);
    };
  }

  //trigger file input click event
  public triggerClick() {
    let el: HTMLElement = this.fileUpload.nativeElement;
    el.click();
  }

  @HostListener('dragover', ['$event']) public onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.onHover = true;
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.onHover = false;
  }

  @HostListener('drop', ['$event']) public onDrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.onHover = false;
    let files = evt.dataTransfer.files;
    let valid_files: Array<File> = files;
    this.file = valid_files[0];
    this.uploadImage(evt);
  }
}
