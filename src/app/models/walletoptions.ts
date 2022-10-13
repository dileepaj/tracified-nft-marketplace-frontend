import { Memo, MemoType, Operation, Transaction } from 'stellar-sdk';
import { Wallet } from "./wallet";

export abstract class walletOptions extends Wallet{
    decoratorWallet:Wallet
    public abstract override initWallelt():Promise<void>;
    public  abstract override getWalletaddress(): string ;
    public abstract override disconenctWallet(): void;  
    public abstract override signTransaction(): any; 
    public abstract override createSaleOffer(blockchain:string,nftcontract: string,tokenId:number,price:string,listingPrice :string):Promise<any>;
    public abstract override buynft(blockchain:string,nftcontract: string,tokenId:number,price:string,listingPrice :string,royalty:string,seller:string):Promise<any>;
    public override signTransactionPhantom(userPK:string,tracifiedAta:string){}
    
}