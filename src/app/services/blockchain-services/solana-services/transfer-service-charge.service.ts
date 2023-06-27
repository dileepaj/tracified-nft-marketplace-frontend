import { Injectable } from '@angular/core';
import { clusterApiUrl, Connection, Keypair ,PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL} from  "@solana/web3.js";
import { BlockchainConfig, environment } from 'src/environments/environment';

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
    const networkURL :any =BlockchainConfig.solananetworkURL;
      const connection = new Connection(networkURL);
   
      const tx = new Transaction()
            tx.add(
                SystemProgram.transfer({
                fromPubkey: new PublicKey(to),
                toPubkey: new PublicKey(environment.tracifiedSolanaPK),
                lamports: 20000, //service charge
              }),
               )
               tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
    
               tx.feePayer = new PublicKey(to);
          
      
      return tx;
    })();
  }
}
