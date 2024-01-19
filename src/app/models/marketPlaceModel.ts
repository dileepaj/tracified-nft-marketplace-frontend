export class Favourites {
  constructor(
    public NFTIdentifier: string,
    public Blockchain: string,
    public User: string
  ) {}
}

export class WatchList {
  constructor(
    public NFTIdentifier: string,
    public Blockchain: string,
    public User: string
  ) {}
}

export class Card {
  constructor(
    public NFTName: string,
    public NFTIdentifier: string,
    public ImageBase64: string
  ) {}
}

export class HomeCard {
  constructor(
    public NFTName: string,
    public NFTIdentifier: string,
    public ImageBase64: string,
    public Blockchain: string
  ) {}
}

export class NFTCard {
  constructor(
    public Id: string,
    public NFTName: string,
    public NFTIdentifier: string,
    public ImageBase64: string,
    public Blockchain: string,
    public CreatorUserId: string,
    public SellingStatus: string,
    public CurrentOwnerPK: string,
    public thumbnail: string,
    public Hotpicks: boolean,
    public Trending: boolean,
    public CurrentPrice: string
  ) {}
}

export class MyNFTCard {
  constructor(
    public Id: string,
    public NFTName: string,
    public NFTIdentifier: string,
    public ImageBase64: string,
    public Blockchain: string,
    public SellingStatus: string,
    public thumbnail: string,
    public CurrentPrice: string
  ) {}
}
