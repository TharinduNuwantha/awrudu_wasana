import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || ''; 

// Initialize GenAI only if key is present to avoid immediate crashes, 
// though specific calls will fail if missing.
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateSinhalaWish = async (senderName: string, relationship: string): Promise<string> => {
    if (!ai) {
        console.warn("API Key missing");
        return "සුභ අලුත් අවුරුද්දක් වේවා! (API Key Missing - Fallback)";
    }

    try {
        const model = 'gemini-3-flash-preview';
        const prompt = `
            You are a Sri Lankan New Year well-wisher.
            Write a unique, warm, and traditional Sinhala New Year wish (Suba Aluth Avurudde) from ${senderName}.
            Recipient: ${relationship} (Friend/Family).
            The tone should be auspicious and joyful.
            Output ONLY the Sinhala text. Max 25 words.
        `;

        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                temperature: 1.2, // High creativity for diverse wishes
                topK: 40,
            }
        });

        return response.text?.trim() || "සාමය සතුට පිරි සුභ අලුත් අවුරුද්දක් වේවා!";
    } catch (error) {
        console.error("Error generating wish:", error);
        return "සාමය සතුට පිරි සුභ අලුත් අවුරුද්දක් වේවා!";
    }
};