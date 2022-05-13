import { Injectable } from '@angular/core';
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL ,PublicKey} from  "@solana/web3.js";
import { createMint, getOrCreateAssociatedTokenAccount, mintTo, setAuthority, transfer } from  "@solana/spl-token";
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class Seller2tracService {
  
  constructor() { }

  async createATA(
    from:Uint8Array,
    to:Uint8Array,
    mintPubkey: PublicKey,
    ata:PublicKey){
  
    (async () => {
      // Connect to cluster
      const connection = new Connection(clusterApiUrl("testnet"), "confirmed");
    
      // Generate a new wallet keypair and airdrop SOL
      console.log(to);
      let toKeypair  = Keypair.fromSecretKey(to);
      console.log("fromKeypair",toKeypair)
      console.log("public key from fromKeypair",toKeypair.publicKey)

      
    
      
  
    console.log("Destination acquired");
    console.log("Mint public key",mintPubkey);
      
      // Get the token account of the fromWallet Solana address. If it does not exist, create it.
      const toTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        toKeypair,
        new PublicKey(mintPubkey),
        toKeypair.publicKey
      );
      console.log("ata of trac",toTokenAccount)
      console.log("ata of trac",toTokenAccount.address.toString())
    
    
  
       console.log(from);
       let fromKeypair  = Keypair.fromSecretKey(from);
       console.log("fromKeypair",fromKeypair)
       console.log("public key from fromKeypair",fromKeypair.publicKey)
      
       console.log("The ATA of the seller",ata)
    //---------------------------------------------
     let signature = await transfer(
        connection,
        fromKeypair,               // Payer of the transaction fees 
        new PublicKey(ata), // Source account 
        toTokenAccount.address,   // Destination account 
        fromKeypair,     // Owner of the source account 
        1                         // Number of tokens to transfer 
      );
    
      console.log("SIGNATURE", signature);
      console.log("-----------------------transferred--------------first buy");
      return toTokenAccount.address.toString()
    })();
  }
}





