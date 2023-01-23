import { Injectable } from '@angular/core';
import { clusterApiUrl, Connection, Keypair ,PublicKey, Transaction, sendAndConfirmTransaction} from  "@solana/web3.js";
import { createTransferCheckedInstruction, getAssociatedTokenAddress, getOrCreateAssociatedTokenAccount } from  "@solana/spl-token";
import { APIConfigENV, BlockchainConfig } from 'src/environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NFT } from 'src/app/models/minting';

@Injectable({
  providedIn: 'root'
})
export class TransferNftService {
  private readonly gateWayBaseURL = APIConfigENV.gatewayBaseURL
  readonly headers = new HttpHeaders()
    .set('Content-Type', 'application/json');
 
  urlATAforTransfer = this.gateWayBaseURL+'atatransfer'
  http: any;
  constructor() { }

  toTokenAccount;
  signers
  async createATAforTranfer(
    from:Uint8Array,
    price:any,
    to:string,
    mintPubkey: PublicKey,
    ata:PublicKey): Promise<any>{
    return (async () => {
      // Connect to cluster
      const networklink:any=BlockchainConfig.solananetworkURL
     const connection = new Connection(networklink)
    
 
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
       tx1.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
     
        var signature = await sendAndConfirmTransaction(
          connection,
          tx1,
          [fromKeypair],
          {skipPreflight:true}
        );
       
      return signature;
    })();
  }

  createServiceATAforTransfer(
    from:string,
    to:string,
    mintPubkey: PublicKey,
  ):Observable<string>{

    const atamodel = {
      from:from,
      to:to,
      mintPubkey:mintPubkey,

    }
    return this.http.post(this.createATAforTranfer, atamodel, {headers: this.headers});
  }
}


