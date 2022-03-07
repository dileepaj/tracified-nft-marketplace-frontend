import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NewsletterComponent } from './components/resources/newsletter/newsletter.component';
import { FaqsComponent } from './components/resources/faqs/faqs.component';
import { PartnersComponent } from './components/resources/partners/partners.component';
import { DocsComponent } from './components/resources/docs/docs.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { WalletComponent } from './wallet/wallet.component';
import { ViewEditNewsletterComponent } from './view-edit-newsletter/view-edit-newsletter.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { InboxComponent } from './inbox/inbox.component';
import { ViewUsersComponent } from './view-users/view-users.component';
import { TrustscoreComponent } from './trustscore/trustscore.component';
import { NftReviewsComponent } from './nft-reviews/nft-reviews.component';
import { ActivityComponent } from './activity/activity.component';
import { HomeComponent } from './home/home.component';
import { ExploreComponent } from './explore/explore.component';
import { AddNftReviewComponent } from './add-nft-review/add-nft-review.component';

@NgModule({
  declarations: [
    AppComponent,
    NewsletterComponent,
    FaqsComponent,
    PartnersComponent,
    DocsComponent,
    SignUpComponent,
    SignInComponent,
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
    AddNftReviewComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
