export class UserFAQ{
    constructor(
        public userquestionID:string,
        public usermail: string,
        public category :string,
        public subject : string,
        public desc :string,
        public attached:string,
        public status:string,
        public answer:string
    ){}
}

export class UpdateUserFAQResponse{
    constructor(
        public userquestionID:string,
        public status: string,
        public answer:string
    ){}
}