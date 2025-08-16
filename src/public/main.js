let state = { transcriptId: null, promptId: null, summaryId: null };

const el = id => document.getElementById(id);

async function uploadFile() {
    const f = el('file').files[0];
    if (!f) return alert('Pick a .txt or .md file');
    const fd = new FormData();
    fd.append('file', f);
    const res = await fetch('/api/uploadTranscript', { method: 'POST', body: fd });
    const data = await res.json();
    if (!res.ok) return alert(data.error || 'Upload failed');
    state.transcriptId = data.transcriptId;
    el('uploadStatus').textContent = `Transcript ID: ${state.transcriptId}`;
    await loadTranscript();
}

async function uploadText() {
    const text = el('rawText').value.trim();
    if (!text) return alert('Paste some text first');
    const res = await fetch('/api/uploadTranscript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
    });
    const data = await res.json();
    if (!res.ok) return alert(data.error || 'Upload failed');
    state.transcriptId = data.transcriptId;
    el('uploadStatus').textContent = `Transcript ID: ${state.transcriptId}`;
    await loadTranscript();
}

async function loadTranscript() {
    if (!state.transcriptId) return;
    const res = await fetch(`/api/transcript/${state.transcriptId}`);
    const data = await res.json();
    if (!res.ok) return alert(data.error || 'Could not fetch transcript');
    el('transcript').value = data.content;
}

async function setPrompt() {
    if (!state.transcriptId) return alert('Upload a transcript first');
    const prompt = el('prompt').value.trim();
    if (!prompt) return alert('Enter a prompt');
    const res = await fetch('/api/setPrompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcriptId: state.transcriptId, prompt })
    });
    const data = await res.json();
    if (!res.ok) return alert(data.error || 'Failed to save prompt');
    state.promptId = data.promptId;
}

async function genSummary() {
    if (!state.transcriptId) return alert('Upload a transcript first');
    const res = await fetch('/api/generateSummary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcriptId: state.transcriptId, promptId: state.promptId })
    });
    const data = await res.json();
    if (!res.ok) return alert(data.error || 'Generation failed');
    state.summaryId = data.summaryId;
    el('summary').value = data.raw;
}

async function saveEdits() {
    if (!state.summaryId) return alert('Generate a summary first');
    const edited = el('summary').value;
    const res = await fetch(`/api/summary/${state.summaryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ edited })
    });
    const data = await res.json();
    if (!res.ok) return alert(data.error || 'Save failed');
    alert('Saved');
}

async function share() {
    if (!state.summaryId) return alert('Generate a summary first');
    const emails = el('emails').value.split(',').map(s => s.trim()).filter(Boolean);
    if (emails.length === 0) return alert('Enter recipient emails');
    const res = await fetch('/api/shareSummary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summaryId: state.summaryId, recipients: emails })
    });
    const data = await res.json();
    if (!res.ok) return alert(data.error || 'Share failed');
    el('shareStatus').textContent = `Sent. Message ID: ${data.messageId}`;
}

window.addEventListener('DOMContentLoaded', () => {
    el('uploadBtn').addEventListener('click', uploadFile);
    el('uploadTextBtn').addEventListener('click', uploadText);
    el('setPrompt').addEventListener('click', setPrompt);
    el('genSummary').addEventListener('click', genSummary);
    el('saveEdits').addEventListener('click', saveEdits);
    el('share').addEventListener('click', share);
});
