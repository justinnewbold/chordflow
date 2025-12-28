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

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

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
              maxOutputTokens: 200
            }
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const result = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        if (result) {
          return res.status(200).json({ result });
        }
      }
    } catch (err) {
      console.log('Gemini API error:', err.message);
    }
  }

  // Smart fallback: Use music theory to generate progressions
  const genreProgressions = {
    pop: {
      C: [["C","G","Am","F"],["C","Am","F","G"],["C","F","Am","G"],["Am","F","C","G"]],
      G: [["G","D","Em","C"],["G","Em","C","D"],["Em","C","G","D"],["G","C","D","Em"]],
      D: [["D","A","Bm","G"],["D","Bm","G","A"],["Bm","G","D","A"],["D","G","A","Bm"]],
      Am: [["Am","F","C","G"],["Am","G","F","E"],["Am","C","G","F"],["Am","Dm","G","C"]],
      Em: [["Em","C","G","D"],["Em","G","D","C"],["Em","Am","C","D"],["Em","D","C","G"]]
    },
    rock: {
      C: [["C","G","Am","F"],["C","F","G","C"],["Am","G","F","G"],["C","Bb","F","G"]],
      G: [["G","C","D","G"],["G","D","C","D"],["Em","D","C","G"],["G","F","C","G"]],
      E: [["E","A","B","E"],["E","D","A","E"],["E","G","A","B"],["E","A","D","A"]],
      Am: [["Am","G","F","G"],["Am","F","G","Am"],["Am","C","D","F"],["Am","E","Am","G"]]
    },
    jazz: {
      C: [["Cmaj7","Dm7","G7","Cmaj7"],["Cmaj7","Am7","Dm7","G7"],["Cmaj7","A7","Dm7","G7"]],
      G: [["Gmaj7","Am7","D7","Gmaj7"],["Gmaj7","Cmaj7","Am7","D7"],["Gmaj7","Em7","Am7","D7"]],
      F: [["Fmaj7","Gm7","C7","Fmaj7"],["Fmaj7","Dm7","Gm7","C7"],["Fmaj7","Bbmaj7","Gm7","C7"]]
    },
    blues: {
      C: [["C7","C7","C7","C7"],["F7","F7","C7","C7"],["G7","F7","C7","G7"]],
      G: [["G7","G7","G7","G7"],["C7","C7","G7","G7"],["D7","C7","G7","D7"]],
      E: [["E7","E7","E7","E7"],["A7","A7","E7","E7"],["B7","A7","E7","B7"]]
    },
    lofi: {
      C: [["Cmaj7","Am7","Fmaj7","G7"],["Am7","Dm7","Gmaj7","Cmaj7"],["Fmaj7","Em7","Am7","Dm7"]],
      G: [["Gmaj7","Em7","Cmaj7","D7"],["Em7","Am7","Dmaj7","Gmaj7"],["Cmaj7","Bm7","Em7","Am7"]]
    },
    edm: {
      C: [["C","G","Am","F"],["Am","F","C","G"],["F","C","G","Am"],["C","F","Am","G"]],
      Am: [["Am","F","C","G"],["Am","G","F","C"],["Am","Em","F","G"],["Am","C","F","G"]]
    }
  };

  // Parse prompt for genre and key
  const promptLower = prompt.toLowerCase();
  let genre = 'pop';
  let key = 'C';

  // Detect genre
  const genres = ['pop', 'rock', 'jazz', 'blues', 'lofi', 'edm', 'classical', 'country', 'rnb'];
  for (const g of genres) {
    if (promptLower.includes(g)) {
      genre = g;
      break;
    }
  }

  // Detect key
  const keyMatch = promptLower.match(/key of ([a-g](?:#|m)?)/i);
  if (keyMatch) {
    key = keyMatch[1].charAt(0).toUpperCase() + keyMatch[1].slice(1);
  }

  // Get progressions for this genre/key
  const genreData = genreProgressions[genre] || genreProgressions.pop;
  const keyData = genreData[key] || genreData.C || genreData[Object.keys(genreData)[0]];
  
  // Pick a random progression
  const progression = keyData[Math.floor(Math.random() * keyData.length)];
  
  // Handle different actions
  let result;
  if (action === 'continue') {
    // Add 2-4 more chords that work well
    const continuations = [progression[2], progression[3], progression[0], progression[1]];
    result = JSON.stringify(continuations.slice(0, 2 + Math.floor(Math.random() * 3)));
  } else if (action === 'variation') {
    // Create a slight variation
    const shuffled = [...progression].sort(() => Math.random() - 0.5);
    result = JSON.stringify(shuffled);
  } else {
    result = JSON.stringify(progression);
  }

  return res.status(200).json({ result, source: 'smart-fallback' });
}
