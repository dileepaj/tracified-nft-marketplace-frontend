export const environment = {
  production: false,
  contractAddressNFTPolygon: "0xc89bac690365d942ba49bb020274440dae54ec11",
  contractAddressMKPolygon: "0x7D591543D2A09ef03AaB1490083943fC69c352Ec",
  contractAddressNFTEthereum: "0x6f09Ecb9e29bF5B1d2C9c39d126FF32dc089F34C",
  contractAddressMKEthereum: "0x7D591543D2A09ef03AaB1490083943fC69c352Ec",
  fromWalletSecret: new Uint8Array([51, 110, 97, 90, 70, 57, 110, 84, 56, 88, 103, 103, 68, 66, 74, 83, 103, 99, 49, 111, 118, 97, 69, 115, 107, 117, 89, 85, 87, 82, 98, 80, 105, 122, 88, 106, 88, 81, 74, 80, 54, 57, 66, 71, 83, 70, 111, 114, 105, 118, 109, 118, 116, 53, 83, 86, 120, 57, 77, 112, 88, 88, 119, 105, 112, 88, 90, 53, 100, 121, 70, 109, 52, 80, 72, 101, 56, 121, 55, 113, 66, 90, 116, 66, 77, 118, 66, 102]),

};
export const ENV: any = {
  production: false,
  mode: 'staging',
  API_TRACIFIED_V1: 'https://api.tracified.com/api/v1',
  API_TRACIFIED: 'https://api.tracified.com/api/v2',
  GATEWAY: 'https://gateway.tracified.com',
  API_ADMIN: 'https://admin.api.tracified.com',
  APPCENTER_DEPLOYMENT_KEY: 'BcfHYi-Gexwau0ZS3Q0RmtoJqsTx2_Bln3Qkc',
  BLOCKCHAIN_NETWORK: 'https://horizon.stellar.org',
  NETWORK_TYPE: 'live' ,
  NETWORK: 'PUBLIC'
};
export const adminENV={
  production: false,
  name: 'staging',
  backendUrl: 'https://staging.api.tracified.com',
  adminUrl: 'https://staging.admin.api.tracified.com',
  composerBackend: 'https://staging.api.nft.tracified.com',
  gateway: 'https://staging.gateway.tracified.com',
  domain: '.tracified.com',
};
export const APIConfigENV = {
  production: false,
  mode: 'staging',
  gatewayBaseURL: 'https://staging.gateway.tracified.com/',
  nftbackendBaseURL: 'https://staging.api.nft.tracified.com/',
  marketplaceBaseURL:"https://staging.marketplace.nft.tracified.com/",
  APIIntervalTimer: 60000,  // 30 seconds
  APIStartDelay: 6000, // 3 seconds
  homepageIntervalTimer: 600000 //10 minutes 600000

}

export const BlockchainConfig = {
  production: false,
  mode: 'staging',
  solananetwork: 'mainnet-beta',
  solananetworkURL: 'https://solana-mainnet.g.alchemy.com/v2/rSR0X9jq8qltHn8Tnb16oDa0eovOZf1Y'
}

//https://solana-mainnet.g.alchemy.com/v2/rSR0X9jq8qltHn8Tnb16oDa0eovOZf1Y