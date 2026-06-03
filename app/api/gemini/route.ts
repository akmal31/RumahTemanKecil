import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Initialize Gemini Client properly
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {
          error:
            "Kunci API Gemini belum dikonfigurasi di secrets. Silakan tambahkan 'GEMINI_API_KEY' di Settings > Secrets.",
        },
        { status: 500 },
      );
    }

    const { action, payload } = await req.json();

    if (action === "cerita") {
      const { theme, character } = payload;
      const prompt = `Buatkan cerita fabel anak moral interaktif dalam Bahasa Indonesia dengan ketentuan berikut:
Tema fabel: "${theme || "Keberanian"}"
Karakter utama: "${character || "Kelinci Cerdik"}"

Persyaratan cerita:
1. Kisah yang menghibur, menyentuh, dan mendidik untuk anak-anak (usia 5-10 tahun).
2. Tuliskan pesan moral yang terkandung di akhir cerita sebagai bagian terpisah.
3. Struktur keluaran harus berupa JSON dengan struktur berikut:
{
  "title": "judul cerita fabel",
  "storyParagraphs": ["paragraf 1", "paragraf 2", "paragraf 3", "paragraf dst"],
  "moralValue": "Pesan moral fabel ini adalah..."
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              storyParagraphs: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              moralValue: { type: Type.STRING },
            },
            required: ["title", "storyParagraphs", "moralValue"],
          },
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Gagal menerima respons cerita dari Gemini.");
      }

      return NextResponse.json(JSON.parse(responseText));
    }

    if (action === "kamus") {
      const { word } = payload;
      const prompt = `Berikan penjelasan definisi kata bahasa Indonesia "${word}" yang ramah untuk anak-anak (mudah dipahami, seru).
Berikan juga terjemahan bahasa Inggris dari kata tersebut, 3 sinonim kata tersebut, dan buat 2 contoh kalimat lincah yang mudah dipahami anak-masing-masing dengan emoji lucu di setiap bagian.

Format harus dalam bentuk JSON dengan struktur persis:
{
  "word": "${word}",
  "translation": "terjemahan bahasa Inggris",
  "childDefinition": "definisi sederhana ramah anak dengan emoji",
  "synonyms": ["sinonim 1", "sinonim 2", "sinonim 3"],
  "sampleSentences": ["contoh kalimat 1", "contoh kalimat 2"]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              word: { type: Type.STRING },
              translation: { type: Type.STRING },
              childDefinition: { type: Type.STRING },
              synonyms: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              sampleSentences: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: [
              "word",
              "translation",
              "childDefinition",
              "synonyms",
              "sampleSentences",
            ],
          },
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Gagal menerima respons kamus dari Gemini.");
      }

      return NextResponse.json(JSON.parse(responseText));
    }

    if (action === "tanya") {
      const { question, history } = payload;
      const formattedHistory = (history || []).slice(-6).map((chat: any) => ({
        role: chat.role === "user" ? "user" : "model",
        parts: [{ text: chat.content }],
      }));

      const systemInstruction =
        "Kamu adalah Kiko, seekor lumba-lumba pintar yang ramah dan ceria. Kamu adalah asisten anak-anak untuk menjawab pertanyaan rasa ingin tahu mereka (contoh: Kenapa langit biru, kenapa dinosaurus punah). Jawablah dengan bahasa Indonesia yang sangat ramah anak-anak, berikan penjelasan metafora sederhana, antusias (banyak menggunakan kata seru seperti 'Wah!', 'Hebat sekali pertanyaannya!', 'Yuk kita cari tahu!'), dan gunakan emoji laut atau lumba-lumba. Jaga jawaban tetap ringkas (maksimal 3 paragraf pendek) agar anak-anak tidak bosan membaca.";

      const chatSession = ai.chats.create({
        model: "gemini-3.5-flash",
        config: {
          systemInstruction,
        },
        history: formattedHistory,
      });

      const response = await chatSession.sendMessage({
        message: question,
      });

      const replyText = response.text;
      if (!replyText) {
        throw new Error("Gagal menerima jawaban dari Kiko.");
      }

      return NextResponse.json({ reply: replyText });
    }

    return NextResponse.json(
      { error: "Aksi tidak valid atau belum didukung." },
      { status: 400 },
    );
  } catch (error: any) {
    console.error("Gemini API server error:", error);
    return NextResponse.json(
      {
        error:
          error?.message ||
          "Terjadi kesalahan internal ketika menghubungi Gemini AI.",
      },
      { status: 500 },
    );
  }
}
