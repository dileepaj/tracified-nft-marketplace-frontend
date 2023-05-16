import { Memo, MemoType, Operation, Transaction } from 'stellar-sdk';

export abstract class Wallet {
  walletAddress: string;
  currentUserAddress: string;
  initWallelt(_callback?: any) {
    return;
  }
  getWalletaddress(): string {
    return '';
  }
  disconenctWallet(): void {}
  signTransaction(transaction: Transaction<Memo<MemoType>, Operation[]>): any {}
  createSaleOffer(
    blockchain:string,
    status: string,
    nftsvgHash: string,
    _callback? : any
  ) {}
  buynft(
    blockchain: string,
    _itemID: string,
    _nftaddress: string,
    _callback? : any
  ) {}
  signTransactionPhantom(userPK: string, tracifiedAta: string) {}
  getBalance(publicKey : string, _callback : any) {}
}
