import { Injectable } from '@angular/core';
import { clusterApiUrl, Connection, Keypair ,PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL} from  "@solana/web3.js";
import { BlockchainConfig } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransferServiceChargeService {

  constructor() { }
  toTokenAccount;
  signers
  async transferServiceCharge(
    to:string,
   ): Promise<Transaction>{
    return (async () => {
      // Connect to cluster
      const network :any =BlockchainConfig.solananetwork;
      const connection = new Connection(clusterApiUrl(network), "confirmed");
     console.log("we here")
   
      const tx = new Transaction()
            tx.add(
                SystemProgram.transfer({
                fromPubkey: new PublicKey(to),
                toPubkey: new PublicKey("FfEztWGUyS7FjdxS6SPenpNiFmABBc3jLpLSPvPq1QP7"),
                lamports: 20000, //service charge
              }),
               )
               tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    
               tx.feePayer = new PublicKey(to);
          
      
      return tx;
    })();
  }
}
