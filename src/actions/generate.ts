"use server";

// Using nanobanana model - lightest and fastest
const MODEL = "nanobanana";
const TIMEOUT_MS = 60000; // 60 second timeout

// Character type prompts - simplified for faster processing
const CHARACTER_PROMPTS: Record<string, string> = {
  male: "anime boy, bishounen, handsome",
  female: "anime girl, beautiful, detailed eyes",
  boy: "young anime boy, shonen style",
  girl: "young anime girl, magical girl",
  warrior: "anime warrior, armor, fierce",
  princess: "anime princess, royal dress, elegant",
  catgirl: "anime catgirl, nekomimi, kawaii",
  villain: "anime villain, dark, menacing",
};

export async function generateImage(characterType: string, stylePrompt: string, referenceImage?: string) {
  const apiKey = process.env.POLLINATIONS_API_KEY;
  
  if (!apiKey) {
    return { success: false, error: "API key não configurada" };
  }
  
  const characterPrompt = CHARACTER_PROMPTS[characterType] || CHARACTER_PROMPTS.male;
  
  // Shorter prompt = faster generation
  const finalPrompt = `${characterPrompt}, ${stylePrompt}, anime art`;
  const encodedPrompt = encodeURIComponent(finalPrompt);
  
  const seed = Math.floor(Math.random() * 1000000);

  // Smallest size = fastest generation
  const url = `https://gen.pollinations.ai/image/${encodedPrompt}?model=${MODEL}&seed=${seed}&width=256&height=384&nologo=true`;

  console.log(`Generating with ${MODEL}...`);
  console.log("Prompt:", finalPrompt);

  try {
    // Add timeout using AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
      },
      cache: "no-store",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log(`Status: ${response.status}`);
    
    const contentType = response.headers.get("content-type");
    
    if (response.ok && contentType?.includes("image")) {
      console.log("Success!");
      
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString("base64");
      const mimeType = contentType || "image/jpeg";
      const dataUrl = `data:${mimeType};base64,${base64}`;
      
      return { success: true, imageUrl: dataUrl };
    }
    
    const errorText = await response.text();
    console.error("API Error:", errorText.substring(0, 200));
    return { success: false, error: `Erro: ${response.status}` };
    
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return { success: false, error: "Timeout - tente novamente" };
    }
    console.error("Error:", error);
    return { success: false, error: "Falha na conexão" };
  }
}
