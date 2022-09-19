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
    blockchain: string,
    nftcontract: string,
    tokenId: number,
    price: number,
    listingPrice: string
  ) {}
  buynft(
    blockchain: string,
    nftcontract: string,
    tokenId: number,
    price: number,
    listingPrice: string
  ) {}
  signTransactionPhantom(userPK: string, tracifiedAta: string) {}
  getBalance(publicKey : string, _callback : any) {}
}
