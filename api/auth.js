// ChordFlow Auth API - Supabase Integration
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-project.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY;

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') return res.status(200).end();

    const { action } = req.query;
    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        switch (action) {
            case 'signup':
                return await signUp(req, res, supabase);
            case 'login':
                return await login(req, res, supabase);
            case 'logout':
                return await logout(req, res, supabase);
            case 'user':
                return await getUser(req, res, supabase);
            default:
                return res.status(400).json({ error: 'Invalid action' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

async function signUp(req, res, supabase) {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json({ user: data.user, session: data.session });
}

async function login(req, res, supabase) {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json({ user: data.user, session: data.session });
}

async function logout(req, res, supabase) {
    const { error } = await supabase.auth.signOut();
    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json({ success: true });
}

async function getUser(req, res, supabase) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'No token' });
    
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error) return res.status(401).json({ error: error.message });
    return res.status(200).json({ user });
}
