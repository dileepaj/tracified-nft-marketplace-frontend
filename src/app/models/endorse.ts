import { Float } from "@solana/buffer-layout";

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
    ) {}
  }

  export class UpdateStatus {
    constructor(
      public status:string,
      public publickey:string,
      public Review:string,
      public Rating:string,
      public Email:string
    ) {}
  }