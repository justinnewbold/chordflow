// ChordFlow Auth API - Supabase Integration
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Restrict cross-origin browser callers — the prior wildcard exposed this auth
// endpoint to credential-stuffing from any third-party site.
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
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export default async function handler(req, res) {
    applyCors(req, res, 'GET, POST, OPTIONS');

    if (req.method === 'OPTIONS') return res.status(200).end();

    if (!supabaseUrl || !supabaseKey) return res.status(500).json({ error: 'Supabase not configured' });

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
        console.error('Auth error:', error);
        return res.status(500).json({ error: 'Authentication service error' });
    }
}

async function signUp(req, res, supabase) {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
        // Map Supabase errors to a generic response so we don't leak which emails are registered.
        console.error('Signup error:', error.message);
        return res.status(400).json({ error: 'Could not create account' });
    }
    return res.status(200).json({ user: data.user, session: data.session });
}

async function login(req, res, supabase) {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        console.error('Login error:', error.message);
        return res.status(400).json({ error: 'Invalid email or password' });
    }
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
