import { PhantomComponent } from 'src/app/wallet/phantom/phantom.component';
import { UserWallet } from 'src/app/models/userwallet';
import { Injectable } from '@angular/core';
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL ,PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction} from  "@solana/web3.js";
import { createAssociatedTokenAccountInstruction, createMint, createTransferCheckedInstruction, getOrCreateAssociatedTokenAccount, mintTo, setAuthority, transfer } from  "@solana/spl-token";
import { environment } from 'src/environments/environment';
import { WalletName, WalletReadyState } from '@solana/wallet-adapter-base';
import {  } from '@solana/buffer-layout';


@Injectable({
  providedIn: 'root'
})
export class Seller2tracService {
  
  constructor() { }
  toTokenAccount
  async createATA(
    from:string, //* User PK
    to:Uint8Array,
    mintPubkey: PublicKey,
    ata:PublicKey): Promise<any>{
  
    (async () => {
      // Connect to cluster
      const connection = new Connection(clusterApiUrl("testnet"), "confirmed");
      // Generate a new wallet keypair and airdrop SOL
      let toKeypair  = Keypair.fromSecretKey(to);
    
      
      // Get the token account of the fromWallet Solana address. If it does not exist, create it.
      // const toTokenAccount = await getOrCreateAssociatedTokenAccount(
      //   connection,
      //   toKeypair,
      //   new PublicKey(mintPubkey),
      //   toKeypair.publicKey
      // );
      const tx = new Transaction()
      .add(
          this.toTokenAccount = createAssociatedTokenAccountInstruction(
          new PublicKey(from),
          toKeypair.publicKey,
          new PublicKey(from),
          new PublicKey(mintPubkey)
        )
      )
      .add(
        createTransferCheckedInstruction(
          new PublicKey(from), // from (should be a token account)
          mintPubkey, // mint
          new PublicKey(this.toTokenAccount), // to (should be a token account)
          new PublicKey(from), // from's owner
          1e8, // amount, if your deciamls is 8, send 10^8 for 1 token
          8 // decimals
        )
      );
      //tx.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
      tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      tx.feePayer =  new PublicKey(from);
      console.log("tx that will be returned : ",tx)
    
      //const { publicKey, sendTransaction } =new  WalletStore();
       //let fromKeypair  = Keypair.fromSecretKey(from);
        //let signature =  await transfer (
            
            // connection,
            // new PublicKey(from),               // Payer of the transaction fees 
            // new PublicKey(ata), // Source account 
            // toTokenAccount.address,   // Destination account 
            // from,     // Owner of the source account 
            // 1                         // Number of tokens to transfer 
        //  );
    
      //console.log("SIGNATURE", signature);
      //let array=[this.toTokenAccount.address.toString(),tx]
      return tx
    })();
  }
}