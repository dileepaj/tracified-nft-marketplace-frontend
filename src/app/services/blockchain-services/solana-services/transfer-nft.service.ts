import { Injectable } from '@angular/core';
import { transferChecked } from '@solana/spl-token';

@Injectable({
  providedIn: 'root'
})
export class TransferNftService {

  constructor() { }
  async transferNFT(
    feePayer:any,
    connection:any,
    tokenAccountXPubkey:any,
    tokenAccountYPubkey:any,
    mintPubkey:any,
    owner:any){
    let txhash = await transferChecked(
      connection, // connection
      feePayer, // payer
      tokenAccountXPubkey, // from (should be a token account)
      mintPubkey, // mint
      tokenAccountYPubkey, // to (should be a token account)
      owner, // from's owner
      1e8, // amount, if your deciamls is 8, send 10^8 for 1 token
      8 // decimals
    );
    return txhash
  }
  
}
