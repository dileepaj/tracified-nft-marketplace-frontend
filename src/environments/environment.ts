export const environment = {
  production: false,
  contractAddressNFTPolygon: "0xE6F59c4A3118C0C00155b00331dF07b40DD85569",
  contractAddressMKPolygon: "0x86E328AD08b5e66B6AcBF7e03DAC74c7b723f5B7",
  contractAddressNFTEthereum: "0x6f09Ecb9e29bF5B1d2C9c39d126FF32dc089F34C",
  contractAddressMKEthereum: "0x7D591543D2A09ef03AaB1490083943fC69c352Ec",
  fromWallet: "4wtzfvaCWvYxzmdh4ajQoj8ep5AuJtUeV8rW3D5biCT7",
  tracifiedStellarPK : "GDL7U4NZ6JGENCU7GMW2TQ3OQUE7NCUUFC7PG6SRAHNQWYGNP77XXYCV",
  tracifiedSolanaPK : "FfEztWGUyS7FjdxS6SPenpNiFmABBc3jLpLSPvPq1QP7"

};
export const ENV: any = {
  production: false,
  mode: 'staging',
  API_TRACIFIED_V1: 'https://api.tracified.com/api/v1',
  API_TRACIFIED: 'https://api.tracified.com/api/v2',
  GATEWAY: 'https://gateway.tracified.com',
  API_ADMIN: 'https://admin.api.tracified.com',
  APPCENTER_DEPLOYMENT_KEY: 'BcfHYi-Gexwau0ZS3Q0RmtoJqsTx2_Bln3Qkc',
  BLOCKCHAIN_NETWORK: 'https://horizon-testnet.stellar.org',
  NETWORK_TYPE: 'testnet' ,
  NETWORK: 'TESTNET'
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
  gatewayBaseURL: 'http://localhost:8000/',
  nftbackendBaseURL: 'https://qa.api.nft.tracified.com/',
  marketplaceBaseURL:"http://localhost:4200/",
  tracifiedhelpDocsbaseURL:"https://qa.help.tracified.com/",
  APIIntervalTimer: 60000,  // 30 seconds
  APIStartDelay: 60000, // 30 seconds
  homepageIntervalTimer: 600000 //10 minutes 600000

}

export const BlockchainConfig = {
  production: false,
  mode: 'qa',
  solananetwork: 'devnet',
  solananetworkURL:'https://api.devnet.solana.com'
}

export const FirebaseConfig = {
  firebaseConfig: {

    apiKey: "AIzaSyBY9TcEIKgfeuqVzJzE_1zmhX4CxPZnZJU",

    authDomain: "tracified-mithila-8f54a.firebaseapp.com",

    projectId: "tracified-mithila-8f54a",

    storageBucket: "tracified-mithila-8f54a.appspot.com",

    messagingSenderId: "536618682711",

    appId: "1:536618682711:web:93d5e4e2cc9cc30753d612",

    measurementId: "G-QK75KDSFNQ"
  }

}

