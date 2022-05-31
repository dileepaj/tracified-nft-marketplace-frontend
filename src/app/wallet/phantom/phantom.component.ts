import { Component, OnInit } from '@angular/core';
import { Wallet } from 'src/app/models/wallet';
import { walletOptions } from 'src/app/models/walletoptions';
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL ,PublicKey, SystemProgram, Transaction} from  "@solana/web3.js";
import { WalletName, WalletReadyState } from '@solana/wallet-adapter-base';

@Component({
  selector: 'app-phantom',
  templateUrl: './phantom.component.html',
  styleUrls: ['./phantom.component.css']
})
export class PhantomComponent extends walletOptions implements OnInit {
  public signTransaction() {
    throw new Error('Method not implemented.');
  }
  public buynft(blockchain: string, nftcontract: string, tokenId: number, price: number, listingPrice: string): Promise<any> {
    throw new Error('Method not implemented.');
  }

  public async createSaleOffer(): Promise<any> {
    //! remove this code
    const network = "<NETWORK_URL>";
    const connection = new Connection(network);
    const transaction = new Transaction();
    const { signature } = await (window as any).solana.signAndSendTransaction(transaction);
    await connection.confirmTransaction(signature);
    //! -----------------------------------------------
  }
  
  override walletAddress: string;
  constructor(wallet: Wallet) {
    super();
    this.decoratorWallet = wallet;
  }

  ngOnInit(): void {
  }

  override async initWallelt(): Promise<void> {
    try {
        const resp = await (window as any).solana.connect();
        this.walletAddress= resp.publicKey.toString()
        console.log("pk:",this.walletAddress)
    } catch (err) {
        console.log("cant get address :",err)
    }
  }
  override getWalletaddress(): string {
    return this.walletAddress;
  }
  override disconenctWallet(): void {
    (window as any).solana.disconnect()
    (window as any).solana.on('disconnect',()=>{console.log("Disconnected")})
  }

  public override async signTransactionPhantom(userPK:string,tracifiedAta:string) :Promise<void> {
  //   const { connection } = useConnection();
  //   const { publicKey, sendTransaction } = useWallet();
  //   const transaction = new Transaction()
  //   .add(
  //     TokenProgram.getOrCreateAssociatedTokenAccount({
  //         fromPubkey: new PublicKey(userPK),
  //         toPubkey: new PublicKey(tracifiedAta),
  //         lamports: 1,
  //     })
  // )
  //   .add(
  //     SystemProgram.transfer({
  //         fromPubkey: new PublicKey(userPK),
  //         toPubkey: new PublicKey(tracifiedAta),
  //         lamports: 1,
  //     })
  // );

  //   const signature = await sendTransaction(transaction, connection);

  }
  

}
