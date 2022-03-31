import { Iwallet } from './interfaces/Iwallet';
export class PhantomWallet implements Iwallet {
    walletAddress: string;
    currentUserAddress: string;
    initWallelt(): void {
        (window as any).solana.connect();
        (window as any).solana.request({method:"connect"})
    }
}