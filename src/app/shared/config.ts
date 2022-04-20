//import { ENV } from '@app/env';
import { ENV } from 'src/environments/environment';

const gateway = ENV.GATEWAY;
const blockchainNetwork = ENV.BLOCKCHAIN_NETWORK;
const blockchainType = ENV.NETWORK_TYPE;
const backend = ENV.API_TRACIFIED;
const backendv1 = ENV.API_TRACIFIED_V1;


// Backend GET

export const identifierStatus: string = backend + '/identifiers/status';

// Blockchain access point

export const blockchainNet: string = blockchainNetwork;
export const blockchainNetType: string = blockchainType;

export const currency: string = 'Lumens';
export const mainAccountBalance: number = 1;
