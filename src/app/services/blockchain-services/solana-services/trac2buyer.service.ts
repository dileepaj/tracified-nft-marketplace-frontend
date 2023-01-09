import { Injectable } from '@angular/core';
import { clusterApiUrl, Connection, Keypair ,PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL} from  "@solana/web3.js";
import { BlockchainConfig } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class Trac2buyerService {
  
  constructor() { }
  toTokenAccount;
  signers
  async createATA(
    price:any,
    to:string,
  
    royalty:any,
    owner:string,
    prevownerpk:string,
    commission:string,): Promise<Transaction>{
    return (async () => {
      // Connect to cluster
      const network :any =BlockchainConfig.solananetwork;
      const connection = new Connection(clusterApiUrl(network), "confirmed");
     
      let commissioncharge=(parseFloat(commission))*1000000000
      let totalprice = (price)* 1000000000
      let royalties = royalty * 1000000000
   
      const tx = new Transaction()
            tx.add(
                SystemProgram.transfer({
                fromPubkey: new PublicKey(to),
                toPubkey: new PublicKey(prevownerpk),
                lamports: totalprice,
              }),
               )
               .add(
                SystemProgram.transfer({
                fromPubkey: new PublicKey(to),
                toPubkey: new PublicKey(owner),
                lamports: royalties,
              }),
               )
               .add(
                SystemProgram.transfer({
                fromPubkey: new PublicKey(to),
                toPubkey: new PublicKey("FfEztWGUyS7FjdxS6SPenpNiFmABBc3jLpLSPvPq1QP7"),//commission
                lamports: commissioncharge,
              }),
               )
       
       tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
       tx.feePayer = new PublicKey(to);
      
      return tx;
    })();
  }
}





