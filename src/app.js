import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import fetch from 'node-fetch';
import nodemailer from 'nodemailer';
import Database from 'better-sqlite3';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createDb(dbPath = path.join(__dirname, '..', 'data.sqlite')) {
    const db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    db.exec(`
  CREATE TABLE IF NOT EXISTS transcripts (
    id TEXT PRIMARY KEY,
    filename TEXT,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS prompts (
    id TEXT PRIMARY KEY,
    transcript_id TEXT NOT NULL,
    prompt TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(transcript_id) REFERENCES transcripts(id)
  );
  CREATE TABLE IF NOT EXISTS summaries (
    id TEXT PRIMARY KEY,
    transcript_id TEXT NOT NULL,
    prompt_id TEXT,
    raw_output TEXT NOT NULL,
    edited_output TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(transcript_id) REFERENCES transcripts(id),
    FOREIGN KEY(prompt_id) REFERENCES prompts(id)
  );
  `);
    return db;
}

export async function callGroq({ model, prompt, max_tokens }) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error('GROQ_API_KEY is not set');
    const url = process.env.GROQ_API_URL || 'https://api.groq.com/openai/v1/completions';
    const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({ model, prompt, max_tokens })
    });
    if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`Groq API error: ${resp.status} ${text}`);
    }
    const data = await resp.json();
    const output = data?.choices?.[0]?.text ?? data?.output ?? JSON.stringify(data);
    return output;
}

export function createMailer() {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === 'true',
        auth: process.env.SMTP_USER && process.env.SMTP_PASS ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined
    });
}

export function createApp({ db } = {}) {
    const app = express();
    app.use(cors());
    app.use(express.json({ limit: '2mb' }));

    const database = db || createDb();

    const storage = multer.memoryStorage();
    const upload = multer({
        storage,
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter: (req, file, cb) => {
            const allowed = ['.txt', '.md'];
            const ext = path.extname(file.originalname).toLowerCase();
            if (allowed.includes(ext)) return cb(null, true);
            return cb(new Error('Only .txt or .md files are allowed'));
        }
    });

    app.get('/api/health', (req, res) => res.json({ ok: true }));

    app.post('/api/uploadTranscript', upload.single('file'), (req, res) => {
        try {
            let content = '';
            let filename = null;
            if (req.file) {
                content = req.file.buffer.toString('utf-8');
                filename = req.file.originalname;
            } else if (typeof req.body.text === 'string' && req.body.text.trim().length > 0) {
                content = req.body.text;
            } else {
                return res.status(400).json({ error: 'Provide a .txt/.md file under field "file" or raw text under field "text".' });
            }
            const id = uuidv4();
            database.prepare('INSERT INTO transcripts (id, filename, content) VALUES (?, ?, ?)').run(id, filename, content);
            return res.status(201).json({ transcriptId: id, length: content.length });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    });

    app.post('/api/setPrompt', (req, res) => {
        try {
            const { transcriptId, prompt } = req.body || {};
            if (!transcriptId || !prompt) return res.status(400).json({ error: 'transcriptId and prompt are required' });
            const t = database.prepare('SELECT id FROM transcripts WHERE id = ?').get(transcriptId);
            if (!t) return res.status(404).json({ error: 'Transcript not found' });
            const id = uuidv4();
            database.prepare('INSERT INTO prompts (id, transcript_id, prompt) VALUES (?, ?, ?)').run(id, transcriptId, prompt);
            return res.status(201).json({ promptId: id });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    });

    app.post('/api/generateSummary', async (req, res) => {
        try {
            const { transcriptId, promptId } = req.body || {};
            if (!transcriptId) return res.status(400).json({ error: 'transcriptId is required' });
            const t = database.prepare('SELECT * FROM transcripts WHERE id = ?').get(transcriptId);
            if (!t) return res.status(404).json({ error: 'Transcript not found' });
            let prompt = 'Summarize the following meeting notes.';
            let pId = null;
            if (promptId) {
                const p = database.prepare('SELECT * FROM prompts WHERE id = ? AND transcript_id = ?').get(promptId, transcriptId);
                if (!p) return res.status(404).json({ error: 'Prompt not found for transcript' });
                prompt = p.prompt; pId = p.id;
            } else {
                const p = database.prepare('SELECT * FROM prompts WHERE transcript_id = ? ORDER BY created_at DESC LIMIT 1').get(transcriptId);
                if (p) { prompt = p.prompt; pId = p.id; }
            }
            const payload = { model: process.env.GROQ_MODEL || 'groq-lite', prompt: `${prompt}\n\nTranscript:\n${t.content}`, max_tokens: 800 };
            const groqCaller = app.locals.callGroq || callGroq;
            const output = await groqCaller(payload);
            const id = uuidv4();
            database.prepare('INSERT INTO summaries (id, transcript_id, prompt_id, raw_output, edited_output) VALUES (?, ?, ?, ?, ?)')
                .run(id, transcriptId, pId, output, output);
            return res.status(201).json({ summaryId: id, raw: output });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    });

    app.put('/api/summary/:id', (req, res) => {
        try {
            const { id } = req.params;
            const { edited } = req.body || {};
            if (!edited) return res.status(400).json({ error: 'edited is required' });
            const s = database.prepare('SELECT id FROM summaries WHERE id = ?').get(id);
            if (!s) return res.status(404).json({ error: 'Summary not found' });
            database.prepare('UPDATE summaries SET edited_output = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(edited, id);
            return res.json({ ok: true });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    });

    app.get('/api/transcript/:id', (req, res) => {
        const t = database.prepare('SELECT id, filename, content, created_at FROM transcripts WHERE id = ?').get(req.params.id);
        if (!t) return res.status(404).json({ error: 'Not found' });
        res.json(t);
    });

    app.get('/api/summary/:id', (req, res) => {
        const s = database.prepare('SELECT id, transcript_id, raw_output, edited_output, created_at, updated_at FROM summaries WHERE id = ?').get(req.params.id);
        if (!s) return res.status(404).json({ error: 'Not found' });
        res.json(s);
    });

    app.post('/api/shareSummary', async (req, res) => {
        try {
            const { summaryId, recipients } = req.body || {};
            if (!summaryId || !Array.isArray(recipients) || recipients.length === 0) {
                return res.status(400).json({ error: 'summaryId and recipients[] required' });
            }
            const s = database.prepare('SELECT * FROM summaries WHERE id = ?').get(summaryId);
            if (!s) return res.status(404).json({ error: 'Summary not found' });
            const mailer = (app.locals.createMailer || createMailer)();
            const info = await mailer.sendMail({
                from: process.env.MAIL_FROM || process.env.SMTP_USER,
                to: recipients.join(','),
                subject: 'Meeting Summary',
                text: s.edited_output || s.raw_output
            });
            res.json({ ok: true, messageId: info.messageId || 'sent' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // Serve static frontend
    app.use(express.static(path.join(__dirname, 'public')));
    // Explicit root route for environments that don't auto-serve index.html
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });

    app.locals.db = database;
    return app;
}

export default createApp;
