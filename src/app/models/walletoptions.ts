import { Memo, MemoType, Operation, Transaction } from 'stellar-sdk';
import { Wallet } from "./wallet";

export abstract class walletOptions extends Wallet{
    decoratorWallet:Wallet
    public abstract override initWallelt():Promise<void>;
    public  abstract override getWalletaddress(): string ;
    public abstract override disconenctWallet(): void;  
    public abstract override signTransaction(): any; 
}