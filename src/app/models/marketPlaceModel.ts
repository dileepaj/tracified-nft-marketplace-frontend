export class Favourites {
    constructor(
      public NFTIdentifier: string,
      public Blockchain:string,
      public User:string
     
    ) {}
  }

  export class WatchList {
    constructor(
        public NFTIdentifier: string,
        public Blockchain:string,
        public User:string
       
     
    ) {}
  }

  export class Card {
    constructor(
      public NFTName:string,
        public NFTIdentifier: string,
        public ImageBase64:string,
       
     
    ) {}
  }