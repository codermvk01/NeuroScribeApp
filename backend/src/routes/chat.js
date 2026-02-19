const express = require("express");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message, reportSummary } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // ===== Allowed Topics Control =====
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
      "assessment"
    ];

    const isAllowed = allowedKeywords.some(keyword =>
      message.toLowerCase().includes(keyword)
    );

    if (!isAllowed) {
      return res.json({
        reply:
          "I can only help with Neuroscribe tests, reports, and neurological screening questions."
      });
    }

    // ===== System Prompt =====
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

    const contextInjection = reportSummary
      ? `User's latest screening summary:\n${reportSummary}`
      : "";

    const fullPrompt = `
${systemPrompt}

${contextInjection}

User: ${message}
Assistant:
`;

    // ===== Ollama Call =====
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3",
        prompt: fullPrompt,
        stream: false,
        options: {
          temperature: 0.3,
          num_predict: 120
        }
      }),
    });

    const data = await response.json();

    res.json({ reply: data.response });

  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
