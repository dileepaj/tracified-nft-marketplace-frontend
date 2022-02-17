import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NewsletterComponent } from './components/resources/newsletter/newsletter.component';
import { FaqsComponent } from './components/resources/faqs/faqs.component';
import { PartnersComponent } from './components/resources/partners/partners.component';
import { DocsComponent } from './components/resources/docs/docs.component';

@NgModule({
  declarations: [
    AppComponent,
    NewsletterComponent,
    FaqsComponent,
    PartnersComponent,
    DocsComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
