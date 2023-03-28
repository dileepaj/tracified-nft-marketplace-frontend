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
//import { Canvg } from 'canvg';
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
import { BlockchainConfig, environment } from 'src/environments/environment';
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
import { COMMA, ENTER, TAB } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Description } from '@ethersproject/properties';
import { SHA256, enc } from 'crypto-js';
import { CollectionService } from 'src/app/services/api-services/collection.service';
import { CodeviewComponent } from '../codeview/codeview.component';
import { MatDialog } from '@angular/material/dialog';
import {
  ConfirmDialogText,
  PendingDialogText,
  SnackBarText,
} from 'src/app/models/confirmDialog';
import { TrustByDistributorService } from 'src/app/services/blockchain-services/stellar-services/albedo-transactions/trust-by-distributor.service';
import { TransferNftService } from 'src/app/services/blockchain-services/solana-services/transfer-nft.service';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import albedo from '@albedo-link/intent';
import { TransferServiceChargeService } from 'src/app/services/blockchain-services/solana-services/transfer-service-charge.service';
import {
  clusterApiUrl,
  Connection,
  Transaction as solanaTransaction,
} from '@solana/web3.js';
import { Collection } from 'src/app/models/collection';
import { FirebaseAnalyticsService } from 'src/app/services/firebase/firebase-analytics.service';

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
  @ViewChild('thumbDnd') thumbDnd: ElementRef<HTMLElement>;
  @ViewChild('thumbUpload') thumbUpload: ElementRef<HTMLInputElement>;
  @Output() proceed: EventEmitter<any> = new EventEmitter();
  @Input() email: string;
  @Input() wallet: string;
  @Input() key: string;
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
    '',
    false,
    false,
    '',
    ''
  );
  minter: Minter = new Minter('', '', '', '', '');
  tokenId: number;
  txn: TXN = new TXN('', '', '', '', '', '', '');
  svgUpdate: UpdateSVG = new UpdateSVG('', '');
  svg: SVG = new SVG('', '', 'NA', '', '');
  Decryption: any;
  readonly network: any = BlockchainConfig.solananetworkURL;
  dec: string;
  imageSrc: any;
  userPK: string;
  distributor: any;
  separatorKeysCodes: number[] = [TAB, COMMA, ENTER];
  tagCtrl: FormControl = new FormControl('');
  filteredtags: Observable<string[]>;
  tags: string[] = [];
  alltags: string[] = [];
  file: File;
  base64: string = '';
  img: any = '';
  Encoded: string;
  hash: any;
  onHover: boolean = false;
  CollectionList: Collection[] = [];
  ethereum: boolean;
  stellar: boolean;
  polygon: boolean;
  solana: boolean;
  name: string;
  base64textString: string;
  type: string;
  thumbSrc: any;
  thumbFile: File;
  thumbnail: any;
  thumbType: string;
  thumbEncoded: string;
  thumbHash: any;
  pendingDialog: any;

  imageChangedEvent: any = '';
  croppedImage: any = '';
  cropperStat: boolean = false;
  showthumbnailContainer: boolean = true;
  transaction: any;
  nftNameLimit: number = 12;
  nftNameRemainingChars: number = 12;
  descriptionLimit: number = 500;
  descriptionRemainingChars: number = 500;
  flag: boolean = false;

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
    public transfer: TransferNftService,
    private trust: TrustByDistributorService,
    private servicecharge: TransferServiceChargeService,
    private firebaseanalytics: FirebaseAnalyticsService
  ) {
    this.filteredtags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) =>
        tag ? this._filter(tag) : this.alltags.slice()
      )
    );
  }

  sendToMint3(): void {
    //getting form data to mint and post
    this.mint.Timestamp = new Date().toString();
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
      this.addSubscription = this.service
        .addNFTBE(this.mint)
        .subscribe((res) => {
          this.pushOwner(); //calling function
          this.pushTag(); //calling fnction
        });
    }

    this.proceed.emit({
      email: this.email,
      blockchain: this.mint.Blockchain,
      user: this.mint.CreatorUserId,
    });
  }
  pushOwner(): void {
    //posting owner data via service to backend
    this.own.NFTIdentifier = this.mint.NFTIdentifier;
    this.own.CurentOwnerPK = this.mint.CreatorUserId;
    this.own.PreviousOwnerPK = 'none';
    this.own.Status = this.mint.Status;
    this.own.OwnerRevisionID = 1;
    if (this.mint.CreatorUserId != null) {
      this.addSubscription = this.service.addOwner(this.own).subscribe();
    }
  }

  public openDialog() {
    if (
      this.file.type == 'image/jpeg' ||
      this.file.type == 'image/jpg' ||
      this.file.type == 'image/png'
    ) {
      this.dialogService.openNftPreview({ image: this.imageSrc });
    } else {
      this.dialogService.openCodeView(this.Encoded);
    }
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
    this.txn.Time = new Date().toString();

    this.apiService.addTXN(this.txn).subscribe();
  }

  async getIssuer(): Promise<void> {
    if (this.flag == false) {
      //minting according to blockchain
      this.firebaseanalytics.logEvent('button_click', { name: 'Create' });
      this.firebaseanalytics.logEvent('Start_mint', {
        blockchain: this.mint.Blockchain,
      });
      this.mint.Blockchain = this.formValue('Blockchain');
      this.mint.NFTName = this.formValue('NFTName');
      this.mint.NftContentURL = this.formValue('NftContentURL');
      this.mint.Imagebase64 = this.hash;
      this.mint.AttachmentType = this.type;
      this.mint.Description = this.formValue('Description');
      this.mint.thumbnail = this.thumbnail;
      this.svgUpdate.Id = this.hash;

      if (
        !this.mint.Imagebase64 ||
        !this.mint.thumbnail ||
        this.mint.Blockchain === '' ||
        this.mint.NFTName === '' ||
        this.mint.Description === '' ||
        this.formValue('Collection') === '' ||
        this.formValue('ArtistName') === '' ||
        this.tags[0] == null
      ) {
        this.snackbar.openSnackBar(
          SnackBarText.CONTACT_US_FIELDS_EMPTY_WARNING,
          'info'
        );
        return;
      } else {
        this.flag = true;
      }

      if (this.mint.Blockchain == 'stellar') {
        const nftnameRegex = /^[A-Za-z0-9]+$/
        if(!nftnameRegex.test(this.mint.NFTName)){
          this.snackbar.openSnackBar(
            "NFT name cannot contain spaces or special characters.",
            "info"
          );
          this.flag=false;
          return
        }
        //minting if blockchain == stellar
        this.service.createIssuer().subscribe(async (data: any) => {
          this.mint.NFTIssuerPK = data.NFTIssuerPK;
          this.mint.NFTIdentifier = this.mint.NFTIssuerPK;

          this.svg.blockchain = 'stellar';
          this.svg.Hash = this.hash;
          this.svg.Base64ImageSVG = this.Encoded;
          this.svg.AttachmentType = this.type;
          // this.svg.thumbnail=this.thumbnail
          //  this.apiService.addSVG(this.svg).subscribe();

          if (this.mint.NFTIssuerPK != null) {
            let details = navigator.userAgent;

            let regexp = /android|iphone|kindle|ipad/i;
      
            let isMobileDevice = await regexp.test(details);
      
            if (isMobileDevice) {
              await albedo
              .publicKey({
                require_existing: true,
              }).catch(err=>{
                this.flag=false;
                this.snackbar.openSnackBar("User closed transaction","error");
              })
              .then((res: any) => {
                this.userPK = res.pubkey;
                this.mint.CreatorUserId = this.userPK;
                this.pushTag();
                this.dialogService
                  .confirmMintDialog({
                    promtHeading: 'You are Minting',
                    nftName: this.mint.NFTName,
                    thumbnail: this.mint.thumbnail,
                    feeTypeName: 'Service Fee',
                    serviceFee: 0.005,
                    total: 0.005,
                    blockchain: this.svg.blockchain,
                    buttonAction: 'Mint Now',
                  })
                  .subscribe((res) => {
                    if (res) {
                      this.apiService
                        .getEndorsement(this.userPK)
                        .subscribe((result: any) => {
                          if (
                            result.Status == null ||
                            result.Status == 'Declined' ||
                            result.Status == ''
                          ) {
                            this.dialogService
                              .confirmDialog({
                                title:
                                  ConfirmDialogText.MINT1_PK_ENDORSMENT_TITLE,
                                message:
                                  ConfirmDialogText.MINT1_PK_ENDORSMENT_MESSAGE,
                                confirmText: ConfirmDialogText.CONFIRM_BTN,
                                cancelText: ConfirmDialogText.CANCEL_BTN,
                              })
                              .subscribe((res) => {
                                if (res) {
                                  let arr: any = [
                                    this.mint.Blockchain,
                                    this.email,
                                    this.wallet,
                                  ];
                                  this.router.navigate(['./signUp'], {
                                    queryParams: {
                                      data: JSON.stringify(arr),
                                    },
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
                            this.pendingDialog =
                              this.dialogService.mintingDialog({
                                processTitle: 'Minting',
                                message:
                                  PendingDialogText.MINTING_IN_PROGRESS,
                                nftName: this.mint.NFTName,
                                thumbnail: this.mint.thumbnail,
                              });
                            this.pendingDialog
                              .afterClosed()
                              .subscribe((success) => {
                                if (success) {
                                  this.firebaseanalytics.logEvent(
                                    'minting_status',
                                    {
                                      blockchain: this.mint.Blockchain,
                                      result: 'Success',
                                    }
                                  );
                                  this.snackbar.openSnackBar(
                                    SnackBarText.MINTING_SUCCESSFUL_MESSAGE,
                                    'success'
                                  );
                                }
                              });

                            this.mintNFTOnAlbedo(this.userPK, () => {
                              this.pendingDialog.close(false);
                              this.flag = false;
                            });
                          }
                        });
                    }
                    else{
                      this.flag=false;
                    }
                  });
              });
            }else{
              let freighter = new UserWallet();
              freighter = new FreighterComponent(freighter);
              await freighter.initWallelt();
              this.userPK = await freighter.getWalletaddress();
              this.mint.CreatorUserId = this.userPK;
              this.pushTag();
              this.dialogService
                .confirmMintDialog({
                  promtHeading: 'You are Minting',
                  nftName: this.mint.NFTName,
                  thumbnail: this.mint.thumbnail,
                  feeTypeName: 'Service Fee',
                  serviceFee: 0.005,
                  total: 0.005,
                  blockchain: this.svg.blockchain,
                  buttonAction: 'Mint Now',
                })
                .subscribe((res) => {
                  if (res) {
                    this.apiService
                      .getEndorsement(this.userPK)
                      .subscribe((result: any) => {
                        if (
                          result.Status == '' ||
                          result.Status == 'Declined' ||
                          result.Status == null
                        ) {
                          this.dialogService
                            .confirmDialog({
                              title:
                                ConfirmDialogText.MINT1_PK_ENDORSMENT_TITLE,
                              message:
                                ConfirmDialogText.MINT1_PK_ENDORSMENT_MESSAGE,
                              confirmText: ConfirmDialogText.CONFIRM_BTN,
                              cancelText: ConfirmDialogText.CANCEL_BTN,
                            })
                            .subscribe((res) => {
                              if (res) {
                                let arr: any = [
                                  this.mint.Blockchain,
                                  this.email,
                                  this.wallet,
                                ];
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
                          this.pendingDialog = this.dialogService.mintingDialog(
                            {
                              processTitle: 'Minting',
                              message: PendingDialogText.MINTING_IN_PROGRESS,
                              nftName: this.mint.NFTName,
                              thumbnail: this.mint.thumbnail,
                            }
                          );
                          this.pendingDialog
                            .afterClosed()
                            .subscribe((success) => {
                              if (success) {
                                this.firebaseanalytics.logEvent(
                                  'minting_status',
                                  {
                                    blockchain: this.mint.Blockchain,
                                    result: 'Success',
                                  }
                                );
                                this.snackbar.openSnackBar(
                                  SnackBarText.MINTING_SUCCESSFUL_MESSAGE,
                                  'success'
                                );
                              }
                            });
                          this.mintNFT(this.userPK, () => {
                            this.pendingDialog.close(false);
                            this.flag = false;
                          });
                        }
                      });
                  } else {
                    this.flag = false;
                  }
                });
            }
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
        this.mint.thumbnail = this.thumbnail;
        this.svg.blockchain = 'solana';
        this.svg.Hash = this.hash;
        this.svg.Base64ImageSVG = this.Encoded;
        this.svg.AttachmentType = this.type;
        // this.apiService.addSVG(this.svg).subscribe();
        this.dialogService
          .confirmMintDialog({
            promtHeading: 'You are Minting',
            nftName: this.mint.NFTName,
            thumbnail: this.mint.thumbnail,
            feeTypeName: 'Service Fee',
            serviceFee: 0.00002,
            total: 0.00002,
            blockchain: this.svg.blockchain,
            buttonAction: 'Mint Now',
          })
          .subscribe((res) => {
            if (res) {
              this.apiService
                .getEndorsement(this.mint.NFTIssuerPK)
                .subscribe((result: any) => {
                  if (
                    result.Status == null ||
                    result.Status == 'Declined' ||
                    result.Status == ''
                  ) {
                    this.dialogService
                      .confirmDialog({
                        title: ConfirmDialogText.MINT1_PK_ENDORSMENT_TITLE,
                        message: ConfirmDialogText.MINT1_PK_ENDORSMENT_MESSAGE,
                        confirmText: ConfirmDialogText.CONFIRM_BTN,
                        cancelText: ConfirmDialogText.CANCEL_BTN,
                      })
                      .subscribe((res) => {
                        if (res) {
                          let arr: any = [
                            this.mint.Blockchain,
                            this.email,
                            this.wallet,
                          ];
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
                    this.pendingDialog = this.dialogService.mintingDialog({
                      processTitle: 'Minting',
                      message: PendingDialogText.MINTING_IN_PROGRESS,
                      nftName: this.mint.NFTName,
                      thumbnail: this.mint.thumbnail,
                    });
                    this.pendingDialog.afterClosed().subscribe((success) => {
                      if (success) {
                        this.firebaseanalytics.logEvent('minting_status', {
                          blockchain: this.mint.Blockchain,
                          result: 'Success',
                        });
                        this.snackbar.openSnackBar(
                          SnackBarText.MINTING_SUCCESSFUL_MESSAGE,
                          'success'
                        );
                      }
                    });
                    this.mintNftSolana(this.mint.NFTIssuerPK, () => {
                      this.pendingDialog.close(false);
                      this.flag = false;
                    });
                  }
                });
            } else {
              this.flag = false;
            }
          });
      }

      if (this.mint.Blockchain == 'ethereum') {
        let metamask = new UserWallet();
        metamask = new MetamaskComponent(metamask);
        await metamask.initWallelt();
        this.mint.NFTIssuerPK = metamask.getWalletaddress();
        this.mint.DistributorPK = metamask.getWalletaddress();
        this.mint.MintedContract = environment.contractAddressNFTEthereum;
        this.mint.MarketContract = environment.contractAddressMKEthereum;
        this.mint.CreatorUserId = this.mint.DistributorPK;
        this.mint.thumbnail = this.thumbnail;
        this.svg.Hash = this.hash;
        this.svg.Base64ImageSVG = this.Encoded;
        this.svg.blockchain = 'ethereum';
        this.svg.AttachmentType = this.type;
        //  this.apiService.addSVG(this.svg).subscribe();
        this.dialogService
          .confirmMintDialog({
            promtHeading: 'You are Minting',
            nftName: this.mint.NFTName,
            thumbnail: this.mint.thumbnail,
            feeTypeName: 'Service Fee',
            serviceFee: 0,
            total: 0,
            blockchain: this.svg.blockchain,
            buttonAction: 'Mint Now',
          })
          .subscribe((res) => {
            if (res) {
              this.apiService
                .getEndorsement(this.mint.DistributorPK)
                .subscribe((result: any) => {
                  if (
                    result.Status == null ||
                    result.Status == 'Declined' ||
                    result.Status == ''
                  ) {
                    this.dialogService
                      .confirmDialog({
                        title: ConfirmDialogText.MINT1_PK_ENDORSMENT_TITLE,
                        message: ConfirmDialogText.MINT1_PK_ENDORSMENT_MESSAGE,
                        confirmText: ConfirmDialogText.CONFIRM_BTN,
                        cancelText: ConfirmDialogText.CANCEL_BTN,
                      })
                      .subscribe((res) => {
                        if (res) {
                          let arr: any = [
                            this.mint.Blockchain,
                            this.email,
                            this.wallet,
                          ];
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
                    const dialog = this.dialogService.mintingDialog({
                      processTitle: 'Minting',
                      message: PendingDialogText.MINTING_IN_PROGRESS,
                      nftName: this.mint.NFTName,
                      thumbnail: this.mint.thumbnail,
                    });
                    this.emint
                      .mintInEthereum(
                        this.mint.NFTIssuerPK,
                        this.mint.NFTName,
                        this.mint.Description,
                        this.mint.NftContentURL,
                        this.mint.Imagebase64,
                        () => {
                          dialog.close();
                          this.flag = false;
                        }
                      )
                      .then(async (res) => {
                        try {
                          this.mint.NFTTxnHash = res.transactionHash;
                          this.tokenId = parseInt(res.logs[0].topics[3]);
                          this.mint.NFTIdentifier = this.tokenId.toString();
                          this.sendToMint3();
                          this.saveContractInGateway();
                          this.saveTXNs();
                          this.apiService.addSVG(this.svg).subscribe();
                          dialog.close();
                          this.snackbar.openSnackBar(
                            SnackBarText.MINTING_SUCCESSFUL_MESSAGE,
                            'success'
                          );
                          this.flag = false;
                        } catch (err) {
                          this.snackbar.openSnackBar(
                            'Something went wrong, please try again! More information: ' +
                              err,
                            'error'
                          );
                          this.flag = false;
                        }
                      });
                  }
                });
            } else {
              this.flag = false;
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
        this.mint.thumbnail = this.thumbnail;
        this.svg.Hash = this.hash;
        this.svg.Base64ImageSVG = this.Encoded;
        this.svg.blockchain = 'polygon';
        this.svg.AttachmentType = this.type;
        // this.apiService.addSVG(this.svg).subscribe();
        this.dialogService
          .confirmMintDialog({
            promtHeading: 'You are Minting',
            nftName: this.mint.NFTName,
            thumbnail: this.mint.thumbnail,
            feeTypeName: 'Service Fee',
            serviceFee: 0,
            total: 0,
            blockchain: this.svg.blockchain,
            buttonAction: 'Mint Now',
          })
          .subscribe((res) => {
            if (res) {
              this.apiService
                .getEndorsement(this.mint.DistributorPK)
                .subscribe((result: any) => {
                  if (
                    result.Status == null ||
                    result.Status == 'Declined' ||
                    result.Status == ''
                  ) {
                    this.dialogService
                      .confirmDialog({
                        title: ConfirmDialogText.MINT1_PK_ENDORSMENT_TITLE,
                        message: ConfirmDialogText.MINT1_PK_ENDORSMENT_MESSAGE,
                        confirmText: ConfirmDialogText.CONFIRM_BTN,
                        cancelText: ConfirmDialogText.CANCEL_BTN,
                      })
                      .subscribe((res) => {
                        if (res) {
                          let arr: any = [
                            this.mint.Blockchain,
                            this.email,
                            this.wallet,
                          ];
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
                    const dialog = this.dialogService.mintingDialog({
                      processTitle: 'Minting',
                      message: PendingDialogText.MINTING_IN_PROGRESS,
                      nftName: this.mint.NFTName,
                      thumbnail: this.mint.thumbnail,
                    });
                    try {
                      this.pmint
                        .mintInPolygon(
                          this.mint.NFTIssuerPK,
                          this.mint.Imagebase64,
                          () => {
                            dialog.close();
                            this.flag = false;
                          }
                        )
                        .then((res) => {
                          try {
                            this.mint.NFTTxnHash = res.transactionHash;
                            this.tokenId = parseInt(res.logs[0].topics[3]);
                            this.mint.NFTIdentifier = this.tokenId.toString();
                            this.sendToMint3();
                            this.saveContractInGateway();
                            this.saveTXNs();
                            this.apiService.addSVG(this.svg).subscribe();
                            dialog.close();
                            this.snackbar.openSnackBar(
                              SnackBarText.MINTING_SUCCESSFUL_MESSAGE,
                              'success'
                            );
                            this.flag = false;
                            this.loaderService.isLoading.next(false);
                          } catch (err) {
                            this.snackbar.openSnackBar(
                              'Something went wrong, please try again! More information: ' +
                                err,
                              'error'
                            );
                            this.flag = false;
                          }
                        });
                    } catch (err) {
                      dialog.close();
                      this.snackbar.openSnackBar(
                        'Something went wrong, please try again! More information: ' +
                          err,
                        'error'
                      );
                      this.flag = false;
                    }
                  }
                });
            } else {
              this.flag = false;
            }
          });
      }
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
      this.proceed.emit({
        blockchain: this.mint.Blockchain,
        user: this.mint.CreatorUserId,
      });
    });
  }

  updateMinter(): void {
    if (this.minter.NFTIssuerPK != null) {
      this.service.updateNFTSolana(this.minter).subscribe((res) => {
        this.pendingDialog.close(true);
        this.proceed.emit({
          blockchain: this.mint.Blockchain,
          user: this.mint.CreatorUserId,
        });
      });
    } else {
      this.Minter();
    }
  }

  updateStellarTXN(): void {
    if (this.stxn.NFTTxnHash != null) {
      this.service.updateTXNStellar(this.stxn).subscribe((res) => {
        this.pendingDialog.close(true);

        this.proceed.emit({
          blockchain: this.mint.Blockchain,
          user: this.mint.CreatorUserId,
        });
      });
    } else {
      try {
        this.TXNStellar();
      } catch (err) {
        this.flag = false;
      }
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
          this.mint.NFTIdentifier = data.NFTIdentifier;
          this.minter.NFTIdentifier = data.NFTIdentifier;
          this.distributor = data.CreatorUserID;
          this.transfer
            .createServiceATAforTransfer(
              environment.fromWallet,
              this.mint.CreatorUserId,
              data.NFTIssuerPK
            )
            .subscribe((res: any) => {
              try {
                this.sendToMint3();
                this.saveTXNs();
                this.apiService.addSVG(this.svg).subscribe((res) => {
                  this.updateMinter();
                });
              } catch (err) {
                this.snackbar.openSnackBar(
                  'Something went wrong, please try again! More information: ' +
                    err,
                  'error'
                );
                this.flag = false;
              }
            });
        });
    }
  }

  TXNStellar(): void {
    if (this.mint.Imagebase64 != null) {
      this.stxn.ImageBase64 = this.mint.Imagebase64;
      this.stxn.Blockchain = this.mint.Blockchain;
      this.service
        .getStellarTXN(this.stxn.ImageBase64, this.stxn.Blockchain)
        .subscribe((txn: any) => {
          if (txn == null) {
            this.TXNStellar();
          }
          this.mint.NFTTxnHash = txn.NFTTxnHash;
          this.stxn.NFTTxnHash = this.mint.NFTTxnHash;
          this.apiService.addSVG(this.svg).subscribe((res) => {
            this.updateStellarTXN();
          });
          this.saveTXNs();
        });
    }
  }

  mintNFT(userPK: string, _callback?: any) {
    //minting nft using stellar
    if (this.mint.CreatorUserId != null) {
      //step 1. - change trust by distributor
      try {
        this.trustService
          .changeTrustByDistributor(
            this.mint.NFTName,
            this.mint.NFTIssuerPK,
            userPK,
            () => {
              this.flag = false;
              this.pendingDialog.close(false);
            }
          )
          .then((transactionResult: any) => {
            this.sendToMint3();
            try {
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
                    try {
                      this.TXNStellar();
                    } catch (err) {
                      _callback();
                      this.snackbar.openSnackBar(
                        'Something went wrong, please try again! More information: ' +
                          err,
                        'error'
                      );
                      this.flag = false;
                    }
                  })
                  .then((nft) => {
                    if (this.isLoadingPresent) {
                      this.dissmissLoading();
                    }
                    // this.pendingDialog(true);
                  })
                  .catch((error) => {
                    if (this.isLoadingPresent) {
                      this.dissmissLoading();
                    }
                    this.pendingDialog(false);
                    this.flag = false;
                  });
              } else {
                if (this.isLoadingPresent) {
                  this.dissmissLoading();
                }
                this.pendingDialog(false);
                this.flag = false;
              }
            } catch (err) {
              this.snackbar.openSnackBar(
                'Something went wrong, please try again! More information: ' +
                  err,
                'error'
              );
              this.flag = false;
            }
          });
      } catch (err) {
        this.flag = false;
      }
    } else {
      this.snackbar.openSnackBar(
        'User PK not connected or not endorsed',
        'info'
      );
    }
  }

  mintNFTOnAlbedo(userPK: string, _callback?: any) {
    //minting nft using stellar
    if (this.mint.CreatorUserId != null) {
      //step 1. - change trust by distributor
      this.trust
        .changeTrustByDistributor(
          this.mint.NFTName,
          this.mint.NFTIssuerPK,
          userPK,
          ()=>{
            this.flag=false;
            this.snackbar.openSnackBar("Transaction Failed: User closed Wallet","error")
            this.pendingDialog.close(false);
          }
        )
        .then((transactionResult: any) => {
          this.sendToMint3();
          try {
            this.service
              .minNFTStellar(
                //step 2. - mint
                true,
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
                Date().toString(),
                this.mint.ArtistName,
                this.mint.ArtistProfileLink
              )
              .then((res) => {
                try {
                  this.TXNStellar();
                } catch (err) {
                  _callback();
                  this.snackbar.openSnackBar(
                    'Something went wrong, please try again! More information: ' +
                      err,
                    'error'
                  );
                  this.flag = false;
                }
              })
              .then((nft) => {
                if (this.isLoadingPresent) {
                  this.dissmissLoading();
                }
                // this.pendingDialog.close(true);
              })
              .catch((error) => {
                if (this.isLoadingPresent) {
                  this.dissmissLoading();
                }
                this.pendingDialog.close(false);
              });
          } catch (err) {
            this.snackbar.openSnackBar(
              'Something went wrong, please try again! More information: ' +
                err,
              'error'
            );
            this.flag = false;
          }
        });
    } else {
      this.snackbar.openSnackBar(
        'User PK not connected or not endorsed',
        'info'
      );
      this.pendingDialog.close(false);
    }
  }

  dissmissLoading() {
    this.isLoadingPresent = false;
    this.loading.dismiss();
  }
  ngOnInit(): void {
    this.firebaseanalytics.logEvent('page_load', { page_name: 'minting_page' });
  }
  ngOnChanges(): void {
    if (this.wallet == 'metamask') {
      this.polygon = false;
      this.stellar = true;
      this.ethereum = false;
      this.solana = true;
    }
    if (this.wallet == 'phantom') {
      this.polygon = true;
      this.stellar = true;
      this.ethereum = true;
      this.solana = false;
    }
    if (this.wallet == 'freighter') {
      this.polygon = true;
      this.stellar = false;
      this.ethereum = true;
      this.solana = true;
    }
    if (this.wallet == 'albedo') {
      this.polygon = true;
      this.stellar = false;
      this.ethereum = true;
      this.solana = true;
    }
    if (this.email != null && this.key!=null) {
      this.serviceCol.getCollectionNameByMailAndPK(this.email,this.key).subscribe((data: any) => {
        if (data != null) {
          this.CollectionList = data;
        } else {
          this.CollectionList = [];
        }
      });
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
      Tags: new FormControl(this.tagCtrl, Validators.required),
      // Tags:  this.tagCtrl,
      NftContentURL: new FormControl(this.mint.NftContentURL),
      ArtistName: new FormControl(this.mint.ArtistName, Validators.required),
      ArtistProfileLink: new FormControl(this.mint.ArtistProfileLink),
      Issuer: new FormControl(this.mint.NFTIssuerPK),
    });

    this.controlGroup.get('Blockchain')?.setValue('');
  }

  private formValue(controlName: string): any {
    return this.controlGroup.get(controlName)!.value;
  }

  mintNftSolana(ownerPK: string, _callback?: any) {
    const networkURL: any = BlockchainConfig.solananetworkURL;
    const connection = new Connection(networkURL);
    return new Promise((resolve, reject) => {
      this.servicecharge
        .transferServiceCharge(ownerPK)
        .then(async (result: solanaTransaction) => {
          try {
            const { signature } = await (
              window as any
            ).solana.signAndSendTransaction(result);
            await connection.confirmTransaction(signature);
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
                try {
                  this.Minter();
                } catch (err) {
                  _callback();
                  this.snackbar.openSnackBar(
                    'Something went wrong, please try again! More information: ' +
                      err,
                    'error'
                  );
                  this.flag = false;
                }
              })
              .catch((error) => {
                if (this.isLoadingPresent) {
                  this.dissmissLoading();
                }
                this.pendingDialog.close(false);
              });
          } catch (err: any) {
            this.snackbar.openSnackBar(err.message, 'error');
            this.pendingDialog.close(false);
            this.flag = false;
          }
        });
    });
  }

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
    if (event.target.files[0].size <= 10 * 1024 * 1024) {
      this.file = event.target.files[0];
      if (this.file.type.toLowerCase().includes('svg')) {
        this.type = this.file.type;
        this.uploadImage(true);
      } else if (
        this.file.type.toLowerCase().includes('png') ||
        this.file.type.toLowerCase().includes('jpg') ||
        this.file.type.toLowerCase().includes('jpeg')
      ) {
        this.type = this.file.type;
        var reader = new FileReader();
        reader.readAsDataURL(this.file);
        reader.onload = this._handleReaderLoadedImage.bind(this);
        reader.readAsBinaryString(this.file);
        this.updateHTML();
      }
    } else {
      this.snackbar.openSnackBar('Maximum file size for NFT is 10 MB', 'error');
    }
  }

  //called when user uploads an image
  public uploadImage(isSvg: boolean) {
    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsBinaryString(this.file);
  }

  //create base64 image
  private _handleReaderLoaded(readerEvt: any) {
    const svgChecker = this.dialogService.pendingDialog({
      message: 'Validating SVG Content',
    });
    this.base64 = readerEvt.target.result;
    const unwantedText = 'data:image/svg+xml;base64,';
    this.base64 = this.base64.replace(unwantedText, '');
    let encoded: string = atob(this.base64);
    this.Encoded = encoded;

    this.hash = SHA256(encoded).toString(enc.Hex);
    this.apiService.getImagebase64(this.hash).subscribe((resnft: any) => {
      if (resnft.Response.imagebase64 == '') {
        this.updateHTML();
      } else {
        this.snackbar.openSnackBar(
          'This SVG has already been used, please add another!',
          'error'
        );
      }
      svgChecker.close();
    });
  }

  private _handleReaderLoadedImage(readerEvt: any) {
    const svgChecker = this.dialogService.pendingDialog({
      message: 'Validating Image Content',
    });
    var binaryString = readerEvt.target.result;
    this.Encoded = binaryString;
    this.hash = SHA256(this.Encoded).toString(enc.Hex);

    this.apiService.getImagebase64(this.hash).subscribe((resnft: any) => {
      if (resnft.Response.imagebase64 == '') {
        this.updateHTML();
      } else {
        this.snackbar.openSnackBar(
          'This Image has already been used, please add another!',
          'error'
        );
      }
      svgChecker.close();
    });
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

  //trigger file input click event
  public triggerThumbnailUpload() {
    let el: HTMLElement = this.thumbUpload.nativeElement;
    el.click();
  }

  public openCreateCollection() {
    this.dialogService
      .createCollection(this.email, this.key)
      .afterClosed()
      .subscribe((data: any) => {
        if (Boolean(data)) {
          this.CollectionList.push({
            CollectionName: data.CollectionName,
            UserId: data.UserId,
            OrganizationName: data.OrganizationName,
          });
        }
      });
  }

  public onThumbnailChange(event: any) {
    this.thumbFile = event.target.files[0];
    if (
      this.thumbFile.type.toLowerCase().includes('png') ||
      this.thumbFile.type.toLowerCase().includes('jpg') ||
      this.thumbFile.type.toLowerCase().includes('jpeg')
    ) {
      this.thumbType = this.thumbFile.type;
      var reader = new FileReader();
      reader.readAsDataURL(this.thumbFile);
      reader.onload = this._handleReaderLoadedThumbnail.bind(this);
      reader.readAsBinaryString(this.thumbFile);
      this.updateThumbnailHTML();
    }
  }

  public updateThumbnailHTML() {
    const reader = new FileReader();
    reader.readAsDataURL(this.thumbFile);
    reader.onload = (_event) => {
      this.thumbnail = reader.result;
      this.thumbSrc = this._sanitizer.bypassSecurityTrustResourceUrl(
        this.thumbnail
      );
    };
  }

  //create base64 image
  private _handleReaderLoadedThumbnail(readerEvt: any) {
    var binaryString = readerEvt.target.result;
    this.thumbEncoded = binaryString;
    this.thumbHash = SHA256(this.Encoded).toString(enc.Hex);
    this.updateThumbnailHTML();
  }

  @HostListener('keydown', ['$event']) public onKeyDown(evt) {
    if (evt.keyCode == 13) {
      evt.preventDefault();
    }
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
    if (
      evt.target.id === 'nft-dnd' ||
      evt.target.id === 'nft-dnd-ph' ||
      evt.target.id === 'nft-dnd-img' ||
      evt.target.id === 'nft-dnd-u-img'
    ) {
      let files = evt.dataTransfer.files;
      let valid_files: Array<File> = files;
      if (valid_files[0].size <= 10 * 1024 * 1024) {
        this.file = valid_files[0];
        if (this.file.type.toLowerCase().includes('svg')) {
          this.type = this.file.type;
          this.uploadImage(true);
        } else if (
          this.file.type.toLowerCase().includes('png') ||
          this.file.type.toLowerCase().includes('jpg') ||
          this.file.type.toLowerCase().includes('jpeg')
        ) {
          this.type = this.file.type;
          var reader = new FileReader();
          reader.readAsDataURL(this.file);
          reader.onload = this._handleReaderLoadedImage.bind(this);
          reader.readAsBinaryString(this.file);
          this.updateHTML();
        }
      } else {
        this.snackbar.openSnackBar(
          'Maximum file size for NFT is 10 MB',
          'error'
        );
      }
    } else if (this.thumbDnd.nativeElement.contains(evt.target)) {
      let files = evt.dataTransfer.files;
      let valid_files: Array<File> = files;
      if (valid_files[0].size <= 2 * 1024 * 1024) {
        const el = this.thumbUpload.nativeElement;
        el.files = files;
        el.dispatchEvent(new Event('change'));
      } else {
        this.snackbar.openSnackBar(
          'Maximum file size for thumbnail is 2 MB',
          'error'
        );
      }
    }
  }

  public countRemainingCharactersInDesc(e: any) {
    this.descriptionRemainingChars =
      this.descriptionLimit - e.target.value.length;
  }

  public countRemainingCharactersInNftName(e: any) {
    this.nftNameRemainingChars = this.nftNameLimit - e.target.value.length;
  }

  fileChangeEvent(event: any): void {
    if (event.target.files[0].size <= 2 * 1024 * 1024) {
      this.imageChangedEvent = event;
      this.cropperStat = true;
      this.showthumbnailContainer = false;
    } else {
      this.snackbar.openSnackBar(
        'Maximum file size for thumbnail is 2 MB',
        'error'
      );
    }
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.thumbSrc = this.croppedImage;
    //this.updateThumbnailHTML()
    this.thumbnail = this.croppedImage;
  }
  hideCropper() {
    this.cropperStat = false;
    this.showthumbnailContainer = true;
    this.compressImage();
  }
  imageLoaded(image?: LoadedImage) {}
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  public onClickCollectionDropDown() {
    if (this.CollectionList.length == 0) {
      this.openCreateCollection();
    }
  }

  public isChipListValid(): boolean {
    return this.tags.length > 0;
  }

  private compressImage() {
    const blob = this.b64toBlob(
      this.thumbnail,
      this.thumbnail.split(';')[0].split('/')[1]
    );

    const img = new Image();
    img.src = URL.createObjectURL(blob);

    img.onload = async () => {
      this.resize(img, 'jpeg').then((blob) => {
        var reader = new FileReader();
        reader.readAsDataURL(blob);

        reader.onloadend = () => {
          var base64data = reader.result;

          this.croppedImage = base64data;
          this.thumbSrc = this.croppedImage;
          this.thumbnail = this.croppedImage;
        };
      });
    };
  }

  //Used for converting base6 images to blob
  private b64toBlob(b64Data, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(
      b64Data.replace(/^data:image\/(png|jpeg|jpg);base64,/, '')
    );
    const byteArrays: any = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  //Used for compressing images
  private async resize(img, type = 'jpeg') {
    const MAX_WIDTH = 500;
    const MAX_HEIGHT = 500;
    const MAX_SIZE = 73000;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    ctx!.drawImage(img, 0, 0);

    let width = img.width;
    let height = img.height;
    let start = 0;
    let end = 1;
    let last, accepted, blob;

    // keep portration
    if (width > height) {
      if (width > MAX_WIDTH) {
        height *= MAX_WIDTH / width;
        width = MAX_WIDTH;
      }
    } else {
      if (height > MAX_HEIGHT) {
        width *= MAX_HEIGHT / height;
        height = MAX_HEIGHT;
      }
    }
    canvas.width = width;
    canvas.height = height;

    ctx!.drawImage(img, 0, 0, width, height);

    accepted = blob = await new Promise((rs) =>
      canvas.toBlob(rs, 'image/' + type, 1)
    );

    if (blob.size < MAX_SIZE) {
      return blob;
    }

    // Binary search for the right size
    while (true) {
      const mid = Math.round(((start + end) / 2) * 100) / 100;
      if (mid === last) break;
      last = mid;
      blob = await new Promise((rs) => canvas.toBlob(rs, 'image/' + type, mid));

      if (blob.size > MAX_SIZE) {
        end = mid;
      }
      if (blob.size < MAX_SIZE) {
        start = mid;
        accepted = blob;
      }
    }

    return accepted;
  }
}
