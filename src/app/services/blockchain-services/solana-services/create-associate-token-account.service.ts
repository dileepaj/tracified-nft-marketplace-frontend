import { Injectable } from '@angular/core';
import { createAssociatedTokenAccount } from '@solana/spl-token';

@Injectable({
  providedIn: 'root'
})
export class CreateAssociateTokenAccountService {

  constructor() { }
  async createATA(
    feePayer:any,
    connection:any,
    mintPubkey:any,
    owner:any){
    let ata = await createAssociatedTokenAccount(
      connection, // connection
      feePayer, // fee payer
      mintPubkey, // mint
      owner.publicKey // owner,
    );
  }
}
