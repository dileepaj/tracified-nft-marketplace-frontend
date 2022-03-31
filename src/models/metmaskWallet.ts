import { Iwallet } from "./interfaces/Iwallet";

export class MetaMask implements Iwallet{
    walletAddress: string;
    currentUserAddress: string;
    async initWallelt(): Promise<void> {
        if (typeof (window as any).ethereum.request  !== 'undefined') {
            console.log('MetaMask is installed!');
            const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' })
              .catch((e: { message: any; }) => {
                console.error(e.message)
                return
              })
              this.walletAddress=accounts;
              console.log(accounts)
          }
    }
    
}