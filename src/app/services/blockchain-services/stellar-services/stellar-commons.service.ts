import { Injectable } from '@angular/core';
import { blockchainNetType } from 'src/app/shared/config';
import { Networks } from 'stellar-sdk';

@Injectable({
  providedIn: 'root'
})
export class StellarCommonsService {
  networkType: Networks;

  constructor() { }

  getNetwork(){
    if (blockchainNetType === "live") {
     return Networks.PUBLIC
    } else {
      return Networks.TESTNET
    }

  }
}
