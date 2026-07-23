import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    const apiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are an expert Tailwind CSS and HTML developer. Generate a complete, responsive UI based on this prompt: "${prompt}". Return ONLY valid HTML code using Tailwind CSS classes via CDN. Do not include markdown formatting like \`\`\`html or any extra explanations, just raw HTML string starting with <!DOCTYPE html>.`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await apiResponse.json();

    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    return NextResponse.json({ code: text });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}