import { base58 } from 'ethers/lib/utils';
import { getPublicKey } from '@stellar/freighter-api';
import { Injectable } from '@angular/core';
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL ,PublicKey, Transaction,Signer as solsigner, SystemProgram} from  "@solana/web3.js";
import { createAssociatedTokenAccountInstruction, createMint, createTransferCheckedInstruction, getAssociatedTokenAddress, getOrCreateAssociatedTokenAccount, mintTo, setAuthority, transfer } from  "@solana/spl-token";
import { environment } from 'src/environments/environment';
import { type } from 'os';
import { uint8ArrayToBuffer } from '@solana/buffer-layout';



@Injectable({
  providedIn: 'root'
})
export class Trac2buyerService {
  
  constructor() { }
  toTokenAccount;
  signers
  async createATA(
    from:Uint8Array,
    to:string,
    mintPubkey: PublicKey,
    ata:PublicKey): Promise<Transaction>{
    return (async () => {
      // Connect to cluster
      const connection = new Connection(clusterApiUrl("testnet"), "confirmed");
      console.log("param data:", from, to, mintPubkey);
      // Generate a new wallet keypair and airdrop SOL
      // const toWallet = Keypair.generate();
      // const fromAirdropSignature = await connection.requestAirdrop(
      //   toWallet.publicKey,
      //   LAMPORTS_PER_SOL
      // );
      // // Wait for airdrop confirmation
      // await connection.confirmTransaction(fromAirdropSignature);
      // Get the token account of the fromWallet Solana address. If it does not exist, create it.
      let fromKeypair = Keypair.fromSecretKey(from);
      console.log("from keypari PK : ",fromKeypair.publicKey.toString())

      const toTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        fromKeypair,
        new PublicKey(mintPubkey),
        new PublicKey(to)
      );

      console.log("VAL---------> : ", toTokenAccount.address.toString())

      const ata = await getAssociatedTokenAddress(
        new PublicKey(mintPubkey),
        fromKeypair.publicKey
      )

      //  let signature = await transfer(
      //     connection,
      //     toWallet,               // Payer of the transaction fees 
      //     new PublicKey(ata), // Source account 
      //     toTokenAccount.address,   // Destination account 
      //     fromKeypair,     // Owner of the source account 
      //     1                         // Number of tokens to transfer 
      //   );
    //  console.log("to token account",toTokenAccount)
      //console.log("fromkeypari val : ", fromKeypair);
      console.log("ATA : ",ata.toString())
      const tx = new Transaction()
            // .add(
            //     SystemProgram.transfer({
            //     fromPubkey: fromKeypair.publicKey,
            //     toPubkey: new PublicKey(to),
            //     lamports: LAMPORTS_PER_SOL / 100,
            //   }),
            // )
        // .add(
        //    this.toTokenAccount =createAssociatedTokenAccountInstruction(
        //     new PublicKey(to),
        //     ata,
        //     new PublicKey(to),
        //     mintPubkey
        //   )
        // )
        .add(
          createTransferCheckedInstruction(
            new PublicKey(ata),
            new PublicKey(mintPubkey),
            toTokenAccount.address,
            fromKeypair.publicKey,
            1e8,
            8, // decimals
            []
          ),
        )
        // console.log("toTokenAccount VAL : ", toTokenAccount.address.toString())
        // console.log("ATA VAL : ", ata.toString())
        // console.log("Mint Pubkey VAL : ", mintPubkey.toString())

      // tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      // console.log("latest block hash : ",tx.recentBlockhash)
      // tx.feePayer = new PublicKey(to);
      // console.log("tx that will be returned : ", tx);
       const blockHash = await connection.getLatestBlockhash()
      tx.feePayer = new PublicKey(to)
      tx.recentBlockhash = blockHash.blockhash
      //let array=[toTokenAccount.address.toString(),signature]
      return tx;
    })();
  }
}





