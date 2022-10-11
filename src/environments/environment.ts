// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  contractAddressNFTPolygon:"0x785a0e26A259E40659b4F751020294a5eF6660F5",
  contractAddressMKPolygon:"0x5e91C0A4b9be5cbA11110C1C9e3BAd38bB1fDfc1",
  contractAddressNFTEthereum:"0x0dC70991dc8F062D766875f7173D197C76ea0aB6",
  contractAddressMKEthereum:"0x15581C140f1556188967430360C500cFCe78DBF1",

    fromWalletSecret : new Uint8Array([
      196, 114, 86, 165, 59, 177, 63, 87, 43, 10, 176, 101, 225, 42, 129, 158, 167, 43, 81, 214, 254, 28, 196, 158, 159, 64, 55, 123, 48, 211, 78, 166, 127, 96, 107, 250, 152, 133, 208, 224, 73, 251, 113, 151, 128, 139, 86, 80, 101, 70, 138, 50, 141, 153, 218, 110, 56, 39, 122, 181, 120, 55, 86, 185]),

};
export const ENV: any = {
  mode: 'qa',
  API_TRACIFIED_V1: 'https://api.tracified.com/api/v1',
  API_TRACIFIED: 'https://api.tracified.com/api/v2',
  GATEWAY: 'https://gateway.tracified.com',
  API_ADMIN: 'https://admin.api.tracified.com',
  APPCENTER_DEPLOYMENT_KEY: 'BcfHYi-Gexwau0ZS3Q0RmtoJqsTx2_Bln3Qkc',
  BLOCKCHAIN_NETWORK: 'https://horizon-testnet.stellar.org',
  NETWORK_TYPE: 'live'
};
 
export const adminENV={
  production: false,
  name: 'qa',
  backendUrl: 'https://qa.api.tracified.com',
  adminUrl: 'https://qa.admin.api.tracified.com',
  composerBackend: 'https://qa.api.nft.tracified.com',
  gateway: 'https://qa.gateway.tracified.com',
  domain: 'localhost',
}
export const APIConfigENV={
  gatewayBaseURL:'',
  nftbackendBaseURL:'', 
  APIIntervalTimer:30000,  // 30 seconds
  APIStartDelay:3000, // 3 seconds
  homepageIntervalTimer:600000 //10 minutes

}
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
