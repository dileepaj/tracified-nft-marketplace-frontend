export class Collection {
  constructor(
    public UserId: string,
    public CollectionName: string,
    public OrganizationName: string,
    public Timestamp?: string,
    public Blockchain?: string,
    public Publickey?: string,
    public isPublic?: boolean,
    public ThumbnailID?: string
  ) {}
}

export class MyCollection {
  constructor(public collection: string) {}
}
