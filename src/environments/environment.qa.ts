export const environment = {
  production: false,
  contractAddressNFTPolygon: "0xE6F59c4A3118C0C00155b00331dF07b40DD85569",
  contractAddressMKPolygon: "0x86E328AD08b5e66B6AcBF7e03DAC74c7b723f5B7",
  contractAddressNFTEthereum: "0x6f09Ecb9e29bF5B1d2C9c39d126FF32dc089F34C",
  contractAddressMKEthereum: "0xB5EBb0028AB92F19A0a415c450F64b4ED768cbca",
  fromWallet: "4wtzfvaCWvYxzmdh4ajQoj8ep5AuJtUeV8rW3D5biCT7",
  tracifiedStellarPK : "GDL7U4NZ6JGENCU7GMW2TQ3OQUE7NCUUFC7PG6SRAHNQWYGNP77XXYCV",
  tracifiedSolanaPK : "FfEztWGUyS7FjdxS6SPenpNiFmABBc3jLpLSPvPq1QP7"


};

export const ENV: any = {
  production: false,
  mode: 'qa',
  API_TRACIFIED_V1: 'https://api.tracified.com/api/v1',
  API_TRACIFIED: 'https://api.tracified.com/api/v2',
  GATEWAY: 'https://gateway.tracified.com',
  API_ADMIN: 'https://admin.api.tracified.com',
  APPCENTER_DEPLOYMENT_KEY: 'BcfHYi-Gexwau0ZS3Q0RmtoJqsTx2_Bln3Qkc',
  BLOCKCHAIN_NETWORK: 'https://horizon-testnet.stellar.org',
  NETWORK_TYPE: 'live' ,
  NETWORK: 'TEST'
};

export const adminENV = {
  production: false,
  name: 'qa',
  backendUrl: 'https://qa.api.tracified.com',
  adminUrl: 'https://qa.admin.api.tracified.com',
  composerBackend: 'https://qa.api.nft.tracified.com',
  gateway: 'https://qa.gateway.tracified.com',
  domain: '.tracified.com',
}

export const APIConfigENV = {
  production: false,
  mode: 'qa',
  gatewayBaseURL: 'https://qa.gateway.tracified.com/',
  nftbackendBaseURL: 'https://qa.api.nft.tracified.com/',
  marketplaceBaseURL:"https://qa.marketplace.nft.tracified.com/",
  APIIntervalTimer: 60000,  // 30 seconds
  APIStartDelay: 6000, // 3 seconds
  homepageIntervalTimer: 600000 //10 minutes 600000

}

export const BlockchainConfig = {
  production: false,
  mode: 'qa',
  solananetwork: 'devnet',
  solananetworkURL: 'https://api.devnet.solana.com'
}


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
  // import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
