import { Injectable } from '@angular/core';
import { clusterApiUrl, Connection, Keypair ,PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL} from  "@solana/web3.js";


@Injectable({
  providedIn: 'root'
})
export class Trac2buyerService {
  
  constructor() { }
  toTokenAccount;
  signers
  async createATA(
    from:Uint8Array,
    price:number,
    to:string,
    mintPubkey: PublicKey,
    ata:PublicKey): Promise<Transaction>{
    return (async () => {
      // Connect to cluster
      const connection = new Connection(clusterApiUrl("testnet"), "confirmed");
     
      let fromKeypair = Keypair.fromSecretKey(from);
   
      const tx = new Transaction()
            tx.add(
                SystemProgram.transfer({
                fromPubkey: new PublicKey(to),
                toPubkey: fromKeypair.publicKey,
                lamports: LAMPORTS_PER_SOL/10,
              }),
               )
       
       tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
       tx.feePayer = new PublicKey(to);
      
      return tx;
    })();
  }
}





