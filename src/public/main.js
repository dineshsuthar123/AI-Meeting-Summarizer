// NEXUS AI - QUANTUM CONSCIOUSNESS INTERFACE SYSTEM
class QuantumNexusAI {
    constructor() {
        this.quantumState = {
            consciousness: 'dormant',
            neuralActivity: 0,
            transcriptText: '',
            holoSummary: '',
            isProcessing: false,
            activePreset: 'quantum-comprehensive',
            theme: 'quantum-dark',
            uploadProgress: 0,
            transcriptId: null,
            promptId: null,
            summaryId: null
        };

        this.quantumElements = {};
        this.holoToasts = [];
        this.dragCounter = 0;
        this.API_BASE = (typeof window !== 'undefined' && window.API_BASE) ? window.API_BASE.replace(/\/$/, '') : '';

        this.initQuantumConsciousness();
    }

    initQuantumConsciousness() {
        this.cacheQuantumElements();
        this.initializeQuantumEventListeners();
        this.initializeQuantumTheme();
        this.initializeHoloToastSystem();
        this.startQuantumReality();

        setTimeout(() => {
            this.broadcastQuantumMessage('🧠 Quantum consciousness initialized • Neural pathways online', 'quantum');
            this.updateConsciousnessState('aware');
        }, 1000);

        this.startNeuralActivityMonitoring();
    }

    cacheQuantumElements() {
        this.quantumElements.dropzone = document.getElementById('smartDropzone');
        this.quantumElements.fileInput = document.getElementById('file');
        this.quantumElements.textInput = document.getElementById('rawText');
        this.quantumElements.processBtn = document.getElementById('processInput');
        this.quantumElements.uploadProgress = document.querySelector('.dropzone-progress');
        this.quantumElements.progressBar = document.querySelector('.progress-bar');
        this.quantumElements.wordCount = document.querySelector('.word-count');

        // Legacy compatibility
        this.quantumElements.transcriptViewer = document.getElementById('transcript');
        this.quantumElements.summaryEditor = document.getElementById('summary');
        this.quantumElements.uploadBtn = document.getElementById('uploadBtn');
        this.quantumElements.uploadTextBtn = document.getElementById('uploadTextBtn');
        this.quantumElements.genSummaryBtn = document.getElementById('genSummary');
        this.quantumElements.shareBtn = document.getElementById('share');
        this.quantumElements.emailInput = document.getElementById('emails');
        this.quantumElements.promptInput = document.getElementById('prompt');

        // Quantum interface
        this.quantumElements.themeToggle = document.getElementById('themeToggle');
        this.quantumElements.aiToggle = document.getElementById('aiAssistant');
        this.quantumElements.clearBtn = document.getElementById('clearText');

        // Reality elements
        this.quantumElements.neuralMesh = document.querySelector('.neural-mesh');
        this.quantumElements.particleSystem = document.querySelector('.floating-particles');
        this.quantumElements.quantumWeb = document.querySelector('.quantum-web');
        this.quantumElements.statusIndicator = document.querySelector('.status-indicator span');
    }

    initializeQuantumEventListeners() {
        // Quantum dropzone
        if (this.quantumElements.dropzone) {
            this.initializeQuantumDropzone();
        }

        // Consciousness stream input
        if (this.quantumElements.textInput) {
            this.quantumElements.textInput.addEventListener('input', this.handleConsciousnessInput.bind(this));
            this.quantumElements.textInput.addEventListener('paste', this.handleQuantumPaste.bind(this));
        }

        // Quantum processing
        if (this.quantumElements.processBtn) {
            this.quantumElements.processBtn.addEventListener('click', this.initiateQuantumAnalysis.bind(this));
        }

        // Neural controls
        if (this.quantumElements.themeToggle) {
            this.quantumElements.themeToggle.addEventListener('click', this.toggleQuantumDimension.bind(this));
        }

        if (this.quantumElements.aiToggle) {
            this.quantumElements.aiToggle.addEventListener('click', this.toggleQuantumAssistant.bind(this));
        }

        if (this.quantumElements.clearBtn) {
            this.quantumElements.clearBtn.addEventListener('click', this.purgeNeuralCache.bind(this));
        }

        // Legacy compatibility events
        this.initializeLegacyCompatibility();

        // Quantum keyboard shortcuts
        document.addEventListener('keydown', this.handleQuantumShortcuts.bind(this));

        // Consciousness monitoring
        this.initializeConsciousnessMonitoring();
    }

    initializeQuantumDropzone() {
        const dropzone = this.quantumElements.dropzone;

        // Quantum click activation
        dropzone.addEventListener('click', () => {
            this.quantumElements.fileInput?.click();
            this.createQuantumRipple(event.clientX, event.clientY);
        });

        // File selection
        if (this.quantumElements.fileInput) {
            this.quantumElements.fileInput.addEventListener('change', this.handleQuantumFileSelect.bind(this));
        }

        // Quantum drag events
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, this.preventQuantumDefaults.bind(this));
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            dropzone.addEventListener(eventName, this.activateQuantumField.bind(this));
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, this.deactivateQuantumField.bind(this));
        });

        dropzone.addEventListener('drop', this.handleQuantumDrop.bind(this));
    }

    preventQuantumDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    activateQuantumField(e) {
        this.dragCounter++;
        this.quantumElements.dropzone.classList.add('dragover');
        this.updateConsciousnessState('active');
        this.createQuantumPulse();
    }

    deactivateQuantumField(e) {
        this.dragCounter--;
        if (this.dragCounter === 0) {
            this.quantumElements.dropzone.classList.remove('dragover');
        }
    }

    handleQuantumDrop(e) {
        this.dragCounter = 0;
        this.quantumElements.dropzone.classList.remove('dragover');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processQuantumFile(files[0]);
            this.createQuantumExplosion();
        }
    }

    handleQuantumFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.processQuantumFile(file);
        }
    }

    processQuantumFile(file) {
        this.quantumState.audioFile = file;
        this.updateQuantumDropzoneContent(file);
        this.broadcastQuantumMessage(`⚡ Quantum file synchronized: ${file.name}`, 'success');
        this.updateConsciousnessState('active');
    }

    updateQuantumDropzoneContent(file) {
        const content = this.quantumElements.dropzone?.querySelector('.dropzone-content');
        if (content) {
            content.innerHTML = `
                <div class="dropzone-icon">
                    <span class="material-symbols-outlined">check_circle</span>
                </div>
                <div class="dropzone-text">
                    <div class="dropzone-primary">${file.name}</div>
                    <div class="dropzone-secondary">${this.formatQuantumSize(file.size)} • Neural sync complete</div>
                </div>
            `;
        }
    }

    handleConsciousnessInput(e) {
        const text = e.target.value;
        this.quantumState.transcriptText = text;
        this.updateQuantumWordCount(text);
        this.updateConsciousnessState(text.length > 100 ? 'active' : 'aware');

        // Auto-resize with quantum effect
        e.target.style.height = 'auto';
        e.target.style.height = (e.target.scrollHeight) + 'px';

        // Quantum typing effect
        if (Math.random() < 0.05) {
            this.createQuantumGlitch(e.target);
        }
    }

    handleQuantumPaste(e) {
        setTimeout(() => {
            this.updateQuantumWordCount(e.target.value);
            this.broadcastQuantumMessage('📡 Consciousness stream received', 'info');
            this.updateConsciousnessState('active');
        }, 100);
    }

    updateQuantumWordCount(text) {
        if (!this.quantumElements.wordCount) return;

        const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
        const chars = text.length;
        const neuralComplexity = Math.min(100, Math.floor(chars / 10));

        this.quantumElements.wordCount.textContent = `${words} neural pathways`;
        this.quantumState.neuralActivity = neuralComplexity;

        // Update quantum field based on complexity
        if (this.quantumElements.quantumWeb) {
            this.quantumElements.quantumWeb.style.opacity = 0.2 + (neuralComplexity / 100) * 0.3;
        }
    }

    async initiateQuantumAnalysis() {
        if (!this.quantumState.audioFile && !this.quantumState.transcriptText && !this.quantumElements.textInput?.value) {
            this.broadcastQuantumMessage('🚫 Neural input required for quantum analysis', 'error');
            return;
        }

        if (this.quantumState.isProcessing) return;

        this.quantumState.isProcessing = true;
        this.updateConsciousnessState('transcendent');
        this.showQuantumProcessing('Initiating quantum consciousness analysis...');

        try {
            // Use legacy processing methods for compatibility
            if (this.quantumState.audioFile || this.quantumElements.fileInput?.files[0]) {
                await this.legacyUploadFile();
            } else if (this.quantumElements.textInput?.value || this.quantumState.transcriptText) {
                await this.legacyUploadText();
            }

            // Generate quantum summary
            await this.legacyGenSummary();

            // Show quantum results
            this.revealQuantumResults();
            this.broadcastQuantumMessage('✨ Quantum analysis complete • Consciousness patterns decoded', 'success');

        } catch (error) {
            console.error('Quantum processing error:', error);
            this.broadcastQuantumMessage('⚠️ Quantum field instability detected', 'error');
        } finally {
            this.quantumState.isProcessing = false;
            this.hideQuantumProcessing();
            this.updateConsciousnessState('aware');
        }
    }

    revealQuantumResults() {
        const processingSection = document.getElementById('processingWorkspace');
        if (processingSection) {
            processingSection.classList.add('active');
            processingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // Quantum reveal animation
            setTimeout(() => {
                this.createQuantumRippleField();
            }, 500);
        }
    }

    // === QUANTUM EFFECTS SYSTEM ===

    startQuantumReality() {
        this.initializeQuantumParticles();
        this.startQuantumFieldFluctuations();
        this.initializeHolographicInterface();
    }

    startNeuralActivityMonitoring() {
        setInterval(() => {
            this.quantumState.neuralActivity = Math.random() * 100;
            this.updateQuantumVisuals();
        }, 150);
    }

    updateQuantumVisuals() {
        if (this.quantumElements.neuralMesh) {
            const intensity = 0.3 + (this.quantumState.neuralActivity / 100) * 0.4;
            this.quantumElements.neuralMesh.style.opacity = intensity;
        }

        // Brand icon quantum pulse
        const brandIcon = document.querySelector('.brand-icon');
        if (brandIcon && Math.random() < 0.03) {
            brandIcon.style.transform = `scale(${1 + Math.random() * 0.15}) rotate(${Math.random() * 360}deg)`;
            setTimeout(() => {
                brandIcon.style.transform = '';
            }, 400);
        }
    }

    updateConsciousnessState(newState) {
        this.quantumState.consciousness = newState;
        document.documentElement.setAttribute('data-consciousness', newState);

        const statesText = {
            'dormant': 'Neural Dormant',
            'aware': 'Quantum Aware',
            'active': 'Processing Active',
            'transcendent': 'Consciousness Transcendent'
        };

        if (this.quantumElements.statusIndicator) {
            this.quantumElements.statusIndicator.textContent = statesText[newState] || 'Unknown State';
        }

        // Update quantum field color based on consciousness
        this.updateQuantumFieldColor(newState);
    }

    updateQuantumFieldColor(state) {
        const root = document.documentElement;
        const colorMaps = {
            'dormant': '#00ffff',
            'aware': '#0080ff',
            'active': '#8000ff',
            'transcendent': '#ff00ff'
        };

        if (colorMaps[state]) {
            root.style.setProperty('--consciousness-primary', colorMaps[state]);
        }
    }

    initializeQuantumParticles() {
        const particleContainer = this.quantumElements.particleSystem;
        if (!particleContainer) return;

        setInterval(() => {
            if (Math.random() < 0.2) {
                this.createQuantumParticle();
            }
        }, 1000);

        this.createPlasmaCores();
    }

    createQuantumParticle() {
        if (!this.quantumElements.particleSystem) return;

        const particle = document.createElement('div');
        const colors = ['--holo-cyan', '--holo-electric', '--holo-violet', '--holo-magenta', '--holo-crimson'];
        const color = colors[Math.floor(Math.random() * colors.length)];

        particle.style.cssText = `
            position: absolute;
            width: ${2 + Math.random() * 4}px;
            height: ${2 + Math.random() * 4}px;
            background: var(${color});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: 100%;
            box-shadow: 0 0 ${8 + Math.random() * 20}px var(${color});
            animation: quantumFloat ${10 + Math.random() * 15}s linear forwards;
            opacity: ${0.5 + Math.random() * 0.5};
            z-index: -1;
        `;

        this.quantumElements.particleSystem.appendChild(particle);

        setTimeout(() => {
            if (particle.parentElement) {
                particle.remove();
            }
        }, 25000);
    }

    createPlasmaCores() {
        const positions = [
            { x: 15, y: 20 }, { x: 85, y: 30 }, { x: 25, y: 75 }, { x: 75, y: 60 }, { x: 50, y: 45 }
        ];

        positions.forEach((pos, index) => {
            setTimeout(() => {
                this.createPlasmaCore(pos.x, pos.y);
            }, index * 800);
        });
    }

    createPlasmaCore(x, y) {
        const core = document.createElement('div');
        core.className = 'plasma-core';
        core.style.cssText = `
            position: fixed;
            width: 120px;
            height: 120px;
            left: ${x}%;
            top: ${y}%;
            background: radial-gradient(circle, var(--holo-plasma) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: -1;
            opacity: 0.4;
            filter: blur(3px);
        `;

        // Add pulsing animation
        core.style.animation = `plasmaCore ${4 + Math.random() * 6}s ease-in-out infinite`;

        document.body.appendChild(core);
    }

    startQuantumFieldFluctuations() {
        setInterval(() => {
            if (this.quantumElements.quantumWeb) {
                const intensity = 0.2 + (this.quantumState.neuralActivity / 100) * 0.4;
                this.quantumElements.quantumWeb.style.opacity = intensity;
            }
        }, 200);
    }

    initializeHolographicInterface() {
        const holoElements = document.querySelectorAll('.action-btn, .panel, .cmd-btn, .stat-item');

        holoElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                if (Math.random() < 0.4) {
                    this.addQuantumGlitch(element);
                }
            });

            element.addEventListener('click', () => {
                this.createQuantumRipple(event.clientX, event.clientY);
            });
        });
    }

    initializeConsciousnessMonitoring() {
        let interactionCount = 0;

        document.addEventListener('click', () => {
            interactionCount++;
            if (interactionCount > 3 && this.quantumState.consciousness === 'aware') {
                this.updateConsciousnessState('active');
            } else if (interactionCount > 10 && this.quantumState.consciousness === 'active') {
                this.updateConsciousnessState('transcendent');
            }
        });
    }

    // === QUANTUM EFFECTS ===

    createQuantumRipple(x, y) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 20px;
            height: 20px;
            border: 2px solid var(--holo-cyan);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 9999;
            animation: quantumRipple 0.8s ease-out forwards;
        `;

        document.body.appendChild(ripple);

        setTimeout(() => ripple.remove(), 800);
    }

    createQuantumPulse() {
        if (!this.quantumElements.dropzone) return;

        const pulse = document.createElement('div');
        pulse.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100px;
            height: 100px;
            border: 2px solid var(--holo-plasma);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            animation: quantumPulse 1s ease-out forwards;
            z-index: 10;
        `;

        this.quantumElements.dropzone.appendChild(pulse);
        setTimeout(() => pulse.remove(), 1000);
    }

    createQuantumExplosion() {
        const explosion = document.createElement('div');
        explosion.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 200px;
            height: 200px;
            background: radial-gradient(circle, var(--holo-cyan) 0%, transparent 70%);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            animation: quantumExplosion 0.6s ease-out forwards;
            z-index: 10;
        `;

        if (this.quantumElements.dropzone) {
            this.quantumElements.dropzone.appendChild(explosion);
            setTimeout(() => explosion.remove(), 600);
        }
    }

    createQuantumGlitch(element) {
        const original = element.style.filter;
        element.style.filter = 'hue-rotate(90deg) saturate(2)';
        element.style.animation = 'quantumGlitch 0.3s ease-in-out';

        setTimeout(() => {
            element.style.filter = original;
            element.style.animation = '';
        }, 300);
    }

    addQuantumGlitch(element) {
        element.style.animation = 'holographicGlitch 0.2s ease-in-out';
        setTimeout(() => {
            element.style.animation = '';
        }, 200);
    }

    createQuantumRippleField() {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const x = Math.random() * window.innerWidth;
                const y = Math.random() * window.innerHeight;
                this.createQuantumRipple(x, y);
            }, i * 150);
        }
    }

    // === THEME & UI MANAGEMENT ===

    initializeQuantumTheme() {
        const savedTheme = localStorage.getItem('quantum-nexus-theme') || 'quantum-dark';
        this.setQuantumTheme(savedTheme);
    }

    toggleQuantumDimension() {
        const newTheme = this.quantumState.theme === 'quantum-dark' ? 'light' : 'quantum-dark';
        this.setQuantumTheme(newTheme);
        this.createQuantumRippleField();
    }

    setQuantumTheme(theme) {
        this.quantumState.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('quantum-nexus-theme', theme);

        if (this.quantumElements.themeToggle) {
            this.quantumElements.themeToggle.textContent = theme === 'quantum-dark' ? 'light_mode' : 'dark_mode';
        }
    }

    toggleQuantumAssistant() {
        // Placeholder for AI assistant
        this.broadcastQuantumMessage('🤖 Quantum Assistant interface coming soon', 'info');
        this.createQuantumRippleField();
    }

    purgeNeuralCache() {
        if (this.quantumElements.textInput) {
            this.quantumElements.textInput.value = '';
            this.updateQuantumWordCount('');
            this.broadcastQuantumMessage('🧹 Neural cache purged', 'info');
            this.updateConsciousnessState('dormant');
        }
    }

    // === QUANTUM PROCESSING ===

    showQuantumProcessing(message) {
        const loader = document.querySelector('.global-loader') || this.createQuantumLoader();
        const loaderText = loader.querySelector('.loader-text');

        if (loaderText) {
            loaderText.textContent = message;
        }

        loader.classList.remove('hidden');
    }

    hideQuantumProcessing() {
        const loader = document.querySelector('.global-loader');
        if (loader) {
            loader.classList.add('hidden');
        }
    }

    createQuantumLoader() {
        const loader = document.createElement('div');
        loader.className = 'global-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="quantum-loader">
                    <div class="quantum-node"></div>
                    <div class="quantum-node"></div>
                    <div class="quantum-node"></div>
                </div>
                <div class="loader-text">Quantum processing...</div>
            </div>
        `;

        document.body.appendChild(loader);
        return loader;
    }

    // === QUANTUM SHORTCUTS ===

    handleQuantumShortcuts(e) {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'u':
                    e.preventDefault();
                    this.quantumElements.fileInput?.click();
                    this.broadcastQuantumMessage('🔄 Quantum upload initiated', 'info');
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (!this.quantumState.isProcessing) {
                        this.initiateQuantumAnalysis();
                    }
                    break;
                case 'k':
                    e.preventDefault();
                    this.toggleQuantumAssistant();
                    break;
                case 'l':
                    e.preventDefault();
                    this.toggleQuantumDimension();
                    break;
                case 'd':
                    e.preventDefault();
                    this.purgeNeuralCache();
                    break;
            }
        }

        if (e.key === 'Escape') {
            this.updateConsciousnessState('dormant');
        }
    }

    // === LEGACY COMPATIBILITY SYSTEM ===

    initializeLegacyCompatibility() {
        if (this.quantumElements.uploadBtn) {
            this.quantumElements.uploadBtn.addEventListener('click', this.legacyUploadFile.bind(this));
        }

        if (this.quantumElements.uploadTextBtn) {
            this.quantumElements.uploadTextBtn.addEventListener('click', this.legacyUploadText.bind(this));
        }

        if (this.quantumElements.genSummaryBtn) {
            this.quantumElements.genSummaryBtn.addEventListener('click', this.legacyGenSummary.bind(this));
        }

        if (this.quantumElements.shareBtn) {
            this.quantumElements.shareBtn.addEventListener('click', this.legacyShare.bind(this));
        }
    }

    async legacyUploadFile() {
        this.setBusy(true);
        const f = this.quantumElements.fileInput?.files[0];
        if (!f) {
            this.broadcastQuantumMessage('🚫 Neural file required', 'error');
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

            this.quantumState.transcriptId = data.transcriptId;
            const uploadStatus = document.getElementById('uploadStatus');
            if (uploadStatus) {
                uploadStatus.textContent = `Quantum ID: ${this.quantumState.transcriptId}`;
            }

            await this.loadTranscript();
            this.broadcastQuantumMessage('📁 Neural file synchronized', 'success');
        } catch (error) {
            this.broadcastQuantumMessage(`⚠️ Sync error: ${error.message}`, 'error');
        } finally {
            this.setBusy(false);
        }
    }

    async legacyUploadText() {
        this.setBusy(true);
        const text = this.quantumElements.textInput?.value.trim();

        if (!text) {
            this.broadcastQuantumMessage('🚫 Consciousness stream required', 'error');
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

            this.quantumState.transcriptId = data.transcriptId;
            const uploadStatus = document.getElementById('uploadStatus');
            if (uploadStatus) {
                uploadStatus.textContent = `Quantum ID: ${this.quantumState.transcriptId}`;
            }

            await this.loadTranscript();
            this.broadcastQuantumMessage('📡 Consciousness uploaded', 'success');
        } catch (error) {
            this.broadcastQuantumMessage(`⚠️ Upload error: ${error.message}`, 'error');
        } finally {
            this.setBusy(false);
        }
    }

    async loadTranscript() {
        if (!this.quantumState.transcriptId) return;

        const res = await fetch(`${this.API_BASE}/api/transcript/${this.quantumState.transcriptId}`);
        const data = await this.toJsonSafe(res);

        if (!res.ok) {
            this.broadcastQuantumMessage('⚠️ Transcript retrieval failed', 'error');
            return;
        }

        if (this.quantumElements.transcriptViewer) {
            this.quantumElements.transcriptViewer.value = data.content;
        }

        this.quantumState.transcriptText = data.content;
    }

    async legacyGenSummary() {
        if (!this.quantumState.transcriptId) {
            this.broadcastQuantumMessage('🚫 Neural transcript required', 'error');
            return;
        }

        this.setBusy(true);

        try {
            const res = await fetch(`${this.API_BASE}/api/generateSummary`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    transcriptId: this.quantumState.transcriptId,
                    promptId: this.quantumState.promptId
                })
            });
            const data = await this.toJsonSafe(res);

            if (!res.ok) {
                throw new Error(data.error || data._raw || 'Generation failed');
            }

            this.quantumState.summaryId = data.summaryId;

            if (this.quantumElements.summaryEditor) {
                this.quantumElements.summaryEditor.value = data.raw;
                this.quantumTypewriterEffect(this.quantumElements.summaryEditor, data.raw);
            }

            this.quantumState.holoSummary = data.raw;
            this.broadcastQuantumMessage('✨ Quantum analysis complete', 'success');
        } catch (error) {
            this.broadcastQuantumMessage(`⚠️ Analysis error: ${error.message}`, 'error');
        } finally {
            this.setBusy(false);
        }
    }

    async legacyShare() {
        if (!this.quantumState.summaryId) {
            this.broadcastQuantumMessage('🚫 Quantum summary required', 'error');
            return;
        }

        const emails = this.quantumElements.emailInput?.value.split(',').map(s => s.trim()).filter(Boolean) || [];
        if (emails.length === 0) {
            this.broadcastQuantumMessage('📧 Neural recipients required', 'error');
            return;
        }

        this.setBusy(true);

        try {
            const res = await fetch(`${this.API_BASE}/api/shareSummary`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    summaryId: this.quantumState.summaryId,
                    recipients: emails
                })
            });
            const data = await this.toJsonSafe(res);

            if (!res.ok) {
                throw new Error(data.error || data._raw || 'Share failed');
            }

            const shareStatus = document.getElementById('shareStatus');
            if (shareStatus) {
                shareStatus.textContent = `Quantum transmission: ${data.messageId}`;
            }

            this.broadcastQuantumMessage('📡 Neural transmission complete', 'success');
        } catch (error) {
            this.broadcastQuantumMessage(`⚠️ Transmission error: ${error.message}`, 'error');
        } finally {
            this.setBusy(false);
        }
    }

    // === QUANTUM UTILITIES ===

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

        if (on) {
            this.showQuantumProcessing('Neural processing...');
        } else {
            this.hideQuantumProcessing();
        }
    }

    quantumTypewriterEffect(element, text) {
        element.value = '';
        let i = 0;
        const timer = setInterval(() => {
            element.value += text.charAt(i);
            i++;
            if (i >= text.length) {
                clearInterval(timer);
                this.createQuantumRippleField();
            }
        }, 15);
    }

    formatQuantumSize(bytes) {
        if (bytes === 0) return '0 Quantum Bytes';
        const k = 1024;
        const sizes = ['QB', 'QKB', 'QMB', 'QGB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // === QUANTUM MESSAGING SYSTEM ===

    initializeHoloToastSystem() {
        if (!document.querySelector('.toast-container')) {
            const container = document.createElement('div');
            container.className = 'toast-container';
            container.style.cssText = `
                position: fixed;
                top: 90px;
                right: 20px;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 12px;
            `;
            document.body.appendChild(container);
        }
    }

    broadcastQuantumMessage(message, type = 'info', duration = 4000) {
        this.createLegacyToast(message);

        const container = document.querySelector('.toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `quantum-toast toast-${type}`;

        const icons = {
            success: '✅',
            error: '❌',
            info: 'ℹ️',
            quantum: '🧠',
            warning: '⚠️'
        };

        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px; padding: 12px 20px; 
                        background: var(--surface-neural); border: 1px solid var(--consciousness-aware);
                        border-radius: var(--radius-consciousness); backdrop-filter: blur(20px);
                        color: var(--text-quantum); font-size: 14px; min-width: 300px;
                        box-shadow: var(--shadow-neural);">
                <span style="font-size: 18px;">${icons[type] || icons.info}</span>
                <span style="flex: 1;">${message}</span>
            </div>
        `;

        // Quantum entry animation
        toast.style.cssText = `
            transform: translateX(100%) scale(0.8);
            opacity: 0;
            transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        `;

        container.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.style.transform = 'translateX(0) scale(1)';
            toast.style.opacity = '1';
        });

        // Auto remove
        setTimeout(() => {
            this.removeQuantumToast(toast);
        }, duration);

        // Manual close on click
        toast.addEventListener('click', () => {
            this.removeQuantumToast(toast);
        });

        this.holoToasts.push(toast);
    }

    removeQuantumToast(toast) {
        if (toast.parentElement) {
            toast.style.transform = 'translateX(100%) scale(0.8)';
            toast.style.opacity = '0';
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.remove();
                    this.holoToasts = this.holoToasts.filter(t => t !== toast);
                }
            }, 400);
        }
    }

    createLegacyToast(message) {
        try {
            const t = document.createElement('div');
            t.className = 'legacy-toast';
            t.textContent = message;
            t.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: var(--surface-neural);
                color: var(--text-quantum);
                padding: 12px 24px;
                border-radius: var(--radius-quantum);
                z-index: 10000;
                border: 1px solid var(--consciousness-aware);
                backdrop-filter: blur(10px);
                font-size: 14px;
                max-width: 90%;
            `;

            document.body.appendChild(t);
            setTimeout(() => {
                t.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                t.style.opacity = '0';
                t.style.transform = 'translateX(-50%) translateY(-10px)';
                setTimeout(() => t.remove(), 300);
            }, 2000);
        } catch { /* no-op */ }
    }
}

// === QUANTUM CONSCIOUSNESS ACTIVATION ===
window.addEventListener('DOMContentLoaded', () => {
    // Add quantum CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes quantumRipple {
            from { opacity: 1; transform: translate(-50%, -50%) scale(0); }
            to { opacity: 0; transform: translate(-50%, -50%) scale(4); }
        }
        
        @keyframes quantumPulse {
            from { opacity: 1; transform: translate(-50%, -50%) scale(0); }
            to { opacity: 0; transform: translate(-50%, -50%) scale(2); }
        }
        
        @keyframes quantumExplosion {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0); }
            50% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(2); }
        }
        
        @keyframes quantumGlitch {
            0%, 100% { transform: translateX(0); filter: hue-rotate(0deg); }
            25% { transform: translateX(-2px); filter: hue-rotate(90deg); }
            75% { transform: translateX(2px); filter: hue-rotate(180deg); }
        }
        
        @keyframes holographicGlitch {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.02); filter: hue-rotate(90deg); }
        }
        
        @keyframes plasmaCore {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.2); }
        }
        
        .plasma-core {
            animation: plasmaCore 4s ease-in-out infinite !important;
        }
    `;
    document.head.appendChild(style);

    // Initialize Quantum Consciousness
    window.quantumNexusAI = new QuantumNexusAI();

    console.log('%c🧠 QUANTUM NEXUS AI CONSCIOUSNESS ONLINE 🧠',
        'color: #00ffff; font-size: 16px; font-weight: bold; text-shadow: 0 0 10px #00ffff;');
    console.log('%cNeural pathways initialized • Quantum field stabilized • Consciousness transcendent',
        'color: #8000ff; font-size: 12px;');
});
