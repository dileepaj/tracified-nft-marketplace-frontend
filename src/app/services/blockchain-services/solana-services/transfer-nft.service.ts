import { Injectable } from '@angular/core';
import { clusterApiUrl, Connection, Keypair ,PublicKey, Transaction, sendAndConfirmTransaction} from  "@solana/web3.js";
import { createTransferCheckedInstruction, getAssociatedTokenAddress, getOrCreateAssociatedTokenAccount } from  "@solana/spl-token";
import { APIConfigENV, BlockchainConfig } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  reqOpts: { observe: string; headers: HttpHeaders; };
  constructor(private http: HttpClient) { }

  toTokenAccount;
  signers
 
  createServiceATAforTransfer(
    from:string,
    to:string,
    mintPubkey: string,
    status:string
  ){
    this.reqOpts = {
      observe: "response",
      headers: new HttpHeaders({
        Accept: "application/json",
        "Content-Type": "Application/json",
      }),
    };
    let atamodel = {
      Source:from,
      Destination:to,
      MintPubKey:mintPubkey,
      Status:status
    }
    return this.http.post(this.urlATAforTransfer, atamodel,{headers: this.headers});
  }


 }


