import request from 'supertest';

let app;

beforeAll(async () => {
    const { createApp } = await import('../src/app.js');
    app = createApp();
    // mock groq
    app.locals.callGroq = async () => 'Mocked summary output.';
    // mock mailer
    app.locals.createMailer = () => ({ sendMail: async () => ({ messageId: 'test-123' }) });
});

describe('API', () => {
    let transcriptId; let promptId; let summaryId;

    test('health works', async () => {
        const res = await request(app).get('/api/health');
        expect(res.status).toBe(200);
        expect(res.body.ok).toBe(true);
    });

    test('upload via text', async () => {
        const res = await request(app)
            .post('/api/uploadTranscript')
            .send({ text: 'Meeting started at 10am. Discussed Q3 targets.' });
        expect(res.status).toBe(201);
        transcriptId = res.body.transcriptId;
        expect(transcriptId).toBeTruthy();
    });

    test('set prompt', async () => {
        const res = await request(app)
            .post('/api/setPrompt')
            .send({ transcriptId, prompt: 'Summarize in bullet points for executives' });
        expect(res.status).toBe(201);
        promptId = res.body.promptId;
        expect(promptId).toBeTruthy();
    });

    test('generate summary', async () => {
        const res = await request(app)
            .post('/api/generateSummary')
            .send({ transcriptId, promptId });
        expect(res.status).toBe(201);
        summaryId = res.body.summaryId;
        expect(res.body.raw).toContain('Mocked summary');
    });

    test('save edits', async () => {
        const res = await request(app)
            .put(`/api/summary/${summaryId}`)
            .send({ edited: 'Edited summary text.' });
        expect(res.status).toBe(200);
        expect(res.body.ok).toBe(true);
    });

    test('share summary', async () => {
        const res = await request(app)
            .post('/api/shareSummary')
            .send({ summaryId, recipients: ['a@example.com'] });
        expect(res.status).toBe(200);
        expect(res.body.ok).toBe(true);
    });
});
