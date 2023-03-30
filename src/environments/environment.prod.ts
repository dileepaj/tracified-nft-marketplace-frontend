export const environment = {
  production: true,
  contractAddressNFTPolygon: "0xc89bac690365d942ba49bb020274440dae54ec11",
  contractAddressMKPolygon: "0x7D591543D2A09ef03AaB1490083943fC69c352Ec",
  contractAddressNFTEthereum: "0x6f09Ecb9e29bF5B1d2C9c39d126FF32dc089F34C",
  contractAddressMKEthereum: "0x7D591543D2A09ef03AaB1490083943fC69c352Ec",
  fromWallet: "4wtzfvaCWvYxzmdh4ajQoj8ep5AuJtUeV8rW3D5biCT7",
  tracifiedStellarPK : "GC6VQMBOJELJJYFXRYF4IQTVJYRHJB6AVQ7UVWTYD4WNWDFBGIK7R72L",
  tracifiedSolanaPK : "FfEztWGUyS7FjdxS6SPenpNiFmABBc3jLpLSPvPq1QP7"


};

export const ENV: any = {
  production: true,
  mode: 'production',
  API_TRACIFIED_V1: 'https://api.tracified.com/api/v1',
  API_TRACIFIED: 'https://api.tracified.com/api/v2',
  GATEWAY: 'https://gateway.tracified.com',
  API_ADMIN: 'https://admin.api.tracified.com',
  APPCENTER_DEPLOYMENT_KEY: 'BcfHYi-Gexwau0ZS3Q0RmtoJqsTx2_Bln3Qkc',
  BLOCKCHAIN_NETWORK: 'https://horizon-testnet.stellar.org',
  NETWORK_TYPE: 'live' ,
  NETWORK: 'PUBLIC'
};

export const adminENV={
  production: true,
  name: 'production',
  backendUrl: 'https://api.tracified.com',
  adminUrl: 'https://admin.api.tracified.com',
  composerBackend: 'https://api.nft.tracified.com',
  gateway: 'https://gateway.tracified.com',
  domain: '.tracified.com',
}

export const APIConfigENV = {
  production: false,
  mode: 'production',
  gatewayBaseURL: 'https://gateway.tracified.com/',
  nftbackendBaseURL: 'https://api.nft.tracified.com/',
  marketplaceBaseURL:"https://marketplace.nft.tracified.com/",
  tracifiedhelpDocsbaseURL:"https://help.tracified.com/",
  APIIntervalTimer: 60000,  // 30 seconds
  APIStartDelay: 60000, // 30 seconds
  homepageIntervalTimer: 600000 //10 minutes 600000

}

export const BlockchainConfig = {
  production: false,
  mode: 'production',
  solananetwork: 'mainnet-beta',
  solananetworkURL: 'https://solana-mainnet.g.alchemy.com/v2/rSR0X9jq8qltHn8Tnb16oDa0eovOZf1Y'
}


export const FirebaseConfig = {
  firebaseConfig: {

    apiKey: "AIzaSyBY9TcEIKgfeuqVzJzE_1zmhX4CxPZnZJU",

    authDomain: "tracified-mithila-8f54a.firebaseapp.com",
  
    projectId: "tracified-mithila-8f54a",
  
    storageBucket: "tracified-mithila-8f54a.appspot.com",
  
    messagingSenderId: "536618682711",
  
    appId: "1:536618682711:web:bcdbb646242b15d153d612",
  
    measurementId: "G-95KN2VBNCP"
  
  }

}