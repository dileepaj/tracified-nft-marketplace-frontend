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

export class SVG{
    constructor(
       
        public Hash:string,
        public Base64ImageSVG:string
    ){}
}