
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const getAIOptimizedDescription = async (baseDesc: string) => {
  if (!baseDesc || baseDesc.length < 3) return baseDesc;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Transform this interior design item description into a professional purchase order line item: "${baseDesc}". Keep it concise and technical.`,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Gemini Error:", error);
    return baseDesc;
  }
};

export const suggestTermsAndConditions = async () => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate 4 brief professional standard terms and conditions for an interior design company's purchase order. Focus on delivery, quality, and payment.",
      config: {
          responseMimeType: "application/json",
          responseSchema: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
          }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    return ["Standard warranty applies", "Payment within 30 days", "Goods subject to inspection"];
  }
};
