import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-browse-marketplace',
  templateUrl: './browse-marketplace.component.html',
  styleUrls: ['./browse-marketplace.component.css'],
})
export class BrowseMarketplaceComponent implements OnInit {
  activities: any[] = [
    {
      name: 'JOHN ARC',
      date: '2022/7/8',
      pk: 'khggfjhgri7687838938yr8',
    },
    {
      name: 'JOHN ARC',
      date: '2022/7/8',
      pk: 'khggfjhgri7687838938yr8',
    },
    {
      name: 'JOHN ARC',
      date: '2022/7/8',
      pk: 'khggfjhgri7687838938yr8',
    },
    {
      name: 'JOHN ARC',
      date: '2022/7/8',
      pk: 'khggfjhgri7687838938yr8',
    },
    {
      name: 'JOHN ARC',
      date: '2022/7/8',
      pk: 'khggfjhgri7687838938yr8',
    },
  ];

  notifications: any[] = [
    {
      type: 'endorsement',
    },
    {
      type: 'chat',
      from: 'John Doe',
      topic: 'how does one mint nft with solana?',
    },
  ];
  constructor() {}

  ngOnInit(): void {}
}
