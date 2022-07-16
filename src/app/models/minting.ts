export class NFT{
    constructor(
    public CreatorUserId: string,
    public NftContentURL:string,
    public Collection:string,
    public NFTName:string,
    public Description:string,
    public  Blockchain:string,
    public  Copies:string,
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
    public Status:string,
    public NFTTxnHash:string,
    public Trending:boolean,
    public HotPicks:boolean
   
    ){}
}

export class Mint2{

   constructor(
    public NftContentURL:string,
    public Collection:string,
    public NFTName:string,
    public Description:string,
    public imgObjectID:string,
    public svg:SVG,
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

export class Minter{
    constructor(
        public NFTIssuerPK:string,
        public ImageBase64:string,
        public NFTIdentifier: string,
        public NFTTxnHash:string,
        public Blockchain:string,
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

export class UpdateMint{
    constructor(
        public MinterPK:string,
        public ImageBase64:string,
        public NFTTxnHash:string
       
    ){}
}

export class UpdateStellarTXN{
    constructor(
        public ImageBase64:string,
        public NFTTxnHash:string
       
    ){}
}

export class StellarTXN{
    constructor(
       
        public ImageBase64:string,
        public NFTTxnHash:string,
        public Blockchain:string
    ){}
}

export class Contracts{
    constructor(
       public NFTContract           :string,
       public   MarketplaceContract : string,
       public  MintNFTTxn           : string,
       public  OwnerPK              : string,
       public  Asset_code           : string,
       public  NFTURL               : string,
       public  Description          : string,
       public  Collection           : string,
       public  NFTBlockChain        : string,
       public  Tags                 : string,
       public  Categories           : string,
       public  Copies               : string,
       public  NFTLinks             : string,
       public  ArtistName           : string,
       public  ArtistLink           : string,
       public  Identifier           : string,
    ){}
}

export interface Image {
    WidgetId: string;
    ProjectId?: string;
    Title?: string;
    Type: string;
    Base64Image: string;
  }

  export class SVG{
    constructor(
        public Hash:string,
        public Base64ImageSVG:string,
        public blockchain:string="NA",
    ){}
}

export class UpdateSVG{
    constructor(
        public blockchain:string="NA",
        public Id:string
    ){}
}

export class TXN{
    constructor(
       
        public Blockchain:string,
        public NFTIdentifier:string,
        public Status:string,
        public NFTName:string,
        public ImageURL:string,
        public NFTTxnHash:string
        
    ){}
}