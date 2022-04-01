export class NFT{
    constructor(
    public CreatorUserId: string,
    public NftContentURL:string,
    public Collection:string,
    public NFTName:string,
    public Description:string,
    public  Blockchain:string,
    public  Copies:number,
    public  Categories:string,
    public Tags:string,
    public Imagebase64:string,
    public ArtistName:string,
    public ArtistProfileLink:string,
    public NFTIssuerPK:string,
    public NFTIdentifier:string,
    public CurrentPrice:string,
    public CurrentOwnerPK:string,
    public SellingStatus:string,
    public SellingType:string,
    public DistributorPK:string,
    public MarketContract:string,
    public MintedContract:string,
    public TokenType:string,
    public Status:string
   
    ){}
}

export class Mint2{

   constructor(
    public NftContentURL:string,
    public Collection:string,
    public NFTName:string,
    public Description:string,
   ){}
 }

export class tags{
    constructor(
        public userId:string,
        public  NFTName:string,
        public tags:string,
    ){}
}

export class Issuer{
    constructor(
        public NFTIssuerPK:string,
       
    ){}
}

export class Ownership{
    constructor(
   public NFTIdentifier: string,
   public CurentOwnerPK:string,
   public PreviousOwnerPK:string,
   public Status:string,
   public OwnerRevisionID:number,
  
    ){}
}


