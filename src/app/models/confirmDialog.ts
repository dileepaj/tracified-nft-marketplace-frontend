export interface ConfirmDialog {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  thumbnail?: string;
  nftName?: string;
  serviceFee?: number;
  feeTypeName?: string
  promtHeading?: string
  total?: number;
  blockchain?: string
}

export interface userAgreementPromt {
  thumbnail?: string;
  serviceFee?: number;
  feeTypeName?: string
  promtHeading?: string
  total?: number;
  blockchain?: string
  nftName?: string;
  buttonAction?: string;
}

export interface selectWalletDialog {
  title: string;
  message: string;
  selectF: string;
  selectA: string;
}
export interface OkDialog {
  title: string;
  message: string;
  confirmText: string;
}
export interface PreviewImage {
  image: any
}

export interface PendingDialog {
  processTitle?: string
  message: string
  thumbnail?: string;
  nftName?: string;
}

export const ConfirmDialogText = {
  //dialog box buttons
  CONFIRM_BTN: 'Confirm',
  CANCEL_BTN: 'Cancel',

  //BuyView Text
  BUY_VIEW_BUY_NFT_TITLE: 'NFT Purchase Confirmation',
  BUY_VIEW_BUY_NFT_MESSAGE: 'Are you sure you want to purchase this NFT?',
  //SellView Text
  SELL_VIEW_SELL_NFT_TITLE: 'NFT Sale Confirmation.',
  SELL_VIEW_SELL_NFT_MESSAGE: 'Are you sure you want to put this NFT on sale?',

  //Mint 1 screen
  MINT1_PK_ENDORSMENT_TITLE: 'Public Key Endorsment',
  MINT1_PK_ENDORSMENT_MESSAGE: 'Are you sure you want to get endorsed?',

  //Edit profile
  PROFILE_ENDORSMENT_TITLE: 'Get Endorsed',
  PROFILE_ENDORSMENT_MESSAGE: 'Your account is not endorsed. To endorse, visit the Create page and select a wallet account to get endorsed. Would you like to proceed?',

  //Mint2 screen
  MINT2_MINT_CONFIRM_TITLE: 'NFT Minting Confirmation',
  MINT2_MINT_CONFIRM_MESSAGE: 'Are you sure you want to Mint this NFT?',

  //Endorsment sign up page
  ENDORSMENT_SIGN_UP_TITLE: 'Endorsement Confirmation',
  ENDORSMENT_SIGN_UP_MESSAGE: "Are you sure you want to get your account endorsed?",

  //Create collection page
  CREATE_COLLECTION_TITLE: 'Collection Creation Confirmation',
  CREATE_COLLECTION_MESSAGE_P1: 'Are you sure you want to create the ',
  CREATE_COLLECTION_MESSAGE_P2: ' collection?',

  //User FAQ submission screen
  USER_FAQ_TITLE: 'FAQ Submission Confirmation.',
  USER_FAQ_MESSAGE: 'Are you sure you want to submit this question?',

  //Admin add/edit FAQ
  ADMIN_FAQ_SUBMISSION_TITLE: 'User FAQ Answer Submission',
  ADMIN_FAQ_SUBMISSION_Message: 'Are you sure you want to submit this answer?',

  //Admin user Endorsement
  ADMIN_ENDORSE_USER_ACCEPT_TITLE: 'Endorsment Acceptance Confirmation',
  ADMIN_ENDORSE_USER_DECLINE_TITLE: 'Endorsment Decline Confirmation',
  ADMIN_ENDORSE_USER_ACCEPT_MESSAGE: 'Are you sure you want to accept this endorsement?',
  ADMIN_ENDORSE_USER_DECLINE_MESSAGE: 'Are you sure you want to decline this endorsement?',
  ACCEPT_ENDORSMENT_BTN: 'Accept',
  DECLINE_ENDORSMENT_BTN: 'Decline'


}

export const SelectWalletText = {
  //wallet buttons
  WALLET_ALBEDO: 'Albedo',
  WALLET_FREIGHTER: 'Freighter',

  //Select Wallet for Stellar
  WALLET_TITLE: 'Select Stellar based Wallet',
  WALLET_MESSAGE: 'Select a wallet to advance with the stellar transaction. Please note that Freighter is not mobile compatible',

}

export const OkDialogText = {
  OKAY_BTN: 'OK',
  //Endorsment signup page
  ENDORSMENT_SENT_TITLE: 'Endorsement Submitted',
  ENDORSMENT_SENT_MESSAGE: 'Your request to be endorsed has been sent. You will receive an email within the next 48 hours.',

  //User FAQ submission screen
  USER_FAQ_SUBMITTED_TITLE: 'Question Submission Complete',
  USER_FAQ_SUBMITTED_Message: 'Your question has been submitted. Our team will get back to you as soon as possible.'

}

export const SnackBarText = {
  //Buy View
  BOUGHT_SUCCESS_MESSAGE: 'NFT has been purchased successfully.',
  //Sell view
  SALE_SUCCESS_MESSAGE: 'NFT has been put on sale successfully.',
  //Mint1 screen
  MINT1_UPLOAD_SVG_WARNING: 'Please upload an SVG.',
  MINT1_COLLECTION_SELECTION_WARNING: 'Please select a collection for your NFT.',
  MINT1_NFT_NAME_WARNING: 'Please enter a name for your NFT.',
  MINT1_NFT_DESCRIPTION_WARNING: 'Please add a description for your NFT.',
  //Mint2 Screen
  MINTING_SUCCESSFUL_MESSAGE: 'Your NFT has been minted successfully.',

  //Create collection page
  CREATE_COLLECTION_SUCCESS_MESSAGE: ' collection has been created successfully.',
  CREATE_COLLECTION_FAILED_MESSAGE: 'Error occurred! Failed to create collection.',

  //Admin add edit FAQ
  FAQ_SUBMISSION_SUCCESS: 'Answer has been submitted. User notified via email.',

  //Admin User endorsment
  ADMIN_ENDORSEMENT_ACCEPTED_SUCCESS: 'Endorsement accepted. User notified via email.',
  ADMIN_ENDORSMENT_ACCEPTED_ERROR: 'Failed to accept endorsement. Please try again.',
  ADMIN_ENDORSMENT_DECLINED_SUCCESS: 'Endorsment declined. User notified via email.',
  ADMIN_ENDORSE_BLANK_INPUT_WARNING: 'Review and rating cannot be empty. Please try again.',

  //ContactUs Component
  CONTACT_US_FIELDS_EMPTY_WARNING: "Please Make sure all mandatory fields are not left empty",

  ERROR_MESSAGE: 'Something went wrong. Please try again.'
}

export const PendingDialogText = {
  //ExploreView loading Text
  EXPLORE_VIEW_LOAD: "Loading NFTs...",
  //BuyView  Pending Text
  BUY_VIEW_CLICKED_BUY: "Confirming your purchase. This will take a moment.",
  //SellView Pending Text
  SELL_VIEW_CLICKED_SALE: 'NFT is being put on sale. This will take a moment.',
  //Mint2 screen
  MINTING_IN_PROGRESS: "Your NFT is being minted. This will take a moment.",
  //ContactUs Component
  CONTACT_US_SUBMITTING: 'Submitting....'
}
