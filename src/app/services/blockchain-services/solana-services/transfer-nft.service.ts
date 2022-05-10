import { Injectable } from '@angular/core';
import { transferChecked } from '@solana/spl-token';
import { Keypair ,Connection, Transaction, sendAndConfirmTransaction, PublicKey} from "@solana/web3.js";

@Injectable({
  providedIn: 'root'
})
export class TransferNftService {
   solana = new Connection("https://api.testnet.solana.com/","confirmed")
  constructor() { }
  async transferNFT(
    feePayer:any,
    tokenAccountXPubkey:any,
    tokenAccountYPubkey:any,
    mintPubkey:any,
    owner:any){
      console.log("---------------------------------------inside transfer-----------------")
    let txhash = await transferChecked(
      this.solana, // connection
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
