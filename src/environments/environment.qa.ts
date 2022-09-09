// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// export const environment = {
//   //   production: false,
//   //   contractAddressNFTPolygon:"0x0670545E7153f005196fC2c7b59D1254F1100d63",
//   //   contractAddressMKPolygon:"0xE5e991238830f884A9487e558AcB4B3a15B0067E",
//   //   contractAddressNFTEthereum:"0xD1eCC3A4861021B8515A962F22aCa55067CB37C2",
//   //   contractAddressMKEthereum:"0xdEcf2B82E134Da9615bD47D51204D80204690DD1",
  
//   // };
//   // export const ENV: any = {
//   //   mode: 'qa',
//   //   API_TRACIFIED_V1: 'https://api.tracified.com/api/v1',
//   //   API_TRACIFIED: 'https://api.tracified.com/api/v2',
//   //   GATEWAY: 'https://gateway.tracified.com',
//   //   API_ADMIN: 'https://admin.api.tracified.com',
//   //   APPCENTER_DEPLOYMENT_KEY: 'BcfHYi-Gexwau0ZS3Q0RmtoJqsTx2_Bln3Qkc',
//   //   BLOCKCHAIN_NETWORK: 'https://horizon-testnet.stellar.org',
// // NETWORK_TYPE: 'live'
//   };
export const adminENV={
  production: false,
  name: 'qa',
  backendUrl: 'https://qa.api.tracified.com',
  adminUrl: 'https://qa.admin.api.tracified.com',
  composerBackend: 'https://qa.api.nft.tracified.com',
  gateway: 'https://qa.gateway.tracified.com',
  domain: 'localhost',
}
   
  
  
  /*
   * For easier debugging in development mode, you can import the following file
   * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
   *
   * This import should be commented out in production mode because it will have a negative impact
   * on performance if an error is thrown.
   */
  // import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
  