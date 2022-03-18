export class Review{
    public Rating: number
    constructor(
       // public Id: string,
        public NFTIdentifier:string,
        public UserID: string,
        public Status: string,
        public Description: string
    ){}
}