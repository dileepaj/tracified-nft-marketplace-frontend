import { AuthGuard } from './guards/auth.guard';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NewsletterComponent } from './resources/newsletter/newsletter.component';
import { FaqsComponent } from './resources/faqs/faqs.component';
import { DocsComponent } from './resources/docs/docs.component';
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
import { AdminNavbarLayoutComponent } from './shared/admin-navbar-layout/admin-navbar-layout.component';
import { HomeNavbarLayoutComponent } from './shared/home-navbar-layout/home-navbar-layout.component';
import { NftCardComponent } from './shared/nft-card/nft-card.component';
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
import { MatFileUploadModule } from 'angular-material-fileupload';
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
import { ViewNftCardComponent } from './nft/view-nft-card/view-nft-card.component';
import { BuyViewComponent } from './marketplace/buyNft/buy-view/buy-view.component';
import { CKEditorModule } from 'ng2-ckeditor';
import { CodeviewComponent } from './nft/codeview/codeview.component';
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { MintPopupComponent } from './nft/mint-popup/mint-popup.component';
import { MatRadioModule } from '@angular/material/radio';
import { PartnersComponent } from './admin/partnersOp/partners/partners.component';
import { ViewPartnersComponent } from './resources/view-partners/view-partners.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { MatListModule } from '@angular/material/list';
import { BrowseMarketplaceComponent } from './admin/browse-marketplace/browse-marketplace.component';
import { EndorsementsComponent } from './admin/endorsements/endorsements.component';
import { AddNewsletterComponent } from './admin/newsletterOp/add-newsletter/add-newsletter.component';
import { EditProfileComponent } from './user/edit-profile/edit-profile.component';
import { OverviewComponent } from './user/overview/overview.component';
import { ConfirmComponent } from './dialogs/confirm/confirm.component';
import { ShowNFTComponent } from './show-nft/show-nft.component';
import { PutOnResaleComponent } from './put-on-resale/put-on-resale.component';
import { VerifyComponent } from './verify/verify.component';
import { DocumentationComponent } from './marketplace/documentation/documentation.component';
import { FaqComponent } from './marketplace/faq/faq.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { InterceptorService } from './services/loader/interceptor.service';
import { OkmessageComponent } from './dialogs/okmessage/okmessage.component';
import { ConfirmationPopupComponent } from './marketplace/buyNft/confirmation-popup/confirmation-popup.component';
import { MintNftComponent } from './nft/mint-nft/mint-nft.component';
import { MatChipsModule } from '@angular/material/chips';
import { FooterComponent } from './shared/footer/footer.component';

const appRoutes: Routes = [
  {
    path: 'home',
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
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'sell',
    component: SellNftComponent,
  },
  {
    path: 'getNft',
    component: ViewNftCardComponent,
  },
  {
    path: 'buyNft',
    component: BuyViewComponent,
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
    path: 'explore',
    component: ExploreComponent,
  },
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
      {
        path: 'overview',
        component: OverviewComponent,
      },
      {
        path: '',
        redirectTo: 'overview',
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
    path: 'nftresale',
    component: PutOnResaleComponent,
  },
  {
    path: 'verify',
    component: VerifyComponent,
  },
  {
    path: 'docs',
    component: DocumentationComponent,
  },
];
@NgModule({
  declarations: [
    AppComponent,
    SellNftComponent,
    MintComponent,
    NewsletterComponent,
    FaqsComponent,
    DocsComponent,
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
    AdminNavbarLayoutComponent,
    HomeNavbarLayoutComponent,
    NftCardComponent,
    Mint2Component,
    Mint3Component,
    HeaderComponent,
    FreighterComponent,
    PhantomComponent,
    MetamaskComponent,
    ViewNftCardComponent,
    BuyViewComponent,
    CodeviewComponent,
    MintPopupComponent,
    PartnersComponent,
    ViewPartnersComponent,
    LoginComponent,
    AdminDashboardComponent,
    BrowseMarketplaceComponent,
    EndorsementsComponent,
    NewsletterComponent,
    AddNewsletterComponent,
    EditProfileComponent,
    OverviewComponent,
    ConfirmComponent,
    ShowNFTComponent,
    PutOnResaleComponent,
    VerifyComponent,
    DocumentationComponent,
    FaqComponent,
    OkmessageComponent,
    ConfirmationPopupComponent,
    MintNftComponent,
    FooterComponent,
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
    RouterModule.forRoot(appRoutes),
    MatExpansionModule,
    MatCheckboxModule,
    MatSelectModule,
    HttpClientModule,
    MatStepperModule,
    MatFileUploadModule,
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
export class AppModule {}
