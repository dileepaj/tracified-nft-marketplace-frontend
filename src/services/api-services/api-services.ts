// import { Injectable } from "@angular/core";
// import { Http } from "@angular/http";
// import { Observable } from "rxjs/Observable";
// import "rxjs/add/operator/map";
// import "rxjs/add/operator/catch";
// import { DeviceDetectorService } from "ngx-device-detector";
// import { JwtService } from "./jwtservice.service";
// import { ExpService } from "./exp.service";

// @Injectable()
// export class ApiService {
//     production: false;

//     private api_url: String = "";
//     private deviceInfo: any;
//     private deviceData: string;

//     constructor(
//         private http: Http,
//         private jwtService: JwtService,
//         private expService: ExpService,
//         private deviceService: DeviceDetectorService
//     ) {
//         this.deviceInfo = this.deviceService.getDeviceInfo();
//         if (this.deviceService.isMobile()) {
//             this.deviceData =
//                 "Insights:" +
//                 this.deviceInfo.os +
//                 ":" +
//                 this.deviceInfo.browser +
//                 ":Mobile" +
//                 ":" +
//                 this.deviceInfo.device;
//         } else if (this.deviceService.isTablet()) {
//             this.deviceData =
//                 "Insights:" +
//                 this.deviceInfo.os +
//                 ":" +
//                 this.deviceInfo.browser +
//                 ":Tablet" +
//                 ":" +
//                 this.deviceInfo.device;
//         } else if (this.deviceService.isDesktop()) {
//             this.deviceData =
//                 "Insights:" +
//                 this.deviceInfo.os +
//                 ":" +
//                 this.deviceInfo.browser +
//                 ":Desktop" +
//                 ":" +
//                 this.deviceInfo.device;
//         }
//     }

//     // Setting Headers for API Request
//     private setHeaders(): Headers {
//         const headersConfig = {
//             "Content-Type": "application/json",
//             Accept: "application/json",
//         };
//         if (this.jwtService.getToken()) {
//             if (this.expService.checkExpire()) {
//                 headersConfig[
//                     "Authorization"
//                 ] = `Bearer ${this.jwtService.getToken()}`;
//             }
//         }
//         headersConfig["Device"] = `${this.deviceData}`;
//         return new Headers(headersConfig);
//     }

//     // Format Error Messages
//     private formatErrors(error: any) {
//         return Observable.throw(error.json());
//     }

//     // Perform a GET Request
//     get(
//         path: string,
//         params: URLSearchParams = new URLSearchParams()
//     ): Observable<any> {
//         return this.http.get(`${this.api_url}${path}`, {
//             headers: this.setHeaders(),
//             search: params,
//         });
//     }

//     // Perform a PUT Request
//     put(path: string, body: Object = {}): Observable<any> {
//         return this.http
//             .put(`${this.api_url}${path}`, body, { headers: this.setHeaders() })
//             .catch(this.formatErrors)
//             .map((res: Response) => res.json());
//     }

//     // Perform POST Request
//     post(path, body): Observable<any> {
//         let Url: String;
//         Url = this.api_url;
//         return (
//             this.http
//                 .post(`${Url}${path}`, body, { headers: this.setHeaders() })
//                 // .catch(res => {
//                 //   console.log('err');
//                 //   console.log(res);
//                 //   return Observable.throw(res.json());
//                 // })
//                 .map((res: Response) => res)
//         );
//     }

//     // Perform Delete Request
//     delete(path): Observable<any> {
//         return this.http
//             .delete(`${this.api_url}${path}`, { headers: this.setHeaders() })
//             .catch(this.formatErrors)
//             .map((res: Response) => res.json());
//     }
// }