export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "프롬프트를 입력해주세요." }),
        {
          status: 400,
        }
      );
    }

    const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!response.ok) {
      throw new Error(`HF API Error: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const dataUrl = `data:image/png;base64,${base64}`;

    return new Response(JSON.stringify({ url: dataUrl }), { status: 200 });
  } catch (error) {
    console.error("SDXL 이미지 생성 오류:", error);
    return new Response(JSON.stringify({ error: "이미지 생성 실패" }), {
      status: 500,
    });
  }
}
