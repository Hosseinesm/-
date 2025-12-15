import { GoogleGenAI } from "@google/genai";
import { DashboardData, GroundingChunk } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchLivePrices = async (): Promise<DashboardData> => {
  const model = "gemini-2.5-flash";
  
  const prompt = `
    لطفاً آخرین قیمت‌های لحظه‌ای بازار ایران را برای دو دسته زیر پیدا کن:

    دسته اول (بازار مالی):
    1. قیمت طلا 18 عیار (هر گرم)
    2. قیمت دلار آزاد
    3. قیمت یورو آزاد
    4. قیمت نفت ایران (جهانی)
    5. قیمت انس طلا (جهانی)

    دسته دوم (کالاهای اساسی - قیمت مصرف کننده در ایران):
    1. برنج ایرانی (طارم/هاشمی - کیلوگرم)
    2. مرغ گرم (کیلوگرم)
    3. گوشت قرمز (گوسفندی/گوساله - کیلوگرم)
    4. شکر (کیلوگرم)
    5. تخم مرغ (شانه 30 عددی)

    نتیجه را دقیقاً در یک بلوک کد JSON با ساختار زیر برگردان:
    \`\`\`json
    {
      "market": {
        "gold18k": "قیمت",
        "usd": "قیمت",
        "eur": "قیمت",
        "oil": "قیمت",
        "ounce": "قیمت"
      },
      "essentials": {
        "rice": "قیمت",
        "chicken": "قیمت",
        "meat": "قیمت",
        "sugar": "قیمت",
        "eggs": "قیمت"
      }
    }
    \`\`\`
    فقط اعداد و واحد پول را بنویس.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";
    
    // Extract JSON from markdown code block
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/) || text.match(/{[\s\S]*}/);
    
    let parsedData: any = {};
    if (jsonMatch) {
      try {
        parsedData = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      } catch (e) {
        console.error("Failed to parse JSON from Gemini response", e);
      }
    }

    // Safely map data even if partial
    const market = parsedData.market || {};
    const essentials = parsedData.essentials || {};

    // Extract sources
    const sources: string[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] | undefined;
    if (chunks) {
      chunks.forEach(chunk => {
        if (chunk.web?.uri) {
          sources.push(chunk.web.uri);
        }
      });
    }

    return {
      market: {
        gold18k: market.gold18k || "نامشخص",
        usd: market.usd || "نامشخص",
        eur: market.eur || "نامشخص",
        oil: market.oil || "نامشخص",
        ounce: market.ounce || "نامشخص",
      },
      essentials: {
        rice: essentials.rice || "نامشخص",
        chicken: essentials.chicken || "نامشخص",
        meat: essentials.meat || "نامشخص",
        sugar: essentials.sugar || "نامشخص",
        eggs: essentials.eggs || "نامشخص",
      },
      lastUpdated: new Date().toLocaleTimeString('fa-IR'),
      sources: [...new Set(sources)]
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
