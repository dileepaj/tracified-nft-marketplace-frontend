export class Collection {
  constructor(
    public UserId: string,
    public CollectionName: string,
    public OrganizationName: string,
    public Timestamp?: string,
    public Blockchain?: string,
    public Publickey?: string,
    public isPublic?: boolean,
    public cid?: string,
    public nftcount?: number
  ) {}
}

export class MyCollection {
  constructor(public collection: string) {}
}
