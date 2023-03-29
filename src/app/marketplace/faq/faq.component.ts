import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { APIConfigENV } from 'src/environments/environment';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
  private readonly tracifiedhelp = APIConfigENV.tracifiedhelpDocsbaseURL
  readonly helpDocsMK: string = `${this.tracifiedhelp}docs/NFTPlatofrm/marketplace/introtoMarketplace`
  constructor(private router: Router) { }
  List:any[]=[
    {
      topic:"What is a NFT?",
      desc:`
        <p>
          NFT (Non - Fungible Token) is a representation of a real-world item, such as artwork, music, in-game items, or films in digital format. They are regularly purchased and traded online in exchange for cryptocurrencies, and they are typically encoded using the same software as many other cryptos.
        </p>
      `
    },
    {
      topic:"How to get your account Endorsed",
      desc:`
        <p>Before you mint, if your public key has not been endorsed before, you will be prompted to a registration screen, in which you need to fill your/organizational details. After the Submitting the Tracified marketplace team will respond to your endorsment within <strong>48 hours</strong>. In oder to verify your details and identity and finish the endorsment process</p>

        <p>If you or your organization gets endorsment. Access to mint NFTs will be provided.
      `
    },
    {
      topic:"Why is it necessary get endorsed?",
      desc:`
        <p>It means you have been recognized by Tracified, as a legitimate entity with the power to mint your own NFTs.</p>
      `
    },
    {
      topic:"How do you know you have been endorsed ?",
      desc:`
        <p>
        Once a request via the registration has been sent, Tracified marketplace admin will review and accept / decline. The result would be sent via your registered mail in <strong>48 working hours
        </strong></p>
      `
    },
    {
      topic:"How to view blockchain transactions?",
      desc:`
        <p>
        Using the transaction hashes, displayed in a table format under the NFT overview when selling and buying, you can either click the link that routes you to a blockchain explorer or you yourself can copy the transaction hash and insert it into the search box of the ideal explorer. </p>
        <strong> Refer below table to access respective block explores</strong><br>
        <table>
            <tr>
                <td><strong>Blockchain</strong></td>
                <td><strong>Link to block explorer</strong></td>
            </tr>
            <tr>
                 <td>Stellar</td>
                 <td><a href="https://stellar.expert/explorer/public" target="_blank">Stellar Expert</a></td>
            </tr>
            <tr>
                 <td>Solana</td>
                 <td><a href="https://solscan.io/" target="_blank">SolScan</a></td>
            </tr>
            <tr>
                 <td>Polygon</td>
                 <td><a href=" https://polygonscan.com/" target="_blank">PolyScan</a></td>
            </tr>
            <tr>
                 <td>Ethereum </td>
                 <td><a href="https://etherscan.io/" target="_blank">EtherScan</a></td>
            </tr>
        </table>
      `
    },
    {
      topic:"What is a Collection? How do I create One?",
      desc:`
        <p>
          A Collection acts as a Container that will allow you to group similar NFTs to gether.A new collection can be created by clicking on the plus icon in the minting screen.This will open a form to enter the collection name. upon submission the newly created collection will get added to the drop down list. where all your other created collection reside
        </p>
      `
    },
    {
      topic:"What blockchain should choose when minting a NFT?",
      desc:`
        <p>
          Unlike other marketplaces out there. Tracified marketplace offers its users the ability to mint using four blockchains Ethereum, Polygon,Solana and stellar. It is import to know the differences and traits of each blockchain prior to minting your NFT. Refer our <a target="_blank" href="`+this.helpDocsMK+`"> documentation </a> section for more information
        </p>
      `
    },
  ];

  ngOnInit(): void {
   
  }

  sendtoContactUsPage(){
    this.router.navigate(['./contact-us'])
  }

}
