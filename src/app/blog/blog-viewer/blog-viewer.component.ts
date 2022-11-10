import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ApiServicesService } from 'src/app/services/api-services/api-services.service';

@Component({
  selector: 'app-blog-viewer',
  templateUrl: './blog-viewer.component.html',
  styleUrls: ['./blog-viewer.component.css']
})
export class BlogViewerComponent implements OnInit {
  data: any;
  story: any;
  nftstory: any;
  List:any[]=[{topic:"About Tracified",desc:"Blockchain underwent a revolution with the introduction of Bitcoin, but other latecomers, like Ethereum, have gained just as much support as Bitcoin, if not more. The Ethereum Blockchain is a decentralized, open-source platform that was first introduced in 2015. Since its debut, Ethereum has accomplished a number of significant milestones. The collaboration between Microsoft and ConsenSys is one of the platform's most notable recent accomplishments. Through the cooperation, developers and organizations using Microsoft Azure will have access to Ethereum Blockchain as a Service (EBaaS). The Ethereum network functions the same as every other Blockchain network. Different nodes known as miners evaluate each new transaction after it has been logged. To update the transaction in the decentralized ledger, these miners run the program code on their computer. For each piece of code they run or each transaction they add to the chain, miners are rewarded 3 ether. The output of each miner's code is added to the consensus, which is then inspected to verify the most recent transaction for efficient network-wide transactions."},
  {topic:"About Tracified's Marketplace",desc:"The Polygon blockchain project is a framework for building and connecting Ethereum-compatible blockchain networks as wells a scaling solution for Ethereum. Low throughput and high transaction fees are two of the most serious problems the Ethereum ecosystem is now dealing with, and they are challenges that the protocol seeks to address."},]
  topics: any;
  description: any;

  constructor(private route:ActivatedRoute,
    private service:ApiServicesService,
    private domSanitizer: DomSanitizer) { }

  ngOnInit(): void {

}

selectBlog(topic:string){
  console.log("----------------------",this.List.length)
  for(let x=0; x< this.List.length;x++){
    if(this.List[x].topic==topic){
      console.log("the Desc :", this.List[x].desc)
      this.description=this.List[x].desc
      this.topics=this.List[x].topic
    }else{
      console.log("it wasnt the same")
    }
  }

}
}