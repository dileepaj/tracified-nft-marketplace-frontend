export class Endorse {
    constructor(
      public Name: string,
      public PublicKey:string,
      public Email:string,
      public Contact:string,
      public Description:string,
      public Blockchain:string,
      public Status:string,
    ) {}
  }

  export class UpdateEndorse {
    constructor(
      public Name: string,
      public PublicKey:string,
      public Email:string,
      public Contact:string,
      public Description:string,
      public Blockchain:string,
    ) {}
  }

  export class UpdateStatus {
    constructor(
      public Status:string,
      public PublicKey:string,
     
    ) {}
  }