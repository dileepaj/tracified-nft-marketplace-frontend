
export class NFTMarket{
    constructor(
    public Identifier        :               string,
	public Categories       :                string,
	public Collection      :                 string,
	public ImageBase64        :              string,
	public NftTransactionExistingBlockchain :string,
	public NftIssuingBlockchain     :        string,
	public NFTTXNhash       :                string,
	public Timestamp       :                 string,
	public NftURL        :                   string,
	public NftContentName      :             string,
	public NftContent       :                string,
	public NFTArtistName          :          string,
	public NFTArtistURL       :              string,
	public TrustLineCreatedAt       :        string,
	public Description        :              string,
	public Copies          :                 string,
	public OriginPK             :            string,
	public SellingStatus            :        string,
	public Amount                    :       string,
	public Price      :                      string,
	public InitialDistributorPK       :      string,
	public InitialIssuerPK        :          string,
	public MainAccountPK     :               string,
	public PreviousOwnerNFTPK      :         string,
	public CurrentOwnerNFTPK    :            string,
	public thumbnail:string,
	public Commission:string
    ){}
}

export class GetNFT{
    constructor(
    public NFTIdentifier        :               string,
	public CreatorUserId:string,
	public Category       :                string,
	public Collection      :                 string,
	public Imagebase64        :              string,
	public AttachmentType:string,
	public Blockchain     :        string,
	public NFTTxnhash       :                string,
	public Timestamp       :                 string,
	public NftContentURL        :                   string,
	public NFTName      :             string,
	public ArtistName          :          string,
	public ArtistProfileLink     :              string,
	public Description        :              string,
	public Copies          :                 string,
	public SellingStatus            :        string,
	public TokenType                    :       string,
	public CurrentPrice      :                      string,
	public DistributorPK       :      string,
	public NFTIssuerPK        :          string,
	public MarketContract     :               string,
	public MintedContract      :         string,
	public CurrentOwnerPK    :            string,
	public Tags:string,
	public SellingType:string,
	public Status:string,
	public thumbnail:string,
	public Commission:string
   
    ){}
}

export class SalesBE{
    constructor(
		public	NFTIdentifier : string   ,       
		public Timestamp   :string,   
		public CurrentPrice  : string     ,       
		public SellingStatus  :string   ,         
		public	SellingType  :  string     ,       
		public MarketContract :string,
		public CurrentOwnerPK :string,
		public Royalty :string,
		public Blockchain:string,
		public Commission:string,
		
    ){}
}

export class SalesGW{
    constructor(
        public Price : string,
        public Status: string,
		public Amount: string,
		public NFTTXNhash : string,
    ){}
}

export class BuyNFTGW{
    constructor(
		public PreviousOwnerNFTPK    :  string,
		public CurrentOwnerNFTPK: string,
        public SellingStatus:string,
		public NFTTXNhash : string,
    ){}
}

export class Sales{
    constructor(
		public	Price : string   ,       
		public Royalty   :string,   
		
    ){}
}

export class Reviews{
    constructor(
		public	NFTIdentifier : string   ,       
		public UserID   :string,  
		public Status   :string,  
		public Rating   :number,  
		public Description   :string,   
		public Timestamp :string,
		
    ){}

	
}

export class ReviewsCard{
    constructor(     
		public UserID   :string,  
		public Rating   :string,  
		public Description   :string,   
		public Timestamp  : string
    ){}
	}

	export class NFTStory{
		constructor(
			public	NFTIdentifier : string   ,       
			public Blockchain   :string,  
			public NFTStory   :string,  
			
		){}
	
		
	}