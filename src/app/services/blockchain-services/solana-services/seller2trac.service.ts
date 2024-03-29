import { Injectable } from '@angular/core';
import {
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
  Transaction,
} from '@solana/web3.js';
import {
  createTransferCheckedInstruction,
  getAssociatedTokenAddress,
} from '@solana/spl-token';
import { BlockchainConfig } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Seller2tracService {
  constructor() {}
  toTokenAccount;
  signers;
  async createATAforSellar(
    from: string, //* User PK
    to: string,
    mintPubkey: PublicKey
  ): Promise<Transaction> {
    return (async () => {
      // Connect to cluster
      const network: any = BlockchainConfig.solananetworkURL;
      const connection = new Connection(network);

      // let toKeypair = Keypair.fromSecretKey(to);

      const atafrom = await getAssociatedTokenAddress(
        new PublicKey(mintPubkey),
        new PublicKey(from)
      );

      const atato = await getAssociatedTokenAddress(
        new PublicKey(mintPubkey),
        new PublicKey(to)
      );

      const tx = new Transaction();
      tx.add(
        createTransferCheckedInstruction(
          new PublicKey(atafrom),
          new PublicKey(mintPubkey),
          new PublicKey(atato),
          new PublicKey(from),
          1,
          0, // decimals
          []
        )
      );

      tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

      tx.feePayer = new PublicKey(from);
      return tx;
    })();
  }

  async findATA(to: string, mint: string) {
    const atato = await getAssociatedTokenAddress(
      new PublicKey(mint),
      new PublicKey(to)
    );

    return atato.toString();
  }
}
