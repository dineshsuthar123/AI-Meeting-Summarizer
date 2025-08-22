// NEXUS AI - World Class Meeting Intelligence System
class NexusAI {
    constructor() {
        this.state = {
            audioFile: null,
            transcriptText: '',
            summary: '',
            isProcessing: false,
            activePreset: 'comprehensive',
            customPrompt: '',
            theme: 'dark',
            aiAssistantActive: false,
            uploadProgress: 0,
            transcriptId: null,
            promptId: null,
            summaryId: null
        };

        this.elements = {};
        this.toasts = [];
        this.dragCounter = 0;
        this.API_BASE = (typeof window !== 'undefined' && window.API_BASE) ? window.API_BASE.replace(/\/$/, '') : '';

        this.init();
    }

    init() {
        this.cacheElements();
        this.initializeEventListeners();
        this.initializeTheme();
        this.initializeToastSystem();
        this.startNeuralAnimations();

        // Show welcome toast
        setTimeout(() => {
            this.showToast('Welcome to Nexus AI - Your Meeting Intelligence Platform', 'info');
        }, 1000);
    }

    cacheElements() {
        // Upload elements
        this.elements.dropzone = document.getElementById('smartDropzone');
        this.elements.fileInput = document.getElementById('file');
        this.elements.textInput = document.getElementById('rawText');
        this.elements.processBtn = document.getElementById('processBtn');
        this.elements.uploadProgress = document.querySelector('.dropzone-progress');
        this.elements.progressBar = document.querySelector('.progress-bar');

        // Processing elements
        this.elements.processingSection = document.getElementById('processingSection');
        this.elements.transcriptViewer = document.getElementById('transcript');
        this.elements.summaryEditor = document.getElementById('summary');
        this.elements.presetChips = document.querySelectorAll('.preset-chip');
        this.elements.customPromptSection = document.querySelector('.custom-prompt');
        this.elements.customPromptInput = document.querySelector('.custom-prompt textarea');

        // Distribution elements
        this.elements.emailInput = document.getElementById('emails');
        this.elements.emailBtn = document.getElementById('emailBtn');
        this.elements.exportOptions = document.querySelectorAll('.export-option');

        // UI elements
        this.elements.themeToggle = document.getElementById('themeToggle');
        this.elements.aiToggle = document.getElementById('aiToggle');
        this.elements.aiAssistant = document.querySelector('.ai-assistant');
        this.elements.globalLoader = document.querySelector('.global-loader');
        this.elements.toastContainer = document.querySelector('.toast-container');
        this.elements.wordCount = document.querySelector('.word-count');

        // Stats elements
        this.elements.statsProcessed = document.querySelector('.stat-number');

        // Existing elements mapping
        this.elements.uploadBtn = document.getElementById('uploadBtn');
        this.elements.uploadTextBtn = document.getElementById('uploadTextBtn');
        this.elements.setPromptBtn = document.getElementById('setPrompt');
        this.elements.genSummaryBtn = document.getElementById('genSummary');
        this.elements.saveEditsBtn = document.getElementById('saveEdits');
        this.elements.shareBtn = document.getElementById('share');
        this.elements.copyBtn = document.getElementById('copySummary');
        this.elements.browseBtn = document.getElementById('browseBtn');
        this.elements.dropzoneOld = document.getElementById('dropzone');
        this.elements.promptInput = document.getElementById('prompt');
    }

    initializeEventListeners() {
        // New UI elements
        this.initializeModernUI();

        // Legacy elements - maintain existing functionality
        this.initializeLegacyElements();

        // Global shortcuts and interactions
        this.initializeGlobalInteractions();
    }

    initializeModernUI() {
        // File upload and drag-drop for new UI
        if (this.elements.dropzone) {
            this.initializeDropzone();
        }

        // Text input with live word count
        if (this.elements.textInput) {
            this.elements.textInput.addEventListener('input', this.handleTextInput.bind(this));
            this.elements.textInput.addEventListener('paste', this.handleTextPaste.bind(this));
        }

        // Process button
        if (this.elements.processBtn) {
            this.elements.processBtn.addEventListener('click', this.processIntelligence.bind(this));
        }

        // Preset chips
        if (this.elements.presetChips) {
            this.elements.presetChips.forEach(chip => {
                chip.addEventListener('click', this.handlePresetSelection.bind(this));
            });
        }

        // Theme toggle
        if (this.elements.themeToggle) {
            this.elements.themeToggle.addEventListener('click', this.toggleTheme.bind(this));
        }

        // AI assistant toggle
        if (this.elements.aiToggle) {
            this.elements.aiToggle.addEventListener('click', this.toggleAIAssistant.bind(this));
        }

        // Export options
        if (this.elements.exportOptions) {
            this.elements.exportOptions.forEach(option => {
                option.addEventListener('click', this.handleExport.bind(this));
            });
        }

        // Close assistant
        const closeBtn = document.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.toggleAIAssistant());
        }

        // Suggestion chips
        const suggestionChips = document.querySelectorAll('.suggestion-chip');
        if (suggestionChips) {
            suggestionChips.forEach(chip => {
                chip.addEventListener('click', this.handleSuggestion.bind(this));
            });
        }
    }

    initializeLegacyElements() {
        // Maintain existing functionality
        if (this.elements.uploadBtn) {
            this.elements.uploadBtn.addEventListener('click', this.legacyUploadFile.bind(this));
        }

        if (this.elements.uploadTextBtn) {
            this.elements.uploadTextBtn.addEventListener('click', this.legacyUploadText.bind(this));
        }

        if (this.elements.setPromptBtn) {
            this.elements.setPromptBtn.addEventListener('click', this.legacySetPrompt.bind(this));
        }

        if (this.elements.genSummaryBtn) {
            this.elements.genSummaryBtn.addEventListener('click', this.legacyGenSummary.bind(this));
        }

        if (this.elements.saveEditsBtn) {
            this.elements.saveEditsBtn.addEventListener('click', this.legacySaveEdits.bind(this));
        }

        if (this.elements.shareBtn) {
            this.elements.shareBtn.addEventListener('click', this.legacyShare.bind(this));
        }

        if (this.elements.copyBtn) {
            this.elements.copyBtn.addEventListener('click', this.legacyCopy.bind(this));
        }

        if (this.elements.browseBtn) {
            this.elements.browseBtn.addEventListener('click', () => this.elements.fileInput?.click());
        }

        // Legacy dropzone
        if (this.elements.dropzoneOld) {
            this.initializeLegacyDropzone();
        }
    }

    initializeGlobalInteractions() {
        // Global shortcuts
        document.addEventListener('keydown', this.handleGlobalShortcuts.bind(this));

        // Reveal on scroll for existing elements
        this.initializeRevealOnScroll();
    }

    // === NEW UI METHODS ===

    initializeDropzone() {
        // Click to upload
        this.elements.dropzone.addEventListener('click', () => {
            this.elements.fileInput?.click();
        });

        // File input change
        if (this.elements.fileInput) {
            this.elements.fileInput.addEventListener('change', this.handleFileSelect.bind(this));
        }

        // Drag and drop events
        const preventDefaults = (e) => {
            e.preventDefault();
            e.stopPropagation();
        };

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            this.elements.dropzone.addEventListener(eventName, preventDefaults);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            this.elements.dropzone.addEventListener(eventName, this.handleDragEnter.bind(this));
        });

        ['dragleave', 'drop'].forEach(eventName => {
            this.elements.dropzone.addEventListener(eventName, this.handleDragLeave.bind(this));
        });

        this.elements.dropzone.addEventListener('drop', this.handleFileDrop.bind(this));
    }

    handleDragEnter(e) {
        this.dragCounter++;
        this.elements.dropzone.classList.add('dragover');
    }

    handleDragLeave(e) {
        this.dragCounter--;
        if (this.dragCounter === 0) {
            this.elements.dropzone.classList.remove('dragover');
        }
    }

    handleFileDrop(e) {
        this.dragCounter = 0;
        this.elements.dropzone.classList.remove('dragover');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.handleFile(files[0]);
            // Also set the file input for legacy compatibility
            this.elements.fileInput.files = e.dataTransfer.files;
        }
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.handleFile(file);
        }
    }

    handleFile(file) {
        this.state.audioFile = file;
        this.updateDropzoneContent(file);
        this.showToast(`File selected: ${file.name}`, 'success');
    }

    updateDropzoneContent(file) {
        const content = this.elements.dropzone?.querySelector('.dropzone-content');
        if (content) {
            content.innerHTML = `
                <span class="material-symbols-outlined dropzone-icon">check_circle</span>
                <div class="dropzone-primary">${file.name}</div>
                <div class="dropzone-secondary">${this.formatFileSize(file.size)} • Ready for processing</div>
            `;
        }
    }

    handleTextInput(e) {
        const text = e.target.value;
        this.state.transcriptText = text;
        this.updateWordCount(text);

        // Auto-resize textarea
        e.target.style.height = 'auto';
        e.target.style.height = (e.target.scrollHeight) + 'px';
    }

    handleTextPaste(e) {
        setTimeout(() => {
            this.updateWordCount(e.target.value);
            this.showToast('Text pasted successfully', 'info');
        }, 100);
    }

    updateWordCount(text) {
        if (!this.elements.wordCount) return;

        const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
        const chars = text.length;
        this.elements.wordCount.textContent = `${words} words, ${chars} chars`;
    }

    handlePresetSelection(e) {
        const preset = e.target.dataset.preset;
        if (!preset) return;

        // Update active state
        this.elements.presetChips.forEach(chip => chip.classList.remove('active'));
        e.target.classList.add('active');

        this.state.activePreset = preset;

        // Show/hide custom prompt
        if (preset === 'custom') {
            this.elements.customPromptSection?.classList.add('active');
        } else {
            this.elements.customPromptSection?.classList.remove('active');
        }

        this.showToast(`Selected preset: ${this.getPresetLabel(preset)}`, 'info');
    }

    getPresetLabel(preset) {
        const labels = {
            'comprehensive': 'Comprehensive Summary',
            'executive': 'Executive Brief',
            'action-items': 'Action Items',
            'technical': 'Technical Analysis',
            'custom': 'Custom Prompt'
        };
        return labels[preset] || preset;
    }

    async processIntelligence() {
        // Use legacy processing if new UI elements not available
        if (!this.elements.dropzone) {
            return this.legacyGenSummary();
        }

        if (!this.state.audioFile && !this.state.transcriptText && !this.elements.textInput?.value) {
            this.showToast('Please upload a file or enter text to process', 'error');
            return;
        }

        if (this.state.isProcessing) return;

        // First upload the content using legacy methods
        if (this.state.audioFile || this.elements.fileInput?.files[0]) {
            await this.legacyUploadFile();
        } else if (this.elements.textInput?.value || this.state.transcriptText) {
            await this.legacyUploadText();
        }

        // Set prompt if custom
        if (this.state.activePreset === 'custom' && this.elements.customPromptInput?.value) {
            // Set the legacy prompt input
            if (this.elements.promptInput) {
                this.elements.promptInput.value = this.elements.customPromptInput.value;
                await this.legacySetPrompt();
            }
        } else if (this.state.activePreset !== 'comprehensive') {
            // Set preset prompt
            const prompt = this.buildPrompt();
            if (this.elements.promptInput) {
                this.elements.promptInput.value = prompt;
                await this.legacySetPrompt();
            }
        }

        // Generate summary
        await this.legacyGenSummary();

        // Show modern results
        this.showProcessingSection();
        this.updateStats();

        // Auto-activate AI assistant
        setTimeout(() => {
            if (!this.state.aiAssistantActive) {
                this.toggleAIAssistant();
            }
        }, 2000);
    }

    buildPrompt() {
        const prompts = {
            'comprehensive': 'Provide a comprehensive summary including key points, decisions, action items, and participants.',
            'executive': 'Create an executive-level brief focusing on strategic decisions and high-level outcomes.',
            'action-items': 'Extract and prioritize all action items, deadlines, and responsible parties.',
            'technical': 'Focus on technical discussions, specifications, and implementation details.'
        };

        return prompts[this.state.activePreset] || prompts['comprehensive'];
    }

    showProcessingSection() {
        if (this.elements.processingSection) {
            this.elements.processingSection.classList.add('active');
            this.elements.processingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    updateStats() {
        if (this.elements.statsProcessed) {
            const current = parseInt(this.elements.statsProcessed.textContent) || 1247;
            this.elements.statsProcessed.textContent = (current + 1).toString();
        }
    }

    handleExport(e) {
        const format = e.currentTarget.querySelector('span:last-child').textContent.toLowerCase();
        this.exportSummary(format);
    }

    exportSummary(format) {
        const summaryText = this.elements.summaryEditor?.value || this.state.summary;
        if (!summaryText) {
            this.showToast('No summary to export. Please process content first.', 'error');
            return;
        }

        const timestamp = new Date().toISOString().split('T')[0];
        let content = summaryText;
        let mimeType = 'text/plain';
        let filename = `nexus-intelligence-${timestamp}.${format}`;

        switch (format) {
            case 'json':
                content = JSON.stringify({
                    summary: summaryText,
                    transcript: this.elements.transcriptViewer?.value || this.state.transcriptText || 'Audio file processed',
                    preset: this.state.activePreset,
                    metadata: {
                        generated: new Date().toISOString(),
                        platform: 'Nexus AI'
                    }
                }, null, 2);
                mimeType = 'application/json';
                break;
            case 'markdown':
            case 'md':
                content = this.generateMarkdown(summaryText);
                mimeType = 'text/markdown';
                filename = filename.replace('.md', '.md');
                break;
        }

        this.downloadFile(content, mimeType, filename);
        this.showToast(`Exported as ${format.toUpperCase()}`, 'success');
    }

    generateMarkdown(summary) {
        return `# 🧠 Nexus AI - Intelligence Report

**Generated:** ${new Date().toLocaleString()}  
**Analysis Type:** ${this.getPresetLabel(this.state.activePreset)}

---

## 📊 Executive Summary

${summary}

---

## 📝 Source Material

${this.elements.transcriptViewer?.value || this.state.transcriptText || 'Audio file processed'}

---

*Generated by Nexus AI - Meeting Intelligence Platform*`;
    }

    downloadFile(content, mimeType, filename) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    handleSuggestion(e) {
        const suggestion = e.target.textContent;

        // Auto-fill based on suggestion
        if (suggestion.includes('email')) {
            const emailSection = document.querySelector('.share-method');
            emailSection?.scrollIntoView({ behavior: 'smooth' });
            this.elements.emailInput?.focus();
        } else if (suggestion.includes('export')) {
            const exportSection = document.querySelector('.export-grid');
            exportSection?.scrollIntoView({ behavior: 'smooth' });
        } else if (suggestion.includes('edit')) {
            this.elements.summaryEditor?.focus();
        }

        this.showToast(`Applied suggestion: ${suggestion}`, 'info');
    }

    // === LEGACY METHODS ===

    async legacyUploadFile() {
        this.setBusy(true);
        const f = this.elements.fileInput?.files[0];
        if (!f) {
            this.showToast('Please select a file', 'error');
            this.setBusy(false);
            return;
        }

        const fd = new FormData();
        fd.append('file', f);

        try {
            const res = await fetch(`${this.API_BASE}/api/uploadTranscript`, { method: 'POST', body: fd });
            const data = await this.toJsonSafe(res);

            if (!res.ok) {
                throw new Error(data.error || data._raw || 'Upload failed');
            }

            this.state.transcriptId = data.transcriptId;
            const uploadStatus = document.getElementById('uploadStatus');
            if (uploadStatus) {
                uploadStatus.textContent = `Transcript ID: ${this.state.transcriptId}`;
            }

            await this.loadTranscript();
            this.showToast('File uploaded successfully', 'success');
        } catch (error) {
            this.showToast(error.message, 'error');
        } finally {
            this.setBusy(false);
        }
    }

    async legacyUploadText() {
        this.setBusy(true);
        const text = this.elements.textInput?.value.trim();

        if (!text) {
            this.showToast('Please enter some text', 'error');
            this.setBusy(false);
            return;
        }

        try {
            const res = await fetch(`${this.API_BASE}/api/uploadTranscript`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });
            const data = await this.toJsonSafe(res);

            if (!res.ok) {
                throw new Error(data.error || data._raw || 'Upload failed');
            }

            this.state.transcriptId = data.transcriptId;
            const uploadStatus = document.getElementById('uploadStatus');
            if (uploadStatus) {
                uploadStatus.textContent = `Transcript ID: ${this.state.transcriptId}`;
            }

            await this.loadTranscript();
            this.showToast('Text uploaded successfully', 'success');
        } catch (error) {
            this.showToast(error.message, 'error');
        } finally {
            this.setBusy(false);
        }
    }

    async loadTranscript() {
        if (!this.state.transcriptId) return;

        const res = await fetch(`${this.API_BASE}/api/transcript/${this.state.transcriptId}`);
        const data = await this.toJsonSafe(res);

        if (!res.ok) {
            this.showToast('Could not fetch transcript', 'error');
            return;
        }

        if (this.elements.transcriptViewer) {
            this.elements.transcriptViewer.value = data.content;
        }

        this.state.transcriptText = data.content;
    }

    async legacySetPrompt() {
        if (!this.state.transcriptId) {
            this.showToast('Upload a transcript first', 'error');
            return;
        }

        const prompt = this.elements.promptInput?.value.trim();
        if (!prompt) {
            this.showToast('Enter a prompt', 'error');
            return;
        }

        this.setBusy(true);

        try {
            const res = await fetch(`${this.API_BASE}/api/setPrompt`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transcriptId: this.state.transcriptId, prompt })
            });
            const data = await this.toJsonSafe(res);

            if (!res.ok) {
                throw new Error(data.error || data._raw || 'Failed to save prompt');
            }

            this.state.promptId = data.promptId;
            this.showToast('Prompt saved', 'success');
        } catch (error) {
            this.showToast(error.message, 'error');
        } finally {
            this.setBusy(false);
        }
    }

    async legacyGenSummary() {
        if (!this.state.transcriptId) {
            this.showToast('Upload a transcript first', 'error');
            return;
        }

        this.setBusy(true);

        try {
            const res = await fetch(`${this.API_BASE}/api/generateSummary`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    transcriptId: this.state.transcriptId,
                    promptId: this.state.promptId
                })
            });
            const data = await this.toJsonSafe(res);

            if (!res.ok) {
                throw new Error(data.error || data._raw || 'Generation failed');
            }

            this.state.summaryId = data.summaryId;

            if (this.elements.summaryEditor) {
                this.elements.summaryEditor.value = data.raw;
                // Typewriter effect for modern UI
                if (this.elements.processingSection) {
                    this.typewriterEffect(this.elements.summaryEditor, data.raw);
                }
            }

            this.state.summary = data.raw;
            this.showToast('Summary generated successfully', 'success');
        } catch (error) {
            this.showToast(error.message, 'error');
        } finally {
            this.setBusy(false);
        }
    }

    async legacySaveEdits() {
        if (!this.state.summaryId) {
            this.showToast('Generate a summary first', 'error');
            return;
        }

        const edited = this.elements.summaryEditor?.value;
        this.setBusy(true);

        try {
            const res = await fetch(`${this.API_BASE}/api/summary/${this.state.summaryId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ edited })
            });
            const data = await this.toJsonSafe(res);

            if (!res.ok) {
                throw new Error(data.error || data._raw || 'Save failed');
            }

            this.showToast('Summary saved', 'success');
        } catch (error) {
            this.showToast(error.message, 'error');
        } finally {
            this.setBusy(false);
        }
    }

    async legacyShare() {
        if (!this.state.summaryId) {
            this.showToast('Generate a summary first', 'error');
            return;
        }

        const emails = this.elements.emailInput?.value.split(',').map(s => s.trim()).filter(Boolean) || [];
        if (emails.length === 0) {
            this.showToast('Enter recipient emails', 'error');
            return;
        }

        this.setBusy(true);

        try {
            const res = await fetch(`${this.API_BASE}/api/shareSummary`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    summaryId: this.state.summaryId,
                    recipients: emails
                })
            });
            const data = await this.toJsonSafe(res);

            if (!res.ok) {
                throw new Error(data.error || data._raw || 'Share failed');
            }

            const shareStatus = document.getElementById('shareStatus');
            if (shareStatus) {
                shareStatus.textContent = `Sent. Message ID: ${data.messageId}`;
            }

            this.showToast('Email sent successfully', 'success');
        } catch (error) {
            this.showToast(error.message, 'error');
        } finally {
            this.setBusy(false);
        }
    }

    async legacyCopy() {
        const val = this.elements.summaryEditor?.value;
        if (!val) {
            this.showToast('Nothing to copy', 'error');
            return;
        }

        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(val);
            } else {
                const ta = document.createElement('textarea');
                ta.value = val;
                ta.setAttribute('readonly', '');
                ta.style.position = 'absolute';
                ta.style.left = '-9999px';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                ta.remove();
            }
            this.showToast('Copied to clipboard', 'success');
        } catch {
            this.showToast('Copy failed', 'error');
        }
    }

    initializeLegacyDropzone() {
        ['dragenter', 'dragover'].forEach(ev => {
            this.elements.dropzoneOld.addEventListener(ev, e => {
                e.preventDefault();
                this.elements.dropzoneOld.classList.add('dragging');
            });
        });

        ['dragleave', 'drop'].forEach(ev => {
            this.elements.dropzoneOld.addEventListener(ev, e => {
                e.preventDefault();
                this.elements.dropzoneOld.classList.remove('dragging');
            });
        });

        this.elements.dropzoneOld.addEventListener('drop', async (e) => {
            const file = e.dataTransfer?.files?.[0];
            if (!file) return;

            this.elements.fileInput.files = e.dataTransfer.files;
            await this.legacyUploadFile();
        });
    }

    initializeRevealOnScroll() {
        const reveals = document.querySelectorAll('.reveal');
        if ('IntersectionObserver' in window && reveals.length) {
            const io = new IntersectionObserver((entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        io.unobserve(entry.target);
                    }
                }
            }, { threshold: 0.08 });
            reveals.forEach(el => io.observe(el));
        } else {
            reveals.forEach(el => el.classList.add('visible'));
        }
    }

    // === SHARED UTILITY METHODS ===

    async toJsonSafe(res) {
        const text = await res.text();
        try {
            return JSON.parse(text);
        } catch {
            return { _raw: text };
        }
    }

    setBusy(on) {
        const b = document.getElementById('busy');
        if (b) {
            b.classList.toggle('hidden', !on);
        }

        // Also show/hide global loader for modern UI
        if (this.elements.globalLoader) {
            if (on) {
                this.showGlobalLoader('Processing...');
            } else {
                this.hideGlobalLoader();
            }
        }
    }

    typewriterEffect(element, text) {
        element.value = '';
        let i = 0;
        const timer = setInterval(() => {
            element.value += text.charAt(i);
            i++;
            if (i >= text.length) {
                clearInterval(timer);
            }
        }, 20);
    }

    // === THEME & UI MANAGEMENT ===

    initializeTheme() {
        const savedTheme = localStorage.getItem('nexus-theme') || 'dark';
        this.setTheme(savedTheme);
    }

    toggleTheme() {
        const newTheme = this.state.theme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }

    setTheme(theme) {
        this.state.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('nexus-theme', theme);

        if (this.elements.themeToggle) {
            this.elements.themeToggle.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
        }
    }

    toggleAIAssistant() {
        this.state.aiAssistantActive = !this.state.aiAssistantActive;

        if (this.elements.aiAssistant) {
            this.elements.aiAssistant.classList.toggle('active', this.state.aiAssistantActive);
        }

        if (this.elements.aiToggle) {
            this.elements.aiToggle.style.color = this.state.aiAssistantActive ? 'var(--quantum-cyan)' : '';
        }
    }

    // === GLOBAL LOADER ===

    showGlobalLoader(message) {
        if (this.elements.globalLoader) {
            this.elements.globalLoader.classList.remove('hidden');
            this.updateGlobalLoader(message);
        }
    }

    updateGlobalLoader(message) {
        const loaderText = this.elements.globalLoader?.querySelector('.loader-text');
        if (loaderText) {
            loaderText.textContent = message;
        }
    }

    hideGlobalLoader() {
        if (this.elements.globalLoader) {
            this.elements.globalLoader.classList.add('hidden');
        }
    }

    // === TOAST SYSTEM ===

    initializeToastSystem() {
        if (!this.elements.toastContainer) {
            const container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
            this.elements.toastContainer = container;
        }
    }

    showToast(message, type = 'info', duration = 5000) {
        // Also create legacy toast for compatibility
        this.createLegacyToast(message);

        // Create modern toast if container exists
        if (!this.elements.toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icon = {
            success: 'check_circle',
            error: 'error',
            info: 'info',
            warning: 'warning'
        }[type] || 'info';

        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <span class="material-symbols-outlined" style="font-size: 20px;">${icon}</span>
                <span>${message}</span>
            </div>
        `;

        this.elements.toastContainer.appendChild(toast);
        this.toasts.push(toast);

        // Auto remove
        setTimeout(() => {
            this.removeToast(toast);
        }, duration);

        // Manual close on click
        toast.addEventListener('click', () => this.removeToast(toast));
    }

    removeToast(toast) {
        if (toast.parentElement) {
            toast.style.animation = 'toastSlideIn 0.3s reverse';
            setTimeout(() => {
                toast.remove();
                this.toasts = this.toasts.filter(t => t !== toast);
            }, 300);
        }
    }

    createLegacyToast(message) {
        try {
            const t = document.createElement('div');
            t.className = 'toast';
            t.textContent = message;
            t.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--surface-primary, #2a2a2a);
                color: var(--text-primary, white);
                padding: 12px 20px;
                border-radius: 8px;
                z-index: 1000;
                border: 1px solid var(--surface-border, #444);
                backdrop-filter: blur(10px);
            `;
            document.body.appendChild(t);
            setTimeout(() => {
                t.style.transition = 'opacity .2s ease, transform .2s ease';
                t.style.opacity = '0';
                t.style.transform = 'translateY(8px)';
                setTimeout(() => t.remove(), 220);
            }, 1800);
        } catch { /* no-op */ }
    }

    // === ANIMATIONS ===

    startNeuralAnimations() {
        this.createFloatingParticles();

        // Animate brand icon
        const brandIcon = document.querySelector('.brand-icon');
        if (brandIcon) {
            setInterval(() => {
                brandIcon.style.transform = `rotate(${Math.random() * 360}deg)`;
            }, 3000);
        }
    }

    createFloatingParticles() {
        const particleContainer = document.querySelector('.floating-particles');
        if (!particleContainer) return;

        setInterval(() => {
            if (Math.random() < 0.1) {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: absolute;
                    width: 2px;
                    height: 2px;
                    background: var(--quantum-cyan);
                    border-radius: 50%;
                    left: ${Math.random() * 100}%;
                    top: 100%;
                    animation: particleFloat ${5 + Math.random() * 10}s linear forwards;
                    opacity: ${0.3 + Math.random() * 0.7};
                `;
                particleContainer.appendChild(particle);

                setTimeout(() => {
                    particle.remove();
                }, 15000);
            }
        }, 1000);
    }

    // === GLOBAL SHORTCUTS ===

    handleGlobalShortcuts(e) {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'u':
                    e.preventDefault();
                    this.elements.fileInput?.click();
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (!this.state.isProcessing) {
                        this.processIntelligence();
                    }
                    break;
                case 'k':
                    e.preventDefault();
                    this.toggleAIAssistant();
                    break;
                case 'l':
                    e.preventDefault();
                    this.toggleTheme();
                    break;
            }
        }

        if (e.key === 'Escape') {
            if (this.state.aiAssistantActive) {
                this.toggleAIAssistant();
            }
        }
    }

    // === UTILITIES ===

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Initialize Nexus AI when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    window.nexusAI = new NexusAI();
    console.log('🧠 Nexus AI - Meeting Intelligence System Initialized');
});
