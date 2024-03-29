import { AuthGuard } from './guards/auth.guard';
import { NgModule, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { WalletComponent } from './wallet/wallet.component';
import { ViewEditNewsletterComponent } from './admin/newsletterOp/view-edit-newsletter/view-edit-newsletter.component';
import { ReviewsComponent } from './admin/reviews/reviews.component';
import { InboxComponent } from './admin/inbox/inbox.component';
import { ViewUsersComponent } from './admin/view-users/view-users.component';
import { TrustscoreComponent } from './trustscore/trustscore.component';
import { NftReviewsComponent } from './nft-reviews/nft-reviews.component';
import { ActivityComponent } from './activity/activity.component';
import { HomeComponent } from './marketplace/home/home.component';
import { ExploreComponent } from './marketplace/explore/explore.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { MintComponent } from './nft/mint/mint.component';
import { SellNftComponent } from './nft/sell-nft/sell-nft.component';
import { ViewDashboardComponent } from './user/view-dashboard/view-dashboard.component';
import { BlogViewerComponent } from './blog/blog-viewer/blog-viewer.component';
import { RichTextEditorComponent } from './blog/rich-text-editor/rich-text-editor.component';
import { CreateCollectionComponent } from './collections/create-collection/create-collection.component';
import { ViewCollectionsComponent } from './collections/view-collections/view-collections.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule, Routes } from '@angular/router';
import { Mint2Component } from './nft/mint2/mint2.component';
import { Mint3Component } from './nft/mint3/mint3.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatStepperModule } from '@angular/material/stepper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { HeaderComponent } from './shared/header/header.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { FreighterComponent } from './wallet/freighter/freighter.component';
import { PhantomComponent } from './wallet/phantom/phantom.component';
import { MetamaskComponent } from './wallet/metamask/metamask.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatRippleModule } from '@angular/material/core';
import { BuyViewComponent } from './marketplace/buyNft/buy-view/buy-view.component';
import { CKEditorModule } from 'ng2-ckeditor';
import { CodeviewComponent } from './nft/codeview/codeview.component';
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { MintPopupComponent } from './nft/mint-popup/mint-popup.component';
import { MatRadioModule } from '@angular/material/radio';
import { PartnersComponent } from './admin/partnersOp/partners/partners.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { MatListModule } from '@angular/material/list';
import { BrowseMarketplaceComponent } from './admin/browse-marketplace/browse-marketplace.component';
import { EndorsementsComponent } from './admin/endorsements/endorsements.component';
import { AddNewsletterComponent } from './admin/newsletterOp/add-newsletter/add-newsletter.component';
import { EditProfileComponent } from './user/edit-profile/edit-profile.component';
import { OverviewComponent } from './user/overview/overview.component';
import { ConfirmComponent } from './dialogs/confirm/confirm.component';
import { ShowNFTComponent } from './show-nft/show-nft.component';
import { VerifyComponent } from './verify/verify.component';
import { FaqComponent } from './marketplace/faq/faq.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { InterceptorService } from './services/loader/interceptor.service';
import { OkmessageComponent } from './dialogs/okmessage/okmessage.component';
import { MintNftComponent } from './nft/mint-nft/mint-nft.component';
import { MatChipsModule } from '@angular/material/chips';
import { FooterComponent } from './shared/footer/footer.component';
import { ContactUsComponent } from './marketplace/contact-us/contact-us.component';
import { HelpCenterComponent } from './marketplace/help-center/help-center.component';
import { AddEditFaqsComponent } from './admin/add-edit-faqs/add-edit-faqs.component';
import { PreviewImageComponent } from './dialogs/previewImage/preview-image/preview-image.component';
import { PendingComponent } from './dialogs/pending/pending.component';
import { UserCollectionsComponent } from './user/user-collections/user-collections.component';
import { UserCollectionNFTComponent } from './user/user-collection-nft/user-collection-nft.component';
import { PageNotFoundComponent } from './error-pages/page-not-found/page-not-found.component';
import { NftgridComponent } from './shared/nftgrid/nftgrid.component';
import { LoaderComponent } from './shared/loader/loader.component';
import { DisclaimerComponent } from './dialogs/disclaimer/disclaimer.component';
import { NftCardComponent } from './nft/nft-card/nft-card.component';
import { CreatorViewComponent } from './nft/creator-view/creator-view.component';
import { NftPreviewComponent } from './dialogs/nft-preview/nft-preview.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { SelectWalletComponent } from './dialogs/select-wallet/select-wallet.component';
import { ConfirmMintComponent } from './dialogs/confirm-mint/confirm-mint.component';
import { MintingComponent } from './dialogs/minting/minting.component';
import { SellNftConfirmationComponent } from './dialogs/sell-nft-confirmation/sell-nft-confirmation.component';
import { NftCardSkeletonComponent } from './nft/nft-card-skeleton/nft-card-skeleton.component';
import * as firebase from 'firebase/app';
import { FirebaseConfig } from 'src/environments/environment';
import * as fireAnalytics from 'firebase/analytics';
import { CustomSnackbarComponent } from './dialogs/custom-snackbar/custom-snackbar.component';
import { AboutUsComponent } from './marketplace/about-us/about-us.component';
import { ConfirmSellComponent } from './dialogs/confirm-sell/confirm-sell.component';
import { CollectionsComponent } from './marketplace/collections/collections.component';
import { CollectionCardComponent } from './collections/collection-card/collection-card.component';
import { WatchlistComponent } from './user/watchlist/watchlist.component';
import { FavouritesComponent } from './user/favourites/favourites.component';
import { ChangeVisibilityDialogComponent } from './collections/change-visibility-dialog/change-visibility-dialog.component';
import { MyItemsComponent } from './user/my-items/my-items.component';

firebase.initializeApp(FirebaseConfig.firebaseConfig);

const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'mint',
    component: MintNftComponent,
  },
  {
    path: 'mint2',
    component: Mint2Component,
  },
  {
    path: 'mint3',
    component: Mint3Component,
  },
  {
    path: 'collections',
    component: CreateCollectionComponent,
  },
  {
    path: 'sell',
    component: SellNftComponent,
  },
  /* {
    path: 'getNft',
    component: ViewNftCardComponent,
  }, */
  {
    path: 'buyNft',
    component: BuyViewComponent,
  },
  {
    path: 'gridnft',
    component: NftgridComponent,
  },
  {
    path: 'createblog',
    component: RichTextEditorComponent,
  },
  {
    path: 'nft-story',
    component: BlogViewerComponent,
  },
  {
    path: 'explore/nfts',
    component: ExploreComponent,
  },
  { path: 'explore/collections', component: CollectionsComponent },
  {
    path: 'signUp',
    component: SignUpComponent,
  },
  {
    path: 'faq',
    component: FaqComponent,
  },
  {
    path: 'user-dashboard',
    component: ViewDashboardComponent,
    children: [
      {
        path: 'edit-profile',
        component: EditProfileComponent,
      },
      /* {
        path: 'overview',
        component: OverviewComponent,
      }, */
      {
        path: 'myitems',
        component: MyItemsComponent,
      },
      {
        path: 'mycollections',
        component: UserCollectionsComponent,
      },
      {
        path: 'mynfts',
        component: UserCollectionNFTComponent,
      },
      {
        path: 'watchlist',
        component: WatchlistComponent,
      },
      {
        path: 'favourites',
        component: FavouritesComponent,
      },
      {
        path: '',
        redirectTo: 'mycollections',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        canActivate: [AuthGuard],
        path: 'overview',
        component: BrowseMarketplaceComponent,
      },
      {
        canActivate: [AuthGuard],
        path: 'endorsements',
        component: EndorsementsComponent,
      },
      {
        canActivate: [AuthGuard],
        path: 'add-news-letter',
        component: AddNewsletterComponent,
      },
      {
        canActivate: [AuthGuard],
        path: 'AnswerUserFAQ',
        component: AddEditFaqsComponent,
      },
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'userreview',
    component: NftReviewsComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'activity',
    component: ActivityComponent,
  },
  {
    path: 'blogs',
    component: BlogViewerComponent,
  },
  {
    path: 'shownft',
    component: ShowNFTComponent,
  },
  {
    path: 'verify',
    component: VerifyComponent,
  },
  {
    path: 'contact-us',
    component: ContactUsComponent,
  },
  {
    path: 'about-us',
    component: AboutUsComponent,
  },
  {
    path: 'help-center',
    component: HelpCenterComponent,
  },
  {
    path: 'AnswerUserFAQ',
    component: AddEditFaqsComponent,
  },
  {
    path: 'mycollections',
    component: UserCollectionsComponent,
  },
  {
    path: 'mynfts',
    component: UserCollectionNFTComponent,
  },
  /*Wild Card Route for 404 request
    NOTE : Always keep this at the end of routes array
  */
  {
    path: '**',
    pathMatch: 'full',
    component: PageNotFoundComponent,
  },
];
@NgModule({
  declarations: [
    AppComponent,
    SellNftComponent,
    MintComponent,
    SignUpComponent,
    WalletComponent,
    ViewEditNewsletterComponent,
    ReviewsComponent,
    InboxComponent,
    ViewUsersComponent,
    TrustscoreComponent,
    NftReviewsComponent,
    ActivityComponent,
    HomeComponent,
    ExploreComponent,
    LoginComponent,
    ViewDashboardComponent,
    BlogViewerComponent,
    RichTextEditorComponent,
    CreateCollectionComponent,
    ViewCollectionsComponent,
    Mint2Component,
    Mint3Component,
    HeaderComponent,
    FreighterComponent,
    PhantomComponent,
    MetamaskComponent,
    BuyViewComponent,
    CodeviewComponent,
    MintPopupComponent,
    PartnersComponent,
    LoginComponent,
    AdminDashboardComponent,
    BrowseMarketplaceComponent,
    EndorsementsComponent,
    AddNewsletterComponent,
    EditProfileComponent,
    OverviewComponent,
    ConfirmComponent,
    ShowNFTComponent,
    VerifyComponent,
    FaqComponent,
    OkmessageComponent,
    MintNftComponent,
    FooterComponent,
    ContactUsComponent,
    HelpCenterComponent,
    AddEditFaqsComponent,
    PreviewImageComponent,
    PendingComponent,
    UserCollectionsComponent,
    UserCollectionNFTComponent,
    PageNotFoundComponent,
    NftgridComponent,
    LoaderComponent,
    DisclaimerComponent,
    NftCardComponent,
    CreatorViewComponent,
    NftPreviewComponent,
    SelectWalletComponent,
    ConfirmMintComponent,
    MintingComponent,
    SellNftConfirmationComponent,
    NftCardSkeletonComponent,
    CustomSnackbarComponent,
    AboutUsComponent,
    ConfirmSellComponent,
    CollectionsComponent,
    CollectionCardComponent,
    WatchlistComponent,
    FavouritesComponent,
    ChangeVisibilityDialogComponent,
    MyItemsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
    RouterModule.forRoot(appRoutes, { scrollPositionRestoration: 'enabled' }),
    MatExpansionModule,
    MatCheckboxModule,
    MatSelectModule,
    HttpClientModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSidenavModule,
    MatMenuModule,
    MatTooltipModule,
    MatTabsModule,
    FlexLayoutModule,
    MatSnackBarModule,
    MatRippleModule,
    CKEditorModule,
    HighlightModule,
    MatRadioModule,
    MatListModule,
    MatProgressBarModule,
    MatChipsModule,
    ImageCropperModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        fullLibraryLoader: () => import('highlight.js'),
      },
    },
    AuthGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule implements OnInit {
  analytics: any;
  constructor() {
    this.analytics = fireAnalytics.getAnalytics();
  }
  ngOnInit(): void {
    firebase.initializeApp(FirebaseConfig.firebaseConfig);
    fireAnalytics.logEvent(this.analytics, 'initialized', {
      logged: true,
      name: 'Marketplace firebase Analytics',
    });
  }
}
