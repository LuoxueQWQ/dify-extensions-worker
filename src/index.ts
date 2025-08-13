// src/index.ts
export default {
  async fetch(req: Request, env: any) {
    // 只做最简单健康检查
    if (req.method === "GET") return new Response("OK");

    // 只处理 /endpoint 且 token 正确
    const url = new URL(req.url);
    if (url.pathname !== "/endpoint") return new Response("404", { status: 404 });

    const body = await req.json<any>();
    if (body.point !== "app.external_data_tool.query") return new Response("ignore");

    // 取 prompt
    const prompt = body.params?.inputs?.prompt ?? "Hi";
    const ai = new Ai(env.AI);            // Workers AI binding
    const { response } = await ai.run("@cf/meta/llama-3-8b-instruct", {
      prompt,
      stream: false,
    });

    return new Response(JSON.stringify({ result: response }), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
