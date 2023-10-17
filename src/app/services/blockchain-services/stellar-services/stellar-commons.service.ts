import { Injectable } from '@angular/core';
import { blockchainNetType } from 'src/app/shared/config';
import { ENV } from 'src/environments/environment';
import { Networks } from 'stellar-sdk';

@Injectable({
  providedIn: 'root'
})
export class StellarCommonsService {
  networkType: Networks;
  constructor() { }

  getNetwork() {
    let netWorkType = blockchainNetType === "live" ? Networks.PUBLIC : Networks.TESTNET
    return netWorkType;
  }
}
