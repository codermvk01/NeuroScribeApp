const express = require("express");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message, reportSummary } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    const allowedKeywords = [
      "risk",
      "score",
      "test",
      "report",
      "tremor",
      "speech",
      "drawing",
      "video",
      "neurological",
      "assessment",
    ];

    const isAllowed = allowedKeywords.some((keyword) => message.toLowerCase().includes(keyword));

    if (!isAllowed) {
      return res.json({
        reply: "I can only help with Neuroscribe tests, reports, and neurological screening questions.",
      });
    }

    const systemPrompt = `
You are Neuroscribe Assistant, a neurological screening support AI.

Rules:
- Respond in 2–3 sentences maximum.
- Keep answers short and relevant.
- No diagnosis or disease confirmation.
- If risk is moderate or high, briefly suggest consulting a professional.
- Use simple, calm, layman language.
- Only answer questions related to Neuroscribe tests and reports.
`;

    const contextInjection = reportSummary ? `User's latest screening summary:\n${reportSummary}` : "";

    const fullPrompt = `
${systemPrompt}

${contextInjection}

User: ${message}
Assistant:
`;

    const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434/api/generate";
    const ollamaModel = process.env.OLLAMA_MODEL || "llama3";

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);

    const response = await fetch(ollamaUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: ollamaModel,
        prompt: fullPrompt,
        stream: false,
        options: {
          temperature: 0.3,
          num_predict: 120,
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const rawError = await response.text();
      console.error("Ollama request failed:", response.status, rawError);
      return res.status(502).json({ error: "Upstream chat service unavailable" });
    }

    const data = await response.json();

    return res.json({ reply: data.response || "Sorry, I couldn't generate a reply right now." });
  } catch (error) {
    const isTimeout = error?.name === "AbortError";
    if (isTimeout) {
      return res.status(504).json({ error: "Chat service timed out" });
    }

    console.error("Chat error:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
