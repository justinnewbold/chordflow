// ChordFlow AI API - Lyrics, Analysis, Continue, Melody
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

    const { action, chords, key, scale, genre, mood, theme } = req.body;
    const GEMINI_KEY = process.env.GEMINI_API_KEY;
    
    if (!GEMINI_KEY) return res.status(500).json({ error: 'API key not configured' });

    const prompts = {
        lyrics: `Write 4 song lyric lines for chords: ${chords?.join(' - ')}. Genre: ${genre}, Mood: ${mood}, Theme: ${theme || 'life'}. Return ONLY JSON array of 4 strings.`,
        analyze: `Analyze chord progression ${chords?.join(' - ')} in ${key} ${scale} (${genre}). Brief analysis: what works, emotional journey, similar songs, one variation tip. Under 100 words.`,
        continue: `Continue this ${genre} progression in ${key} ${scale}: ${chords?.join(' - ')}. Suggest 2 more chords. Return ONLY JSON array like ["Dm","G7"].`,
        melody: `For chords ${chords?.join(' - ')} in ${key}, suggest 4 melody notes per chord. Return JSON array of arrays like [["C4","E4","G4","E4"]].`
    };

    const prompt = prompts[action];
    if (!prompt) return res.status(400).json({ error: 'Invalid action' });

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { temperature: 0.8, maxOutputTokens: 300 }
                })
            }
        );

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        
        // Try parsing as JSON for structured responses
        if (action !== 'analyze') {
            try {
                const parsed = JSON.parse(text.replace(/```json\n?|\n?```/g, '').trim());
                return res.status(200).json({ [action]: parsed });
            } catch {
                // Return raw text if not JSON
            }
        }
        
        return res.status(200).json({ [action]: text });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
