import { Injectable } from '@angular/core';
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL ,PublicKey} from  "@solana/web3.js";
import { createMint, getOrCreateAssociatedTokenAccount, mintTo, setAuthority, transfer } from  "@solana/spl-token";
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class Trac2buyerService {
  
  constructor() { }

  async createATA(
    from:Uint8Array,
    mintPubkey: PublicKey,
    ata:PublicKey): Promise<any>{
  
    (async () => {
      // Connect to cluster
      const connection = new Connection(clusterApiUrl("testnet"), "confirmed");
    
      // Generate a new wallet keypair and airdrop SOL
      const toWallet = Keypair.generate();
      const fromAirdropSignature = await connection.requestAirdrop(
        toWallet.publicKey,
        LAMPORTS_PER_SOL
      );

    
      // Wait for airdrop confirmation
      await connection.confirmTransaction(fromAirdropSignature);
      
      // Get the token account of the fromWallet Solana address. If it does not exist, create it.
      const toTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        toWallet,
        new PublicKey(mintPubkey),
        toWallet.publicKey
      );
     
       let fromKeypair  = Keypair.fromSecretKey(from);
      
     let signature = await transfer(
        connection,
        toWallet,               // Payer of the transaction fees 
        new PublicKey(ata), // Source account 
        toTokenAccount.address,   // Destination account 
        fromKeypair,     // Owner of the source account 
        1                         // Number of tokens to transfer 
      );
    
      console.log("SIGNATURE", signature);
      let array=[toTokenAccount.address.toString(),signature]
      return array
    })();
  }
}





