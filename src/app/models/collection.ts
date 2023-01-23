export class Collection {
  constructor(
    public UserId: string,
    public CollectionName: string,
    public OrganizationName: string,
    public Blockchain?: string,
    public Publickey?: string,
  ) {}
}

export class MyCollection {
  constructor(
    public collection: string
  ) {}
}

