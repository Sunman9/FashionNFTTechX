export interface MarketingCopy {
  instagramCaption: string;
  lookbookDescription: string;
  prPitch: string;
}

export interface GeneratedAssetData {
  images: string[]; // base64 encoded image strings
  moodboardImage: string;
  marketingCopy: MarketingCopy;
}