import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.css'],
})
export class DocumentationComponent implements OnInit {
  topic: any;
  showTopics: boolean = true;
  smallScreen: boolean = true;
  constructor() { }
  desc: any
  // ../../../assets/images/blockchain-icons/stellar.PNG
  List: any[] = [
    {
      topic: "What is a Blockchian",
      desc: `
        <p>A blockchain is a shared distributed database or ledger between computer network nodes. A blockchain serves as an electronic database for storing data in digital form. The most well-known use of blockchains is in cryptocurrency systems, where they play a critical role in keeping a secure and decentralized record of transactions. The innovation of a blockchain is that it fosters confidence without the necessity for a reliable third party by ensuring the fidelity and security of a record of data.</p>
        <p>What is the difference between a blockchain and an operational database?
        The way the data is organized in a blockchain differs significantly from how it is typically organized. In a blockchain, data is gathered in groups called blocks that each include sets of data. Blocks have specific storage capacities, and when filled, they are sealed and connected to the block that came before them to create the data chain known as the blockchain. Every additional piece of information that comes after that newly added block is combined into a brand-new block, which is then added to the chain once it is full.
        </p>
        <p>A blockchain, as its name suggests, arranges its data into pieces (blocks) that are strung together, whereas a database typically organizes its data into tables. When used in a decentralized way, this data structure creates an irreversible chronology of data by design. When a block is completed, it is irrevocably sealed and added to the timeline. When a block is added to the chain, it receives a precise timestamp.
        </p>
      `
    },
    {
      topic: `What is Stellar `,
      desc: `
      <center><img src="../../../assets/images/blockchain-icons/stellar.PNG" width="252px" height="209px"></center>
      <br>
        <p>Jed McCaleb founded Stellar, an Open source payment technology blockchain in 2014 with the intention of bridging the gap between all financial institutions and lowering the cost and time of international transfers significantly.</p>
        <p>The fundamental workings of stellar are comparable to the payment systems used by many decentralized platforms. A distributed ledger that is updated among all nodes every 2 to 5 seconds is used by Stellar to run on decentralized servers. The Stellar consensus does not rely on the network of miners to approve transactions. It uses the <a href="https://golden.com/wiki/Federated_Byzantine_Agreement_(FBA)">Federated Byzantine Agreement (FBA) algorithm</a>, which uses quorum slices to validate and accept the transaction, allowing the transaction to execute swiftly. Every node in the network chooses a different group of reliable nodes. Once all of the nodes in the set have authorized the transaction, it is deemed to be approved. The approval process for transactions made the Stellar network extremely quick. Due to this, it claims to process approx 1000 network operations in one second.</p>
        <p>For Information on stellar visit <a href="https://stellar.org/" target="_blank">Stellar Org</p>
      `
    },
    {
      topic: `What is Ethereum `,
      desc: `
      <center><img src="../../../assets/images/blockchain-icons/ethereum.png" width="252px" height="209px"></center>
      <br>
        <p>Blockchain underwent a revolution with the introduction of Bitcoin, but other latecomers, like Ethereum, have gained just as much support as <a class="testLink" href="https://developer.bitcoin.org/reference/block_chain.html" target="_blank">Bitcoin</a>, if not more. The Ethereum Blockchain is a decentralized, open-source platform that was first introduced in 2015. Since its debut, Ethereum has accomplished a number of significant milestones. The collaboration between Microsoft and ConsenSys is one of the platform's most notable recent accomplishments. Through the cooperation, developers and organizations using Microsoft Azure will have access to Ethereum Blockchain as a Service (EBaaS).</p>
        <p>The Ethereum network functions the same as every other Blockchain network. Different nodes known as miners evaluate each new transaction after it has been logged. To update the transaction in the decentralized ledger, these miners run the program code on their computer. For each piece of code they run or each transaction they add to the chain, miners are rewarded 3 ether. The output of each miner's code is added to the consensus, which i</p>

        <h2>What are smart contracts?</h2>
        <p>Blockchain-based smart contracts are a set of computer programs and protocols that automatically enforce particular contract terms. The smart contract codes serve as the set of guidelines that all parties must follow. The contract automatically initiates the next action decided upon by the developers when one or more of the conditions are met. The security, trust, autonomy, and efficiency of Blockchain technology are all present in these contracts.</p>

        <p>For Information on Ethereum visit <a href="https://ethereum.org/en/" target="_blank">ethereum.org</a>
      `
    },
    {
      topic: `What is Polygon `,
      desc: `
      <center><img src="../../../assets/images/blockchain-icons/polygon.PNG"></center>
      <br>
        <p>The Polygon blockchain project is a framework for building and connecting Ethereum-compatible blockchain networks as well as a scaling solution for Ethereum. Low throughput and high transaction fees are two of the most serious problems the Ethereum ecosystem is now dealing with, and they are challenges that the protocol seeks to address.</p>
        <p>The Matic Network project, which later became the Polygon project, began in 2017. The three co-founders of Matic, who had all been prominent members of the Indian crypto community, wanted the platform to address the Ethereum scaling issue, so they started looking into two different approaches: a Layer 2 solution based on an implementation of Plasma, and a Proof-of-Stake sidechain solution known as the PoS Chain. Because of this, Polygon is frequently called a sidechain, despite the fact that the sidechain solution is only one part of the platform's scalability promise.</p>
        <p>Layer 2 choices and side chains are both supported by Polygon as well as other forms of scaling solutions. Stand-alone chains and secured chains are the two distinct sorts of chains that the protocol supports. The former do not need Ethereum for security because they have their own consensus methods. However, creating a trustworthy consensus process is a difficult endeavour that will undoubtedly prove challenging for many enterprises. Running a secured chain might be a preferable choice for those.</p>
        <p>For Information on Polygon visit <a href="https://polygon.technology/" target="_blank">polygon.technology</a>
      `
    },
    {
      topic: `What is Solana `,
      desc: `
      <center><img src="../../../assets/images/blockchain-icons/solana.PNG" width="252px" height="209px"></center>
      <br>
        <p>Solana is basically just another blockchain network optimized for producing cryptocurrencies such as Bitcoin and Ethereum. It is a superior substitute for Ethereum, especially in terms of transaction speed. In actuality, the new blockchain platform could execute transactions at a rate of approximately 50,000 per second with ease. Within a few seconds, SOL may quickly integrate a variety of qualities into the current network, such as application development or SOL token mining. The cryptocurrency has rightfully established itself as Ethereum's rival.</p>
        <p>The Solana blockchain guarantees censorship resistance, speed, and security. Based on the RUST programming language, SOL offers a strong foundation for transaction security. Additionally, it can provide a highly scalable and effective network thanks to the usage of Proof of History.</p>
        <p>For Information on Solana visit <a href="https://solana.com/" target="_blank">Solana.com</a>
      `
    },
    {
      topic: `What Are Crypto Wallets `,
      desc: `
      <center><img src="https://static.vecteezy.com/system/resources/thumbnails/008/079/382/small_2x/cryptocurrency-wallet-flat-design-style-web-banner-of-blockchain-technology-bitcoin-altcoins-cryptocurrency-mining-finance-digital-money-market-cryptocoin-wallet-crypto-exchange-vector.jpg" width="252px" height="209px"></center>
      <br>
        A Crypto wallet acts as a tool that allows user to interact with a block chain. Wallets come in several forms mainly:
        <ol>
            <li>Software Wallets (Hot Wallets)</li>
        
            <li>Hardware Wallets (Cold Wallets)</li>
        
            <li>Paper Wallets(Cold Wallets)</li>
        </ol>
        These wallets have the ability to generate the necessary information to send and receive cryptocurrency/NFT via a blockchain. Furthermore the wallet holds the private and public key pair of an user which is used to identify an user.
        <br>
        A wallet contains an alphanumeric identifier which is generated based on the users public and private keys which can be used to store assets.</p>

        <strong> NOTE:- Marketplace v1.0 supports only uses software wallets</strong>
        <br>
        <p>Marketplace supports following wallet integrations : <br>
        <table >
          <tr>
            <td><strong>Blockchain</strong></td>
            <td><strong><center>wallet</center></strong></td>
          </tr>
          <tr>
            <td>Ethereum(MetaMask)</td>
            <td>
            <center>
            <a href="https://metamask.io/" target="_blank"><img src="../../../assets/images/metamask.png" width="30px" height="30px" alt="metaMask"></a></center></td>
          </tr>
          <tr>
            <td>Polygon(MetaMask)</td>
            <td>
            <center>
              <a href="https://metamask.io/" target="_blank"><img src="../../../assets/images/metamask.png" width="30px" height="30px"></a></center>
            </td>
          </tr>
          <tr>
            <td>Solana(Phantom)</td>
            <td>
            <center>
               <a href="https://phantom.app/" target="_blank"><img src="../../../assets/images/phantom.png" width="30px" height="30px"></a>
            </td>
          </tr>
          <tr>
            <td>Stellar(freighter)</td>
            <td>
            <center>
            <a href="https://www.freighter.app/" target="_blank"><img src="../../../assets/images/freighter.png" width="30px" height="30px"></a>
            </td>
          </tr>
        </table>
        <h2>What is Freighter?</h2>
        <p>
          Freighter is a  non-custodial wallet plugin that allows you to sign transactions for Stellar using your browser.
        </p>
        <h2>What is Phantom?</h2>
        <p>
          Phantom is a well-known non-custodial bitcoin wallet created for Solana that offers more functionality than just cryptocurrency deposits and transfers.
        </p>
        <h2>What is Metamask?</h2>
        <p>
          With the help of the cryptocurrency wallet MetaMask, users can keep their Ether and other ERC-20 tokens safe. You may communicate with decentralized applications, or dapps, using the wallet as well.
        </p>
      ` 
    },
    {
      topic: `Stellar operations in marketplace `,
      desc: `
        <ol>
            <li>Steps to Issue/Mint a NFT in stellar</li> 
                <ol>
                  <li>Wallet (NFT Creator) requests from Gateway to create NFT .</li>
                  <li>Gateway receives requests and creates one new issuer account for that particular NFT.</li>
                  <li>Gateway sends a new Current Issuer Account Public Key to Wallet.</li>
                  <li>Wallet inputs NFT and creates a Trust line with the Current Issuer Account.
                  </li>
                  <li>Endpoint containing details of the NFT is sent to the gateway.  (Parameters : CurrentIssuerPK string, distributerPK string, assetcode string, etc.)
                  </li>
                  <li>Gateway issues NFT and sends to wallet and locks current Issuer Account.
                  </li>
                  <li>Gateway saves NFT details in Gateway DB (NFTStellar) </li>
                  <li>Gateway saves NFT details and status in Gateway DB (NFTMarketPlace) and NFTBackend DB</li>
                  <li>Gateway sends response that NFT is issued .
                  </li>
                </ol>
              <li>Steps to sell an NFT on Stellar</li>
                  <ol>
                      <li>Third Party Wallet gets Current Issuer Account from the already available function in the marketplace</li>
                      <li>Third Party wallet creates trust line with current Issuer Account to buy NFT.</li>
                      <li>The Manage Data would keep records of the origin, previous owner and current owner links on stellar expert.</li>
                      <li>Third Party wallet also pays royalty to NFT Creator.</li>
                      <li>NFT is sent to third party wallet.</li>
                      <li>An endpoint is sent to update NFT Status  (buying_status = NOT FOR SALE, current_owner, previous_owner)</li>
                  </ol>
        </ol>
      `
    },
    {
      topic: `Ethereum and Polygon operations in marketplace `,
      desc: `
      <p>In the marketplace we have utilized both polygon and ethereum to use a BaaS(Blockchain as a Service).</p>

      <p>
        <h1>Minting NFTs with Ethereum and Polygon</h1>
        <br>
        mint(receiver, newItemId); Here the main two variables needed are the public key of the owner of the NFT/ issuer and the tokenID which is generated each time an NFT is put to mint.  _setTokenURI(newItemId, _name); and attributes[newItemId] = Attr(_name); would tally the tokenID to the data passed as tokenURI/ProofData etc. This is done in the NFT contract
      </p>
      <p>
        <h1> Selling an NFT in Ethereum and Polygon</h1>
        The tokenID, nft contract address and price you wish to sell it for is sent as parameters to the marketplace contract. A listing price can be declared and should be added as a parameter when sending to the contract from the frontend. 
        <br>
        When an NFT is put on sale an ItemID is generated. This is different from the tokenID as itemID depends on whether the NFT has been put on sale. But the ItemID can be equal to the tokenID if the NFT is put on sale straight after minting.
      </p>
      <p>
      <h1> Buying an NFT in Ethereum and Polygon</h1>
      The price recorded in the SALE  is needed to buy the nft and the other two parameters taken in would be the NFT contract address and the itemID. These are sent to the marketplace contract
      </p>

      `
    },

    {
      topic: `Solana Operations used in the Marketplace `,
      desc: `
        <p>
          <h1>Minting NFts in Solana</h1>
          <br>
          We create a mint account in which the token program will be. And using that and the issuers wallet we create or find an ATA (Associate Token Account) which becomes a container for the token program in the issuers wallet. It is possible to add meta data needed to the process of minting the NFT.
        </p>
        <p>
          <h1>Selling a NFt in Solana</h1>
          <br>
          The selling happens the same way we do under the other 3 blockchains except for the logic behind it.
          <ul>
            <li>One instance is where after minting a sale happens.</li>
            <li>After buying an NFT through the marketplace , the buyer resells.</li>
          </ul>
          <br>
          In the first instance the NFT would still be with the issuer (owner/TRACIFIED) and on the event of sale we would pass the mint public key, get the issuers ATA make sure it is available with the owner. Here we can check a condition to make sure the owner.PK == currentOwner.PK
          <br>
          In the second instance of reselling, the NFT would be with buyer in the buyers ATA, so we retrieve that ATA, we create an ATA for a middleman that will hold the NFT temporarily till a potential buyer comes along.  The ATA of the middleman will constantly change to ensure its safety in the container.
        </p>
        <p>
          <h1>Buying a NFt in Solana</h1>
          <br>
          Here we follow the same process for both instances of sale , when buying. The Buyer has to create an ATA and get the ATA of the current container and transfer it from A➡B.

        </p>
      `
    },
  ];

  ngOnInit(): void {
    console.log("List :", this.List)
    if (window.innerWidth < 960) {
      this.showTopics = false;
      this.smallScreen = true;
    } else {
      this.showTopics = true;
      this.smallScreen = false;
    }
  }

  selectDoc(topic: string) {
    console.log("----------------------")
    for (let x = 0; x < this.List.length; x++) {
      if (this.List[x].topic == topic) {
        console.log("the Desc :", this.List[x].desc)
        this.desc = this.List[x].desc
        this.topic = this.List[x].topic
        if (this.smallScreen) {
          this.showTopics = false;
        }

      }
    }

  }

  public toggleTopics() {
    this.showTopics = !this.showTopics;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth < 960) {
      this.showTopics = false;
      this.smallScreen = true;
    } else {
      this.showTopics = true;
      this.smallScreen = false;
    }
  }

}
