export class Subscription {
    constructor(
      public mail: string,
    ) {}
  }
  
export class UserFAQ {
    constructor(
      public usermail: string,
      public category: string,
      public subject: string,
      public desc: string,
      public attached: string,
      public status: string,
      public answer: string,
    ) {}
  }
  