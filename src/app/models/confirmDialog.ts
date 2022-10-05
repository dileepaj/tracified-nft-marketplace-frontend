export interface ConfirmDialog{
    title:string;
    message:string;
    confirmText:string;
    cancelText:string;
}
export interface OkDialog{
    title:string;
    message:string;
    confirmText:string;
}
export interface PreviewImage{
    image:any
}

export interface PendingDialog{
    message:string
}

export const ConfirmDialogText={
    //dialog box buttons
    CONFIRM_BTN : 'Yes',
    CANCEL_BTN : 'No',
    //BuyView Text
    BUY_VIEW_BUY_NFT_TITLE:'NFT purchase confirmation',
    BUY_VIEW_BUY_NFT_MESSAGE:'Are you sure you want to purchase this NFT?',
    //SellView Text
    SELL_VIEW_SELL_NFT_TITLE:'NFT Sale confirmation.',
    SELL_VIEW_SELL_NFT_MESSAGE:'Are you sure you want to put this NFT on sale.',

    //Mint 1 screen
    MINT1_PK_ENDORSMENT_TITLE: 'Public Key Endorsment',
    MINT1_PK_ENDORSMENT_MESSAGE:'Your account is not endorsed. Would you like to get your account Endorsed now',
    
    //Mint2 screen
    MINT2_MINT_CONFIRM_TITLE:'NFT Minting Confirmation',
    MINT2_MINT_CONFIRM_MESSAGE:'Are you sure you want to Mint this NFT?',

    //Endorsment sign up page
    ENDORSMENT_SIGN_UP_TITLE:'Endorsment Confirmation',
    ENDORSMENT_SIGN_UP_MESSAGE:"Are you sure you want to Endorse your account?",

    //Create collection page
    CREATE_COLLECTION_TITLE:'Collection Creation Confirmation',
    CREATE_COLLECTION_MESSAGE_P1:'Are you sure you want to create the ',
    CREATE_COLLECTION_MESSAGE_P2:' collection?',

    //User FAQ submission screen
    USER_FAQ_TITLE:'FAQ submission confirmation.',
    USER_FAQ_MESSAGE: 'Are you sure you want to submit the Question?',

    //Admin add/edit FAQ
    ADMIN_FAQ_SUBMISSION_TITLE:'User FAQ Answer Submission',
    ADMIN_FAQ_SUBMISSION_Message:'Are you sure you want to submit this answer?',

    //Admin user Endorsment
    ADMIN_ENDORSE_USER_ACCEPT_TITLE:'Endorsment Acceptance Confirmation',
    ADMIN_ENDORSE_USER_DECLINE_TITLE:'Endorsment decline confirmation',
    ADMIN_ENDORSE_USER_ACCEPT_MESSAGE:'Are you sure you want to accept this endorment',
    ADMIN_ENDORSE_USER_DECLINE_MESSAGE:'Are you sure you want to decline this Endorsment',
    ACCEPT_ENDORSMENT_BTN:'Accept this Endorsment',
    DECLINE_ENDORSMENT_BTN:'Decline Endorsment'
    

}

export const OkDialogText ={
    OKAY_BTN : 'Okay',
    //Endorsment signup page
    ENDORSMENT_SENT_TITLE:'Endorsment Subbmited',
    ENDORSMENT_SENT_MESSAGE:'Your Request to be be endorsed has been sent. You will recive email within the next 48 hours.',

    //User FAQ submission screen
    USER_FAQ_SUBMIITED_TITLE:'Question submission complete.',
    USER_FAQ_SUBMIITED_Message:'Your Question has been submitted. Out team will get back to you as soon as possible.Thank you'
}

export const SnackBarText={
    //Buy View
    BOUGHT_SUCCESS_MESSAGE : 'NFT has successfully been bought',
    //Sell view
    SALE_SUCCESS_MESSAGE : 'NFT has successfully been put on sale',
    //Mint1 screen
    MINT1_UPLOAD_SVG_WARNING:'Please upload an SVG',
    MINT1_COLLECTION_SELECTION_WARNING:'Please select a collection for your NFT',
    MINT1_NFT_NAME_WARNING : 'Please name your NFT',
    MINT1_NFT_DESCRIPTION_WARNING : 'Please add a discription for your NFT',
    //Mint2 Screen
    MINTING_SUCCESSFULL_MESSAGE: 'NFT has successfully being minted',

    //Create collection page
    CREATE_COLLECTION_SUCCESS_MESSAGE:' collection has successfully been added.',
    CREATE_COLLECTION_FAILED_MESSAGE:'Error occured failed to create collection.',

    //Admin add edit FAQ
    FAQ_SUBMISSION_SUCCESS:'Answer has been Submitted. Email sent to customer',

    //Admin User endorsment
    ADMIN_ENDORSEMENT_ACCEPTED_SUCCESS:'Endorsment Acceptance Complete email sent to customer',
    ADMIN_ENDORSMENT_ACCEPTED_ERROR:'falied to Accept endorsment please try again',
    ADMIN_ENDORSMENT_DECLINED_SUCCESS:'Endorsment decline Complete email sent to customer',
    ADMIN_ENDORSE_BLANK_INPUT_WARNING:'Review and Rating cannot be empty please add data!',

    ERROR_MESSAGE:'Error Occured'
}

export const PendingDialogText={
    //ExploreView loading Text
    EXPLORE_VIEW_LOAD : "Loading NFTs...",
    //BuyView  Pending Text
    BUY_VIEW_CLICKED_BUY:"Confirming your purchase. This will take a momment",
    //SellView Pending Text
    SELL_VIEW_CLICKED_SALE:'NFT is being put on sale. This will take a momment',
    //Mint2 screen
    MINTING_IN_PROGRESS:"your NFT is being minted. This will take a momment"
}