export class Collection {
  constructor(
    public userId: string,
    public collectionName: string,
    public organizationName: string,
    public blockchain?: string,
    public publickey?: string,
  ) {}
}

export class MyCollection {
  constructor(
    public collection: string
  ) {}
}

