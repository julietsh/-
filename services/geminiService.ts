import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generatePoemFromImage = async (base64Image: string): Promise<string> => {
  try {
    // Remove the data URL prefix (e.g., "data:image/jpeg;base64,") to get just the base64 string
    const base64Data = base64Image.split(',')[1];
    const mimeType = base64Image.substring(base64Image.indexOf(':') + 1, base64Image.indexOf(';'));

    const prompt = `
      이 이미지를 보고 느껴지는 감정을 담아 아름답고 서정적인 한국어 시를 한 편 지어주세요.
      제목을 포함해주시고, 너무 길지 않게(10행 이내) 작성해주세요.
      형식:
      
      [제목]
      
      (시 내용)
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          },
          {
            text: prompt
          }
        ]
      },
      config: {
        temperature: 0.7, // Slightly creative
        maxOutputTokens: 500,
      }
    });

    return response.text || "시를 지을 수 없었어요. 다시 시도해주세요.";
  } catch (error) {
    console.error("Gemini generation error:", error);
    throw new Error("Gemini API 호출 중 오류가 발생했습니다.");
  }
};
