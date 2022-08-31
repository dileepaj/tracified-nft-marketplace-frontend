import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {

  constructor() { }
  List:any[]=[{topic:"What is Ethereum",desc:"Blockchain underwent a revolution with the introduction of Bitcoin, but other latecomers, like Ethereum, have gained just as much support as Bitcoin, if not more. The Ethereum Blockchain is a decentralized, open-source platform that was first introduced in 2015. Since its debut, Ethereum has accomplished a number of significant milestones. The collaboration between Microsoft and ConsenSys is one of the platform's most notable recent accomplishments. Through the cooperation, developers and organizations using Microsoft Azure will have access to Ethereum Blockchain as a Service (EBaaS). The Ethereum network functions the same as every other Blockchain network. Different nodes known as miners evaluate each new transaction after it has been logged. To update the transaction in the decentralized ledger, these miners run the program code on their computer. For each piece of code they run or each transaction they add to the chain, miners are rewarded 3 ether. The output of each miner's code is added to the consensus, which is then inspected to verify the most recent transaction for efficient network-wide transactions."},
  {topic:"What is Polygon",desc:"The Polygon blockchain project is a framework for building and connecting Ethereum-compatible blockchain networks as well as a scaling solution for Ethereum. Low throughput and high transaction fees are two of the most serious problems the Ethereum ecosystem is now dealing with, and they are challenges that the protocol seeks to address."},
  {topic:"What is Stellar",desc:"Jed McCaleb founded Stellar, an Open source payment technology blockchain in 2014 with the intention of bridging the gap between all financial institutions and lowering the cost and time of international transfers significantly. The fundamental workings of stellar are comparable to the payment systems used by many decentralized platforms. A distributed ledger that is updated among all nodes every 2 to 5 seconds is used by Stellar to run on decentralized servers. The Stellar consensus does not rely on the network of miners to approve transactions. It uses the Federated Byzantine Agreement (FBA) algorithm, which uses quorum slices to validate and accept the transaction, allowing the transaction to execute swiftly. Every node in the network chooses a different group of reliable nodes. Once all of the nodes in the set have authorized the transaction, it is deemed to be approved. The approval process for transactions made the Stellar network extremely quick. Due to this, it claims to process approx 1000 network operations in one second."},
  {topic:"What is Solana",desc:"Solana is basically just another blockchain network optimized for producing cryptocurrencies such as Bitcoin and Ethereum. It is a superior substitute for Ethereum, especially in terms of transaction speed. In actuality, the new blockchain platform could execute transactions at a rate of approximately 50,000 per second with ease. Within a few seconds, SOL may quickly integrate a variety of qualities into the current network, such as application development or SOL token mining. The cryptocurrency has rightfully established itself as Ethereum's rival."},
  {topic:"What is NFT",desc:"NFT (Non - Fungible Token) is a representation of a real-world item, such as artwork, music, in-game items, or films in digital format. They are regularly purchased and traded online in exchange for cryptocurrencies, and they are typically encoded using the same software as many other cryptos."}];

  ngOnInit(): void {
    console.log("List :", this.List)
  }

}
