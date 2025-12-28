export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, action } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  // Try Gemini first, then fallback to AI Gateway
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const AI_GATEWAY_KEY = process.env.AI_GATEWAY_API_KEY;

  // Try Gemini API first
  if (GEMINI_API_KEY) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: action === 'continue' ? 50 : 200
            }
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const result = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        return res.status(200).json({ result });
      }
    } catch (err) {
      console.log('Gemini failed, trying AI Gateway...');
    }
  }

  // Fallback to Anthropic AI Gateway
  if (AI_GATEWAY_KEY) {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': AI_GATEWAY_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: action === 'continue' ? 100 : 300,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const result = data.content?.[0]?.text || '';
        return res.status(200).json({ result });
      }
      
      const errData = await response.json();
      return res.status(response.status).json({ error: errData.error?.message || 'AI Gateway error' });
    } catch (err) {
      console.error('AI Gateway error:', err);
    }
  }

  return res.status(500).json({ error: 'No working AI provider configured. Please update API keys.' });
}
