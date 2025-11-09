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

export interface Look extends GeneratedAssetData {
  id: string;
  name: string;
  createdAt: string;
  originalSketch: string; // base64 of the original uploaded file
  prompt: string;
}

export interface Collection {
  id: string;
  name: string;
  looks: Look[];
}
