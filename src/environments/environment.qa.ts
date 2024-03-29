export const environment = {
  production: false,
  contractAddressMKPolygon: '0xbc43a57695EDe9d17069416Ee65B28a134Fe6618',
  contractAddressMKEthereum: '0xa1E21bEB814524F34d4B236dB18e31Db11EB233b',
  fromWallet: '9aE476sH92Vz7DMPyq5WLPkrKWivxeuTKEFKd2sZZcde',
  tracifiedStellarPK:
    'GDL7U4NZ6JGENCU7GMW2TQ3OQUE7NCUUFC7PG6SRAHNQWYGNP77XXYCV',
  tracifiedSolanaPK: 'FfEztWGUyS7FjdxS6SPenpNiFmABBc3jLpLSPvPq1QP7',
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
  NETWORK_TYPE: 'TEST',
  NETWORK: 'TESTNET',
};

export const adminENV = {
  production: false,
  name: 'qa',
  backendUrl: 'https://qa.api.tracified.com',
  adminUrl: 'https://qa.admin.api.tracified.com',
  composerBackend: 'https://qa.api.nft.tracified.com',
  gateway: 'https://qa.gateway.tracified.com',
  domain: '.tracified.com',
};

export const APIConfigENV = {
  production: false,
  mode: 'qa',
  gatewayBaseURL: 'https://qa.gateway.tracified.com/',
  nftbackendBaseURL: 'https://qa.api.nft.tracified.com/',
  marketplaceBaseURL: 'https://qa.nft.tracified.com/',
  tracifiedhelpDocsbaseURL: 'https://qa.help.tracified.com/',
  APIIntervalTimer: 60000, // 30 seconds
  APIStartDelay: 60000, // 30 seconds
  homepageIntervalTimer: 600000, //10 minutes 600000
};

export const BlockchainConfig = {
  production: false,
  mode: 'qa',
  solananetwork: 'testnet',
  solananetworkURL: 'https://api.testnet.solana.com',
  STELLAR_BASE_FEE: '50000',
  STELLAR_SPONSOR_KEY:
    'GBVVOHJKWKAVW4ZSKXNMC25IAKHJYXXK5E7BGD6EP3LXXVD5FEIYV4B3',
  STELLAR_MARKETPLACE_KEY:
    'GBVVOHJKWKAVW4ZSKXNMC25IAKHJYXXK5E7BGD6EP3LXXVD5FEIYV4B3',
};

export const FirebaseConfig = {
  firebaseConfig: {
    apiKey: 'AIzaSyBY9TcEIKgfeuqVzJzE_1zmhX4CxPZnZJU',

    authDomain: 'tracified-mithila-8f54a.firebaseapp.com',

    projectId: 'tracified-mithila-8f54a',

    storageBucket: 'tracified-mithila-8f54a.appspot.com',

    messagingSenderId: '536618682711',

    appId: '1:536618682711:web:71408c69e0dac9fb53d612',

    measurementId: 'G-HLHP3146ZQ',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
