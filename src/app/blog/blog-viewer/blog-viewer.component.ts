import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServicesService } from 'src/app/services/api-services/api-services.service';

@Component({
  selector: 'app-blog-viewer',
  templateUrl: './blog-viewer.component.html',
  styleUrls: ['./blog-viewer.component.css'],
})
export class BlogViewerComponent implements OnInit {
  data: any;
  story: any;
  nftstory: any;
  List: any[] = [
    {
      thumbnail : '../../../assets/images/nft-mp-hero-2.jpg',
      topic: 'About Tracified',
      desc: `
      Tracified is a blockchain-based supply chain traceability platform that allows businesses to get transparency of people, process and product, through all its stages up until sale via retail or eCommerce.

      Tracified facilitates a tamper-proof platform that streamlines the data flow within a supply chain, introducing a novel crypto-economic model based on a reward/penalty concept, ensuring fair distribution of gains across the chain. The originality of the solution is further enhanced by its ability to get customized to suit the needs of a business.

      Tracified has a dynamic range of products that utilizes multiple blockchains in order to achieve various requirements maximizing transparency and authenticity.
      `,
    },
    {
      thumbnail : '../../../assets/images/nft-mp-hero-3.jpg',
      topic: "About Tracified's Marketplace",
      desc: `
      Tracified NFT Marketplace is a decentralized platform that enables users to create, sell, and purchase traceability-related non-fungible tokens (NFTs) on various public blockchains. The platform specializes in NFTs that consist of traceability data, such as supply chain information, product origins, and authenticity verification. Users can create and mint their own traceability NFTs, and trade them on the platform using cryptocurrency. The platform utilizes various public blockchains, such as Ethereum, Stellar, Polygon and Solana, ensuring that the traceability NFTs created and traded on the platform are accessible to anyone on the blockchain network. To use the platform, users are required to have a crypto wallet such as MetaMask, Freighter, Phantom, or Albedo, depending on the preferred blockchain.
    
      Tracified NFT Marketplace is a decentralized platform built on various public blockchains that allows users to create, sell, and purchase traceability-related non-fungible tokens (NFTs). The NFTs created and traded on the platform consist of traceability data. This data can include information such as supply chain information, product origins, authenticity verification and many more.

      Users can create and mint their own traceability NFTs on the platform, then sell or trade them on the platform using cryptocurrency. This ensures that the transactions are secure, transparent, and accessible to anyone on the blockchain network. The platform utilizes various public blockchains, such as Ethereum, Stellar, Polygon, and Solana, ensuring that the traceability NFTs created and traded on the platform are accessible to anyone on the blockchain network. To interact with the platform, users will need a crypto wallet that is compatible with the preferred blockchain, such as MetaMask for Ethereum an, Freighter and Albedo for Stellar, Phantom for Solana.

      Tracified NFT marketplace offers a new way for people to represent their items and ensure authenticity, transparency and traceability in the supply chain. This platform is beneficial for consumers, businesses, and industries that are looking to build trust and transparency with their customers, partners and regulators.
      
      `,
    },
  ];
  topics: any;
  description: any;
  thumbnail : string;

  constructor(
    private route: ActivatedRoute,
    private service: ApiServicesService,
    private domSanitizer: DomSanitizer,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.description = this.List[0].desc;
    this.topics = this.List[0].topic;
    this.thumbnail = this.List[0].thumbnail;
    window.scrollTo(0, 0);
  }

  selectBlog(topic: string) {
    for (let x = 0; x < this.List.length; x++) {
      if (this.List[x].topic == topic) {
        this.description = this.List[x].desc;
        this.topics = this.List[x].topic;
        this.thumbnail = this.List[x].thumbnail;
      } 
    }
  }

  public breadCrumbNavigate(route: string): void {
    this.router.navigate([route]);
  }
}
