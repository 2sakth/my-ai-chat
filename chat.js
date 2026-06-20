// api/chat.js
// Vercel serverless function. Keeps the Gemini API key on the server side only.
// Reads the key from the GEMINI_API_KEY environment variable you set in Vercel.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'Server is missing GEMINI_API_KEY. Add it in your Vercel project settings under Environment Variables, then redeploy.'
    });
  }

  const { history } = req.body || {};

  if (!Array.isArray(history) || history.length === 0) {
    return res.status(400).json({ error: 'No message provided.' });
  }

  // Basic guardrails: cap history length and message size sent upstream
  const trimmedHistory = history.slice(-20); // last 20 turns is plenty of context
  const contents = trimmedHistory.map((turn) => ({
    role: turn.role === 'user' ? 'user' : 'model',
    parts: [{ text: String(turn.text || '').slice(0, 4000) }]
  }));

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  try {
    const upstream = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 1024
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' }
        ]
      })
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      const message = data?.error?.message || 'The AI provider returned an error.';
      // Surface rate-limit errors clearly since the free tier has daily/minute limits
      if (upstream.status === 429) {
        return res.status(429).json({ error: 'Free tier rate limit hit. Wait a minute and try again.' });
      }
      return res.status(upstream.status).json({ error: message });
    }

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      // Often means the response was blocked by safety filters
      const blockReason = data?.candidates?.[0]?.finishReason;
      return res.status(200).json({
        reply: blockReason === 'SAFETY'
          ? "I can't help with that one. Try rephrasing, or ask something else."
          : "I didn't get a usable reply that time — try asking again."
      });
    }

    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({ error: 'Unexpected server error. Please try again.' });
  }
}
