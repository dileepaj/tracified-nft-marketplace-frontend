import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app'
import { FirebaseConfig } from 'src/environments/environment';
import * as fireAnalytics from 'firebase/analytics';
@Injectable({
  providedIn: 'root'
})
export class FirebaseAnalyticsService {
  analytics: any;

  constructor() { 
    this.analytics = fireAnalytics.getAnalytics();
  }

  logEvent(eventName: string, eventParams:any){
    fireAnalytics.logEvent(this.analytics,eventName,eventParams)
  }

  setUserProperties(porperties:any){
    fireAnalytics.setUserProperties(this.analytics,{porperties})
  }
}
