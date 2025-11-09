import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { GeneratedAssetData, MarketingCopy } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const marketingCopySchema = {
  type: Type.OBJECT,
  properties: {
    instagramCaption: {
      type: Type.STRING,
      description: "An exciting Instagram caption (around 40-60 words) with 3-5 relevant hashtags.",
    },
    lookbookDescription: {
      type: Type.STRING,
      description: "A professional and evocative lookbook description (around 80-100 words) for the design.",
    },
    prPitch: {
      type: Type.STRING,
      description: "A short, punchy PR pitch (around 50 words) to send to fashion editors.",
    },
  },
  required: ["instagramCaption", "lookbookDescription", "prPitch"],
};

const generateImage = (base64Image: string, fileType: string, prompt: string) => {
  return ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Image,
            mimeType: fileType,
          },
        },
        {
          text: prompt,
        },
      ],
    },
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });
};

export async function generateFashionAssets(
  base64Image: string,
  fileType: string,
  keywords: string
): Promise<GeneratedAssetData> {

  const lookbookPrompts = [
    `Generate a photorealistic lookbook image of a fashion design based on the provided sketch. The style should reflect these keywords: ${keywords}. Use a clean studio background with professional lighting. The model should be posing elegantly in a full-body shot.`,
    `Generate a dynamic, photorealistic action shot of the design based on the sketch, with these keywords: ${keywords}. The model should be captured as if walking down a runway or a stylish city street.`,
    `Generate a detailed, artistic close-up shot of the fashion design from the sketch, focusing on fabric texture, and intricate details. Keywords: ${keywords}. The lighting should be dramatic to highlight the craftsmanship.`
  ];
  
  const moodboardPrompt = `Create a visually stunning fashion mood board based on the provided sketch and these keywords: ${keywords}. The mood board should be a collage that includes inspirational images, fabric textures, a color palette, and typographic elements that capture the essence of the design's mood.`;

  // Parallelize API calls
  const [imageResponse1, imageResponse2, imageResponse3, moodboardResponse, textResponse] = await Promise.all([
    generateImage(base64Image, fileType, lookbookPrompts[0]),
    generateImage(base64Image, fileType, lookbookPrompts[1]),
    generateImage(base64Image, fileType, lookbookPrompts[2]),
    generateImage(base64Image, fileType, moodboardPrompt),
    // Text generation call
    ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a fashion marketing expert for Bengaluru International Fashion Week. Based on a design described by the keywords '${keywords}', generate marketing assets.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: marketingCopySchema,
      },
    }),
  ]);

  // Process image responses
  const imageResponses = [imageResponse1, imageResponse2, imageResponse3];
  const generatedImagesBase64 = imageResponses.map(response => {
    const imagePart = response?.candidates?.[0]?.content?.parts?.[0];
    if (imagePart && imagePart.inlineData) {
      return imagePart.inlineData.data;
    }
    throw new Error('Image generation failed for one of the lookbook shots.');
  });
  
  if (generatedImagesBase64.length === 0) {
      throw new Error('Image generation failed or returned an unexpected format.');
  }

  // Process mood board response
  const moodboardImagePart = moodboardResponse?.candidates?.[0]?.content?.parts?.[0];
  if (!moodboardImagePart || !moodboardImagePart.inlineData) {
    throw new Error('Mood board image generation failed.');
  }
  const moodboardImageBase64 = moodboardImagePart.inlineData.data;

  // Process text response
  const marketingCopy = JSON.parse(textResponse.text) as MarketingCopy;
  
  if(!marketingCopy.instagramCaption || !marketingCopy.lookbookDescription || !marketingCopy.prPitch) {
    throw new Error('Marketing copy generation failed to produce all required fields.');
  }

  return {
    images: generatedImagesBase64,
    moodboardImage: moodboardImageBase64,
    marketingCopy,
  };
}
