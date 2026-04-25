// ChordFlow AI API - Lyrics, Analysis, Continue, Melody
// Restrict cross-origin browser callers — `*` let other sites burn our Gemini quota.
const PUBLIC_HOST = process.env.PUBLIC_APP_HOST || 'chordflow-newbold-cloud.vercel.app';
const ALLOWED_ORIGIN_PATTERNS = [
    new RegExp('^https://' + PUBLIC_HOST.replace(/[.+?^${}()|[\]\\]/g, '\\$&') + '$'),
    /^https:\/\/chordflow[\w-]*\.vercel\.app$/,
    /^https?:\/\/localhost(:\d+)?$/,
    /^https?:\/\/127\.0\.0\.1(:\d+)?$/
];
function applyCors(req, res, methods) {
    const origin = req.headers.origin || '';
    if (ALLOWED_ORIGIN_PATTERNS.some(rx => rx.test(origin))) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Vary', 'Origin');
    }
    res.setHeader('Access-Control-Allow-Methods', methods);
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req, res) {
    applyCors(req, res, 'GET, POST, OPTIONS');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

    const { action, chords, key, scale, genre, mood, theme } = req.body;
    const GEMINI_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_KEY) return res.status(500).json({ error: 'API key not configured' });

    // Cap chord input so a malicious caller can't blow up the prompt or burn quota.
    const MAX_CHORDS = 64;
    const safeChords = Array.isArray(chords)
        ? chords.slice(0, MAX_CHORDS).filter(c => typeof c === 'string' && c.length > 0 && c.length <= 16)
        : (typeof chords === 'string' && chords.length <= 256 ? [chords] : []);
    const chordStr = safeChords.length > 0 ? safeChords.join(' - ') : 'C - G - Am - F';
    const prompts = {
        lyrics: `Write 4 song lyric lines for chords: ${chordStr}. Genre: ${genre}, Mood: ${mood}, Theme: ${theme || 'life'}. Return ONLY JSON array of 4 strings.`,
        analyze: `Analyze chord progression ${chordStr} in ${key} ${scale} (${genre}). Brief analysis: what works, emotional journey, similar songs, one variation tip. Under 100 words.`,
        continue: `Continue this ${genre} progression in ${key} ${scale}: ${chordStr}. Suggest 2 more chords. Return ONLY JSON array like ["Dm","G7"].`,
        melody: `For chords ${chordStr} in ${key}, suggest 4 melody notes per chord. Return JSON array of arrays like [["C4","E4","G4","E4"]].`
    };

    const prompt = prompts[action];
    if (!prompt) return res.status(400).json({ error: 'Invalid action' });

    try {
        // Bound the upstream call so a slow Gemini doesn't hold a serverless slot
        // for the full Vercel function timeout while the user stares at a spinner.
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 15000);
        let response;
        try {
            response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: { temperature: 0.8, maxOutputTokens: 300 }
                    }),
                    signal: controller.signal
                }
            );
        } finally {
            clearTimeout(timer);
        }

        if (!response.ok) {
            return res.status(502).json({ error: 'AI service error' });
        }
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
        if (error.name === 'AbortError') {
            return res.status(504).json({ error: 'AI service timeout' });
        }
        return res.status(500).json({ error: error.message });
    }
}
