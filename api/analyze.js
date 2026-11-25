// Vercel serverless function. Keeps the API key on the server.
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.status(500).json({ error: 'GEMINI_API_KEY is not set' });
  const { prompt, images } = req.body || {};
  if (typeof prompt !== 'string' || !prompt || prompt.length > 12000) return res.status(400).json({ error: 'Bad prompt' });
  const parts = [{ text: prompt }];
  (Array.isArray(images) ? images.slice(0, 5) : []).forEach((d) => {
    const m = /^data:(image\/[a-z+.-]+);base64,(.+)$/i.exec(d || '');
    if (m) parts.push({ inline_data: { mime_type: m[1], data: m[2] } });
  });
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  try {
    const r = await fetch('https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({ contents: [{ parts }] })
    });
    const j = await r.json();
    if (!r.ok) return res.status(502).json({ error: (j.error && j.error.message) || 'AI error' });
    const cand = j.candidates && j.candidates[0];
    const text = ((cand && cand.content && cand.content.parts) || []).map((p) => p.text || '').join('');
    return res.status(200).json({ text });
  } catch (e) {
    return res.status(502).json({ error: 'Could not reach the AI service' });
  }
};
