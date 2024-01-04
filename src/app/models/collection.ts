export class Collection {
  constructor(
    public UserId: string,
    public CollectionName: string,
    public OrganizationName: string,
    public Blockchain?: string,
    public Publickey?: string,
    public isPrivate?: boolean
  ) {}
}

export class MyCollection {
  constructor(public collection: string) {}
}
