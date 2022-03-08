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
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input'; 
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MintComponent } from './nft/mint/mint.component';
import { SellNftComponent } from './nft/sell-nft/sell-nft.component';


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
    LoginComponent
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
    MatToolbarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
