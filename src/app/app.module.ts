//import { Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NewsletterComponent } from './resources/newsletter/newsletter.component';
import { FaqsComponent } from './resources/faqs/faqs.component';
import { PartnersComponent } from './resources/partners/partners.component';
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
import { ResetProfileComponent } from './user/reset-profile/reset-profile.component';
import { ViewDashboardComponent } from './user/view-dashboard/view-dashboard.component';
import { BlogViewerComponent } from './blog/blog-viewer/blog-viewer.component';
import { RichTextEditorComponent } from './blog/rich-text-editor/rich-text-editor.component';
import { CreateCollectionComponent } from './collections/create-collection/create-collection.component';
import { ViewCollectionsComponent } from './collections/view-collections/view-collections.component';
import { AdminNavbarLayoutComponent } from './shared/admin-navbar-layout/admin-navbar-layout.component';
import { HomeNavbarLayoutComponent } from './shared/home-navbar-layout/home-navbar-layout.component';
import { NftCardComponent } from './shared/nft-card/nft-card.component';
import { RouterModule, Routes } from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input'; 
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatDialogModule} from '@angular/material/dialog';
import {AdminDashboardComponent} from './admin/admin-dashboard/admin-dashboard.component'
import { MatListModule } from '@angular/material/list';
/*import {FormControl, FormGroup, Validators} from "@angular/forms";*/
const appRoutes:Routes=[
  {
      path:'home',
      component:HomeComponent
  },
  {
      path:'userreview',
      component:NftReviewsComponent
  },
  {
      path:'adminlogin',
      component:LoginComponent
  },
  {
      path:'walletTest',
      component:WalletComponent
  },
  {
    path:'adminDashboard',
    component:AdminDashboardComponent
},
];
@NgModule({
  declarations: [
    AppComponent,
    SellNftComponent,
    MintComponent,
    NewsletterComponent,
    FaqsComponent,
    PartnersComponent,
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
    ResetProfileComponent,
    ViewDashboardComponent,
    BlogViewerComponent,
    RichTextEditorComponent,
    CreateCollectionComponent,
    ViewCollectionsComponent,
    AdminNavbarLayoutComponent,
    HomeNavbarLayoutComponent,
    NftCardComponent,
    AdminDashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FlexLayoutModule,
    MatDialogModule,
    MatListModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
