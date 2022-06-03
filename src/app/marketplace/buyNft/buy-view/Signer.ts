
import { clusterApiUrl, Connection,Transaction as solanaTransaction,Signer as solanaSigner, PublicKey } from '@solana/web3.js';
export class Signer implements solanaSigner {
    publicKey: PublicKey;
    secretKey: Uint8Array;
}