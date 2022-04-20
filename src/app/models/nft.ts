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
   
    ){}
}

export class Sales{
    constructor(
        public Price : string,
        public Royalty: string,
    ){}
}