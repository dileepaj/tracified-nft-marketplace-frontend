export class Partners {
    constructor(
      public Topic: string,
      public WebLink:string,
      public  CompanyName:string,
      public Image:string,
      public Description:string,
     
    ) {}
  }

  export class UpdatePartners {
    constructor(
      public ID: string,
      public Topic: string,
      public WebLink:string,
      public  CompanyName:string,
      public Image:string,
      public Description:string,
     
    ) {}
  }