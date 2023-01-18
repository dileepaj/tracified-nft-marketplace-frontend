export const environment = {
  production: false,
  contractAddressNFTPolygon: "0xc89bac690365d942ba49bb020274440dae54ec11",
  contractAddressMKPolygon: "0x7D591543D2A09ef03AaB1490083943fC69c352Ec",
  contractAddressNFTEthereum: "0x6f09Ecb9e29bF5B1d2C9c39d126FF32dc089F34C",
  contractAddressMKEthereum: "0x7D591543D2A09ef03AaB1490083943fC69c352Ec",
  fromWalletSecret: new Uint8Array([139, 86, 214, 96, 136, 74, 51, 203, 92, 137, 107, 209, 15, 133, 204, 61, 225, 147, 117, 65, 33, 88, 156, 140, 76, 255, 220, 127, 23, 99, 246, 45, 58, 163, 54, 242, 243, 126, 54, 44, 31, 10, 32, 81, 171, 163, 3, 25, 67, 125, 32, 81, 58, 47, 111, 98, 158, 38, 68, 61, 99, 171, 124, 126]),

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