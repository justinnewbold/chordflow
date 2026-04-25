// ChordFlow Songs API - Save, Load, Share progressions
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();

    if (!supabaseUrl || !supabaseKey) return res.status(500).json({ error: 'Supabase not configured' });
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { action } = req.query;

    try {
        switch (action) {
            case 'save':
                return await saveSong(req, res, supabase);
            case 'load':
                return await loadSongs(req, res, supabase);
            case 'get':
                return await getSong(req, res, supabase);
            case 'delete':
                return await deleteSong(req, res, supabase);
            case 'share':
                return await shareSong(req, res, supabase);
            case 'community':
                return await getCommunity(req, res, supabase);
            default:
                return res.status(400).json({ error: 'Invalid action' });
        }
    } catch (error) {
        console.error('Songs API error:', error);
        return res.status(500).json({ error: error.message });
    }
}

// Verify JWT and return the authenticated user, or null if unauthenticated
async function getAuthUser(req, supabase) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return null;
    const { data: { user }, error } = await supabase.auth.getUser(token);
    return error ? null : user;
}

// Caps for save payloads. Without these a single POST could push an
// arbitrarily large blob into Supabase and burn through storage quota.
const MAX_TITLE_LEN = 200;
const MAX_SHORT_LEN = 32;
const MAX_SONG_BYTES = 64 * 1024;
const MIN_TEMPO = 20;
const MAX_TEMPO = 400;

function validateSavePayload(body) {
    const { title, song, key, scale, genre, tempo } = body || {};
    if (title != null && (typeof title !== 'string' || title.length > MAX_TITLE_LEN)) {
        return `title must be a string of at most ${MAX_TITLE_LEN} characters`;
    }
    if (song == null || typeof song !== 'object') return 'song must be an object';
    let serialized;
    try { serialized = JSON.stringify(song); } catch { return 'song is not serializable'; }
    if (serialized.length > MAX_SONG_BYTES) return `song exceeds ${MAX_SONG_BYTES} bytes`;
    for (const [name, value] of [['key', key], ['scale', scale], ['genre', genre]]) {
        if (value != null && (typeof value !== 'string' || value.length > MAX_SHORT_LEN)) {
            return `${name} must be a string of at most ${MAX_SHORT_LEN} characters`;
        }
    }
    let parsedTempo = null;
    if (tempo != null) {
        parsedTempo = Number(tempo);
        if (!Number.isFinite(parsedTempo) || parsedTempo < MIN_TEMPO || parsedTempo > MAX_TEMPO) {
            return `tempo must be a number between ${MIN_TEMPO} and ${MAX_TEMPO}`;
        }
    }
    return { serialized, tempo: parsedTempo };
}

// Save a song to user's library
async function saveSong(req, res, supabase) {
    const validation = validateSavePayload(req.body);
    if (typeof validation === 'string') return res.status(400).json({ error: validation });
    const { title, key, scale, genre } = req.body;
    const { serialized, tempo } = validation;

    const user = await getAuthUser(req, supabase);
    if (!user) {
        // Save to localStorage fallback (return ID for client-side storage)
        const localId = 'local_' + Date.now();
        return res.status(200).json({
            id: localId,
            message: 'Saved locally (sign in for cloud sync)',
            local: true
        });
    }

    const { data, error } = await supabase
        .from('songs')
        .insert({
            user_id: user.id,
            title: title || 'Untitled Song',
            song_data: serialized,
            key_signature: key,
            scale: scale,
            genre: genre,
            tempo: tempo,
            is_public: false,
            created_at: new Date().toISOString()
        })
        .select()
        .single();

    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json({ id: data.id, song: data });
}

// Load user's songs
async function loadSongs(req, res, supabase) {
    const user = await getAuthUser(req, supabase);

    if (!user) {
        return res.status(200).json({ songs: [], message: 'Sign in to see saved songs' });
    }

    const { data, error } = await supabase
        .from('songs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json({ songs: data });
}

// Get a specific song by ID (for sharing or loading user's own)
async function getSong(req, res, supabase) {
    const { id } = req.query;

    if (!id) return res.status(400).json({ error: 'Song ID required' });

    const { data, error } = await supabase
        .from('songs')
        .select('*')
        .eq('id', id)
        .single();

    if (error) return res.status(404).json({ error: 'Song not found' });

    // Public songs are accessible to anyone; private songs require the owner's token
    if (!data.is_public) {
        const user = await getAuthUser(req, supabase);
        if (!user || user.id !== data.user_id) {
            return res.status(403).json({ error: 'This song is private' });
        }
    }

    return res.status(200).json({ song: data });
}

// Delete a song
async function deleteSong(req, res, supabase) {
    const { id } = req.body;

    if (!id) return res.status(400).json({ error: 'Song ID required' });

    const user = await getAuthUser(req, supabase);
    if (!user) return res.status(401).json({ error: 'Authentication required' });

    const { error } = await supabase
        .from('songs')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json({ success: true });
}

// Make a song public/shareable
async function shareSong(req, res, supabase) {
    const { id, isPublic } = req.body;

    if (!id) return res.status(400).json({ error: 'Song ID required' });

    const user = await getAuthUser(req, supabase);
    if (!user) return res.status(401).json({ error: 'Authentication required' });

    const { data, error } = await supabase
        .from('songs')
        .update({ is_public: isPublic === true })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

    if (error) return res.status(400).json({ error: error.message });

    // Use the deployment's public URL only — proxy headers like x-forwarded-host are
    // attacker-controllable and could be abused to mint phishing share links.
    const publicHost = process.env.PUBLIC_APP_HOST || 'chordflow-newbold-cloud.vercel.app';
    const shareUrl = `https://${publicHost}/?song=${data.id}`;
    return res.status(200).json({ shareUrl, song: data });
}

// Get community (public) songs
async function getCommunity(req, res, supabase) {
    const { genre, limit: limitStr = '20', offset: offsetStr = '0' } = req.query;
    const parsedLimit = Math.min(Math.max(parseInt(limitStr, 10) || 20, 1), 100);
    const parsedOffset = Math.max(parseInt(offsetStr, 10) || 0, 0);

    let query = supabase
        .from('songs')
        .select('id, title, key_signature, scale, genre, tempo, created_at, user_id, song_data')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .range(parsedOffset, parsedOffset + parsedLimit - 1);

    if (genre && genre !== 'all') {
        query = query.eq('genre', genre);
    }

    const { data, error } = await query;

    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json({ songs: data });
}
