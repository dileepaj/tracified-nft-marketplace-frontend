import { Injectable } from '@angular/core';
import { PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID,ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { async } from '@angular/core/testing';

@Injectable({
  providedIn: 'root'
})
export class GetAssociatedTokenAccountService {

  constructor() { }
  //  SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID: PublicKey = new PublicKey(
  //   'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
  // );

  async findAssociatedTokenAddress(
    walletAddress:any,
    tokenMintAddress:any
): Promise<PublicKey> {
  console.log("---------------------------------------inside ATA-----------------------")
    return (await PublicKey.findProgramAddress(
        [
            walletAddress.PubliKey.toBuffer(),
            TOKEN_PROGRAM_ID.toBuffer(),
            tokenMintAddress.PublicKey.toBuffer(),
        ],
        ASSOCIATED_TOKEN_PROGRAM_ID
    ))[0];
}

}
