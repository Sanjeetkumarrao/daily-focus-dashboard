import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

export async function generateAIResponse(prompt) {
    const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
    });

    return response.text;
}