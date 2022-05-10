import { Injectable } from '@angular/core';
import { createAssociatedTokenAccount } from '@solana/spl-token';
import { Keypair ,Connection, Transaction, sendAndConfirmTransaction, PublicKey} from "@solana/web3.js";
@Injectable({
  providedIn: 'root'
})
export class CreateAssociateTokenAccountService {
  solana = new Connection("https://api.testnet.solana.com/","confirmed")
  constructor() { }
  async createATA(
    feePayer:any,
    mintPubkey:any,
    owner:any){
    let ata = await createAssociatedTokenAccount(
      this.solana, // connection
      feePayer, // fee payer
      mintPubkey, // mint
      owner // owner,
    );
    return ata
  }
}
