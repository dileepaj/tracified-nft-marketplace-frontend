export const environment = {
  production: false,
  contractAddressMKPolygon: "0xbc43a57695EDe9d17069416Ee65B28a134Fe6618",
  contractAddressMKEthereum: "0x021Be8454D3A4CB2fa13375980E2Bbb38423874C",
  fromWallet: "9aE476sH92Vz7DMPyq5WLPkrKWivxeuTKEFKd2sZZcde",
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
  mode: 'qa',
  gatewayBaseURL: 'https://qa.gateway.tracified.com/',
  nftbackendBaseURL: 'https://qa.api.nft.tracified.com/',
  marketplaceBaseURL:"https://qa.marketplace.nft.tracified.com/",
  tracifiedhelpDocsbaseURL:"https://qa.help.tracified.com/",
  APIIntervalTimer: 60000,  // 30 seconds
  APIStartDelay: 60000, // 30 seconds
  homepageIntervalTimer: 600000 //10 minutes 600000

}

export const BlockchainConfig = {
  production: false,
  mode: 'qa',
  solananetwork: 'testnet',
  solananetworkURL:'https://api.testnet.solana.com',
  STELLAR_BASE_FEE : '50000',
  STELLAR_SPONSOR_KEY:"GBVVOHJKWKAVW4ZSKXNMC25IAKHJYXXK5E7BGD6EP3LXXVD5FEIYV4B3",
  STELLAR_MARKETPLACE_KEY:"GBVVOHJKWKAVW4ZSKXNMC25IAKHJYXXK5E7BGD6EP3LXXVD5FEIYV4B3"
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

