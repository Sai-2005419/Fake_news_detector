
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "./types";

export const analyzeNews = async (content: string): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Analyze the following news content for credibility, bias, and factual accuracy. 
    Content to analyze: "${content}"`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          credibilityScore: { type: Type.NUMBER, description: "A score from 0-100 where 100 is highly credible." },
          verdict: { type: Type.STRING, description: "One of: Reliable, Partially Reliable, Unreliable, Likely Fake" },
          summary: { type: Type.STRING, description: "A concise summary of the analysis." },
          biasAnalysis: {
            type: Type.OBJECT,
            properties: {
              level: { type: Type.STRING, description: "Low, Medium, or High" },
              description: { type: Type.STRING }
            },
            required: ["level", "description"]
          },
          factualAccuracy: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER, description: "0-100 score for facts." },
              issues: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["score", "issues"]
          },
          clickbaitPotential: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER, description: "0-100 score for clickbait nature." },
              description: { type: Type.STRING }
            },
            required: ["score", "description"]
          },
          keyClaims: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                claim: { type: Type.STRING },
                isVerified: { type: Type.BOOLEAN },
                explanation: { type: Type.STRING }
              },
              required: ["claim", "isVerified", "explanation"]
            }
          }
        },
        required: ["credibilityScore", "verdict", "summary", "biasAnalysis", "factualAccuracy", "clickbaitPotential", "keyClaims"]
      }
    }
  });

  const text = response.text;
  const parsed: any = JSON.parse(text);

  // Extract grounding URLs
  const sources: { title: string; url: string }[] = [];
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  
  if (groundingChunks) {
    groundingChunks.forEach((chunk: any) => {
      if (chunk.web) {
        sources.push({
          title: chunk.web.title || "External Source",
          url: chunk.web.uri
        });
      }
    });
  }

  return {
    ...parsed,
    sourcesFound: sources
  };
};
