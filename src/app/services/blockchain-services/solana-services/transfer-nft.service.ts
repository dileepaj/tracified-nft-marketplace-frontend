import { Injectable } from '@angular/core';
import { clusterApiUrl, Connection, Keypair ,PublicKey, Transaction, sendAndConfirmTransaction} from  "@solana/web3.js";
import { createTransferCheckedInstruction, getAssociatedTokenAddress, getOrCreateAssociatedTokenAccount } from  "@solana/spl-token";

@Injectable({
  providedIn: 'root'
})
export class TransferNftService {

  constructor() { }

  toTokenAccount;
  signers
  async createATA(
    from:Uint8Array,
    price:any,
    to:string,
    mintPubkey: PublicKey,
    ata:PublicKey): Promise<any>{
    return (async () => {
      // Connect to cluster
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    
      let fromKeypair = Keypair.fromSecretKey(from);
    

      const toTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        fromKeypair,
        new PublicKey(mintPubkey),
        new PublicKey(to)
      );

      const ata = await getAssociatedTokenAddress(
        new PublicKey(mintPubkey),
        fromKeypair.publicKey
      )
     
      const tx1 = new Transaction()
            tx1.add(
              createTransferCheckedInstruction(
                new PublicKey(ata),
                new PublicKey(mintPubkey),
                toTokenAccount.address,
                fromKeypair.publicKey,
                1,
                0, // decimals
                []
              ),
            )
            
       
       tx1.feePayer = fromKeypair.publicKey;
        var signature = await sendAndConfirmTransaction(
          connection,
          tx1,
          [fromKeypair],
          {skipPreflight:true}
        );
       
        alert("SUCCESS!");
      return signature;
    })();
  }
}
