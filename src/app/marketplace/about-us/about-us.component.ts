import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css'],
})
export class AboutUsComponent implements OnInit {
  text0: string = '';
  text1: string = '';
  text2: string = '';
  text3: string = '';
  text4: string = '';
  text5: string = '';

  enText0: string =
    'Tracified NFT Marketplace is a decentralized platform that enables users to create, sell, and purchase traceability-related non-fungible tokens (NFTs) on various public blockchains. The platform specializes in NFTs that consist of traceability data, such as Supply chain information, Product origins, Authenticity verification. Users can create and mint their own traceability NFTs, and trade them on the platform using cryptocurrency. The platform utilizes various public blockchains, such as: Ethereum, Stellar, Polygon, Solana. <br /> <br /> Ensuring that the traceability NFTs created and traded on the platform are accessible to anyone on the blockchain network. To use the platform, users are required to have a crypto wallet such as: MetaMask for Ethereum and Polygon, Freighter for Stellar, Phantom for Solana, Albedo for Stellar <br /> <br /> This platform offers a new way for people to represent their items and ensure authenticity, transparency and traceability in the supply chain. This platform is beneficial for consumers, businesses, and industries that are looking to build trust and transparency with their customers, partners, and regulators.';
  jpText0: string =
    'Tracified NFT Marketplaceは、様々なパブリックブロックチェーン上でトレーサビリティに関連するNon-fungible Token（NFT）を作成、販売、購入することができる分散型プラットフォームです。このプラットフォームは、サプライチェーン情報、製品の原産地、真偽の確認などのトレーサビリティデータを含むNFTに特化しています。ユーザーは、独自のトレーサビリティNFTを作成、プラットフォーム上で暗号資産を使用して売買することができます。Ethereum、Stellar、Polygon、Solanaなどのパブリックブロックチェーンを利用します。<br /><br /> プラットフォーム上で作成・売買されるトレーサビリティNFTには、ブロックチェーンネットワーク上の誰でもアクセスできることが保証されています。このプラットフォームを利用するために、ユーザーはクリプトウォレットを所有することが必要です（Ethereum、Polygon用のMetaMask、Stellar用のFreighter、Solana用のPhantom、Stellar用のAlbedoなど）。<br /><br /> このプラットフォームは、人々が自分のアイテムを表現し、サプライチェーンにおける真偽、透明性、トレーサビリティを確保するための新しい方法を提供します。このプラットフォームは、顧客、パートナー、規制当局との信頼と透明性の構築を目指している消費者、企業、業界にとってメリットがあります。';

  enText1: string = 'Learn more about how it works';
  enText2: string =
    'Read our complete documentation and get to know how the platform works';
  enText3: string = 'Learn about Tracified';
  enText4: string =
    'Get to know how your business can benefit from traceability through public blockchain';
  enText5: string = 'About Us';

  jpText1: string = '仕組みの詳細';
  jpText2: string =
    'プラットフォームの仕組みなどの詳細は、こちらの資料をご覧ください。';
  jpText3: string = 'について';
  jpText4: string =
    'パブリックブロックチェーンによるトレーサビリティが、ビジネスにどのようなメリットをもたらすのか、こちらをご覧ください。';
  jpText5: string = 'について';

  constructor(private router: Router, private _location: Location) {}

  ngOnInit(): void {
    this.text0 = this.enText0;
    this.text1 = this.enText1;
    this.text2 = this.enText2;
    this.text3 = this.enText3;
    this.text4 = this.enText4;
    this.text5 = this.enText5;
  }

  public goBack() {
    this.router.navigate(['/']);
  }

  public docs() {
    this.router.navigate(['/docs']);
  }

  public tracified() {
    window.open('https://tracified.com/', '_blank');
  }

  public toggleLang(e: any) {
    if (e.target.checked) {
      this.text0 = this.jpText0;
      this.text1 = this.jpText1;
      this.text2 = this.jpText2;
      this.text3 = this.jpText3;
      this.text4 = this.jpText4;
      this.text5 = this.jpText5;
    } else {
      this.text0 = this.enText0;
      this.text1 = this.enText1;
      this.text2 = this.enText2;
      this.text3 = this.enText3;
      this.text4 = this.enText4;
      this.text5 = this.enText5;
    }
  }
}
