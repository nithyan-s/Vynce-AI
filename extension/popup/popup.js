/**
 * VynceAI Extension - Popup Script
 * Handles user interactions and communication with background service worker
 * Now includes memory management for context-aware conversations
 */

import { formatResponse, sanitizeInput, getCurrentTimestamp } from '../utils/helpers.js';

// DOM Elements - will be initialized after DOM loads
let chatContainer;
let userInput;
let sendBtn;
let voiceBtn;
let voiceIndicator;
let voiceStatusText;
let clearBtn;
let memoryBtn;
let settingsBtn;
let modelSelect;
let statusText;
let statusDot;

// Quick action buttons
let summarizeBtn;
let analyzeBtn;

// Q&A elements
let qaInput;
let qaBtn;
let qaResult;

// Agent Mode elements and state
let agentMode;
let agentVoiceBtn;
let exitAgentBtn;
let agentStatusText;
let agentStatusDot;
let voiceResponse;
let responseText;
let aiCore;
let audioContext;
let analyzer;
let dataArray;
let isAgentModeActive = false;

// Mode Elements
let chatModeBtn;
let commandModeBtn;

// Memory Elements
let memorySection;
let memoryList;
let memoryStats;
let closeMemoryBtn;

// State
let conversationHistory = [];
let isProcessing = false;
let currentMode = 'chat'; // 'chat' or 'command'
let recognition = null;
let isListening = false;
let autoSpeakEnabled = false; // Auto-speak new AI responses

// Fixed model configuration
const FIXED_MODEL = 'gemini-2.5-flash'; // Using Gemini 2.5 Flash as the only model

// Storage Constants
const MEMORY_KEY = 'vynceai_memory';
const MAX_MEMORY_ITEMS = 20;
const MODE_SELECTED_KEY = 'vynceai_mode_selected';
const PREFERRED_MODE_KEY = 'vynceai_preferred_mode';
const AUTO_SPEAK_KEY = 'vynceai_auto_speak';

// User preferences
let userPreferredMode = 'site-specific'; // Default to site-specific mode

// === TEXT-TO-SPEECH (TTS) HELPER ===
let currentSpeakButton = null;
let availableVoices = [];

// Preload voices for smoother playback
window.speechSynthesis.onvoiceschanged = () => {
  availableVoices = window.speechSynthesis.getVoices();
};

function getOptimalVoice() {
  const voices = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();
  
  // Priority order for natural-sounding voices
  const preferredVoices = [
    // Google voices (best quality)
    'Google US English',
    'Google UK English Female',
    'Google UK English Male',
    
    // Microsoft voices (Windows)
    'Microsoft Aria Online (Natural)',
    'Microsoft Jenny Online (Natural)',
    'Microsoft Guy Online (Natural)',
    'Microsoft Aria',
    'Microsoft Zira',
    
    // Apple voices (macOS)
    'Samantha',
    'Alex',
    'Victoria',
    'Karen',
    
    // Fallback natural voices
    'Allison',
    'Ava',
    'Susan',
    'Veena'
  ];
  
  // Find the best available voice
  for (const preferredName of preferredVoices) {
    const voice = voices.find(v => v.name.includes(preferredName));
    if (voice) {
      return voice;
    }
  }
  
  // Fallback: any English voice
  const englishVoice = voices.find(v => v.lang.startsWith('en'));
  if (englishVoice) {
    return englishVoice;
  }
  
  // Last resort: first available voice
  return voices[0] || null;
}

function speakText(text, buttonElement = null) {
  if (!text) return;
  
  // Stop any ongoing speech first
  speechSynthesis.cancel();
  
  // Reset previous button
  if (currentSpeakButton) {
    currentSpeakButton.innerHTML = '🔊';
    currentSpeakButton.disabled = false;
  }
  
  // Clean up the text for better speech
  const cleanText = text
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove markdown bold
    .replace(/\*(.*?)\*/g, '$1') // Remove markdown italic
    .replace(/#{1,6}\s/g, '') // Remove markdown headers
    .replace(/📄|🔍|🌐|🧭|✅|❌|⏳|📊|🎯|🤖|✨/g, '') // Remove emojis
    .replace(/\n+/g, '. ') // Replace line breaks with periods
    .replace(/\s+/g, ' ') // Clean up multiple spaces
    .trim();
  
  const utterance = new SpeechSynthesisUtterance(cleanText);
  
  // Use optimal voice
  const selectedVoice = getOptimalVoice();
  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }
  
  // Natural speech settings for assistant-like voice
  utterance.rate = 1.0;     // Natural speaking speed
  utterance.pitch = 1.0;    // Balanced tone
  utterance.volume = 1.0;   // Full volume
  utterance.lang = 'en-US'; // Language
  
  // Update button state
  if (buttonElement) {
    currentSpeakButton = buttonElement;
    buttonElement.innerHTML = '🔇';
    buttonElement.title = 'Stop speaking';
    buttonElement.style.background = 'rgba(239, 68, 68, 0.1)';
    buttonElement.style.borderColor = 'rgba(239, 68, 68, 0.3)';
    buttonElement.style.color = '#ef4444';
  }
  
  // Handle speech events
  utterance.onstart = () => {
    // Activate Agent Mode speaking visuals
    if (isAgentModeActive) {
      setAgentSpeaking(true);
    }
  };
  
  utterance.onend = () => {
    if (currentSpeakButton) {
      currentSpeakButton.innerHTML = '🔊';
      currentSpeakButton.title = 'Listen to this response';
      currentSpeakButton.style.background = 'rgba(34, 197, 94, 0.1)';
      currentSpeakButton.style.borderColor = 'rgba(34, 197, 94, 0.3)';
      currentSpeakButton.style.color = 'var(--green-primary)';
      currentSpeakButton = null;
    }
    
    // Deactivate Agent Mode speaking visuals
    if (isAgentModeActive) {
      setAgentSpeaking(false);
    }
  };
  
  utterance.onerror = (event) => {
    if (currentSpeakButton) {
      currentSpeakButton.innerHTML = '🔊';
      currentSpeakButton.title = 'Listen to this response';
      currentSpeakButton.style.background = 'rgba(34, 197, 94, 0.1)';
      currentSpeakButton.style.borderColor = 'rgba(34, 197, 94, 0.3)';
      currentSpeakButton.style.color = 'var(--green-primary)';
      currentSpeakButton = null;
    }
  };
  
  speechSynthesis.speak(utterance);
}

function stopSpeaking() {
  speechSynthesis.cancel();
  if (currentSpeakButton) {
    currentSpeakButton.innerHTML = '🔊';
    currentSpeakButton.title = 'Listen to this response';
    currentSpeakButton.style.background = 'rgba(34, 197, 94, 0.1)';
    currentSpeakButton.style.borderColor = 'rgba(34, 197, 94, 0.3)';
    currentSpeakButton.style.color = 'var(--green-primary)';
    currentSpeakButton = null;
  }
}

/**
 * Initialize the popup
 */
async function init() {
  // Check if mode has been selected
  const modeCheck = await checkModeSelection();
  
  // Load auto-speak preference
  const result = await chrome.storage.local.get([AUTO_SPEAK_KEY]);
  autoSpeakEnabled = result[AUTO_SPEAK_KEY] || false;
  
  // Initialize all DOM elements after DOM is loaded
  chatContainer = document.getElementById('chat-container');
  userInput = document.getElementById('user-input');
  sendBtn = document.getElementById('send-btn');
  voiceBtn = document.getElementById('voice-btn');
  voiceIndicator = document.getElementById('voice-indicator');
  voiceStatusText = document.getElementById('voice-status-text');
  clearBtn = document.getElementById('clear-btn');
  memoryBtn = document.getElementById('memory-btn');
  settingsBtn = document.getElementById('settings-btn');
  modelSelect = document.getElementById('model-select');
  statusText = document.querySelector('.status-text');
  statusDot = document.querySelector('.status-dot');
  
  // Quick action buttons
  summarizeBtn = document.getElementById('summarize-btn');
  analyzeBtn = document.getElementById('analyze-btn');
  
  // Q&A elements
  qaInput = document.getElementById('qa-input');
  qaBtn = document.getElementById('qa-btn');
  qaResult = document.getElementById('qa-result');
  
  // Mode Elements
  chatModeBtn = document.getElementById('chat-mode-btn');
  commandModeBtn = document.getElementById('command-mode-btn');
  
  // Memory Elements
  memorySection = document.getElementById('memory-section');
  memoryList = document.getElementById('memory-list');
  memoryStats = document.getElementById('memory-stats');
  closeMemoryBtn = document.getElementById('close-memory-btn');
  
  // Agent Mode Elements
  agentMode = document.getElementById('agent-mode');
  agentVoiceBtn = document.getElementById('agent-voice-btn');
  exitAgentBtn = document.getElementById('exit-agent-btn');
  agentStatusText = document.getElementById('agent-status-text');
  agentStatusDot = document.getElementById('agent-status-dot');
  voiceResponse = document.getElementById('voice-response');
  responseText = document.getElementById('response-text');
  
  // Check if first time user
  if (!modeCheck.selected) {
    // Show inline mode selection
    showInlineModeSelection();
  } else {
    // Load user preferences
    userPreferredMode = modeCheck.mode;
    
    // Show welcome message
    const welcomeMsg = document.getElementById('welcome-message');
    if (welcomeMsg) {
      welcomeMsg.style.display = 'block';
    }
  }
  
  loadConversationHistory();
  // Set fixed model
  if (modelSelect) {
    modelSelect.value = FIXED_MODEL;
  }
  setupEventListeners();
  initVoiceRecognition();
  
  // Initialize Agent Mode after voice recognition is ready
  setTimeout(() => {
    enhanceVoiceRecognitionForAgent();
  }, 100);
  updateStatus('ready');
  updateMemoryBadge();
  
  // Check if should show memory on load (from settings)
  const showMemory = await chrome.storage.local.get(['showMemoryOnLoad']);
  if (showMemory.showMemoryOnLoad) {
    await chrome.storage.local.remove(['showMemoryOnLoad']);
    handleShowMemory();
  }
  
  // Auto-focus input
  if (userInput) {
    userInput.focus();
  }
}

/**
 * Check if user has selected a mode
 */
async function checkModeSelection() {
  try {
    const result = await chrome.storage.local.get([MODE_SELECTED_KEY, PREFERRED_MODE_KEY]);
    
    return {
      selected: result[MODE_SELECTED_KEY] || false,
      mode: result[PREFERRED_MODE_KEY] || 'site-specific'
    };
  } catch (error) {
    console.error('Error checking mode selection:', error);
    return { selected: false, mode: 'site-specific' };
  }
}

/**
 * Show inline mode selection in chat area
 */
function showInlineModeSelection() {
  const modeSelectionInline = document.getElementById('mode-selection-inline');
  const welcomeMessage = document.getElementById('welcome-message');
  
  if (modeSelectionInline) {
    modeSelectionInline.style.display = 'block';
  }
  
  if (welcomeMessage) {
    welcomeMessage.style.display = 'none';
  }
  
  // Add click handlers to inline mode cards
  const inlineModeCards = document.querySelectorAll('.inline-mode-card');
  inlineModeCards.forEach(card => {
    card.addEventListener('click', () => handleInlineModeSelection(card));
  });
}

/**
 * Handle inline mode selection
 */
async function handleInlineModeSelection(card) {
  const mode = card.getAttribute('data-mode');
  
  // Add loading state
  card.classList.add('loading');
  
  try {
    // Save mode preference
    await chrome.storage.local.set({
      [MODE_SELECTED_KEY]: true,
      [PREFERRED_MODE_KEY]: mode
    });
    
    // Update global variable
    userPreferredMode = mode;
    
    // Hide mode selection and show welcome message
    const modeSelectionInline = document.getElementById('mode-selection-inline');
    const welcomeMessage = document.getElementById('welcome-message');
    
    if (modeSelectionInline) {
      modeSelectionInline.style.display = 'none';
    }
    
    if (welcomeMessage) {
      welcomeMessage.style.display = 'block';
      
      // Add success message
      const modeLabel = mode === 'site-specific' ? 'Site-Specific Mode' : 'General Mode';
      
      addSystemMessage(`✅ ${modeLabel} activated!`);
    }
    
    // Focus input
    if (userInput) {
      userInput.focus();
    }
    
  } catch (error) {
    console.error('Error saving mode:', error);
    card.classList.remove('loading');
    showError('Failed to save mode preference. Please try again.');
  }
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
  // Send message on button click
  if (sendBtn) {
    sendBtn.addEventListener('click', handleSendMessage);
  }
  
  // Voice input
  if (voiceBtn) {
    voiceBtn.addEventListener('click', toggleVoiceRecognition);
  }
  
  // Quick actions
  if (summarizeBtn) {
    summarizeBtn.addEventListener('click', handleSummarizePage);
  }
  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', handleAnalyzePage);
  }
  
  // Agent Mode button
  const agentModeBtn = document.getElementById('agent-mode-btn');
  if (agentModeBtn) {
    agentModeBtn.addEventListener('click', enterAgentMode);
  }
  
  // Memory button
  if (memoryBtn) {
    memoryBtn.addEventListener('click', handleShowMemory);
  }
  
  // Close memory button
  if (closeMemoryBtn) {
    closeMemoryBtn.addEventListener('click', handleCloseMemory);
  }
  
  // Mode switching
  if (chatModeBtn) {
    chatModeBtn.addEventListener('click', () => switchMode('chat'));
  }
  if (commandModeBtn) {
    commandModeBtn.addEventListener('click', () => switchMode('command'));
  }
  
  // Send message on Enter (Shift+Enter for new line)
  if (userInput) {
    userInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
      
      // Ctrl/Cmd + Space to activate voice input
      if (e.key === ' ' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        toggleVoiceRecognition();
      }
    });
    
    // Auto-resize textarea
    userInput.addEventListener('input', autoResizeTextarea);
  }
  
  // Clear conversation
  if (clearBtn) {
    clearBtn.addEventListener('click', handleClearConversation);
  }
  
  // Settings (placeholder for now)
  if (settingsBtn) {
    settingsBtn.addEventListener('click', handleSettings);
  }
  
  // Save selected model
  if (modelSelect) {
    modelSelect.addEventListener('change', () => {
      // Model is fixed, but keep listener for compatibility
      modelSelect.value = FIXED_MODEL;
    });
  }
  
  // Agent Mode Event Listeners
  if (agentVoiceBtn) {
    agentVoiceBtn.addEventListener('click', handleAgentVoiceToggle);
  }
  
  if (exitAgentBtn) {
    exitAgentBtn.addEventListener('click', exitAgentMode);
  }
  
  // Long press on voice button to enter Agent Mode
  let voicePressTimer;
  if (voiceBtn) {
    voiceBtn.addEventListener('mousedown', () => {
      voicePressTimer = setTimeout(() => {
        enterAgentMode();
      }, 1000); // 1 second long press
    });
    
    voiceBtn.addEventListener('mouseup', () => {
      clearTimeout(voicePressTimer);
    });
    
    voiceBtn.addEventListener('mouseleave', () => {
      clearTimeout(voicePressTimer);
    });
  }
  
  // Initialize Agent Mode
  initializeAgentMode();
}

// ============================================
// VOICE RECOGNITION
// ============================================

/**
 * Initialize Web Speech API
 */
function initVoiceRecognition() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    console.warn('Speech recognition not supported');
    voiceBtn.disabled = true;
    voiceBtn.title = 'Speech recognition not supported in this browser';
    return;
  }
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';
  recognition.maxAlternatives = 1;
  
  // Set initial tooltip
  voiceBtn.title = 'Voice input (click to speak, hold for Agent Mode)';
  
  recognition.onstart = () => {
    isListening = true;
    voiceBtn.classList.remove('requesting');
    voiceBtn.classList.add('listening');
    voiceIndicator.style.display = 'flex';
    voiceBtn.title = 'Stop listening (click or speak)';
    voiceStatusText.textContent = 'Listening...';
    updateStatus('listening');
  };
  
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    const confidence = event.results[0][0].confidence;
    
    userInput.value = transcript;
    autoResizeTextarea();
    userInput.focus();
    
    // Visual feedback for successful recognition
    voiceBtn.style.borderColor = 'var(--green-primary)';
    voiceBtn.style.color = 'var(--green-primary)';
    setTimeout(() => {
      voiceBtn.style.borderColor = '';
      voiceBtn.style.color = '';
    }, 500);
    
    // Auto-send after a short delay (optional - you can remove this)
    // Auto-send voice messages after recognition
    showInfo('🎤 Voice message captured! Sending in 0.5 seconds...');
    setTimeout(() => handleSendMessage(), 500);
  };
  
  recognition.onerror = (event) => {
    stopVoiceRecognition();
    
    if (event.error === 'no-speech') {
      showError('🎤 No speech detected. Please try again.');
    } else if (event.error === 'audio-capture') {
      showError('🎤 No microphone detected. Please check your microphone connection.');
    } else if (event.error === 'not-allowed') {
      showError('🎤 Microphone permission denied. Click the 🎤 icon in your browser\'s address bar to allow access, then try again.');
    } else if (event.error !== 'aborted') {
      showError('🎤 Voice recognition error: ' + event.error);
    }
  };
  
  recognition.onend = () => {
    stopVoiceRecognition();
  };
}

/**
 * Toggle voice recognition on/off
 */
function toggleVoiceRecognition() {
  if (!recognition) {
    showError('Voice recognition not available in this browser');
    return;
  }
  
  if (isListening) {
    recognition.stop();
    return;
  }
  
  try {
    // Show listening state immediately
    voiceBtn.classList.add('requesting');
    voiceIndicator.style.display = 'flex';
    voiceStatusText.textContent = 'Click "Allow" in browser popup if prompted...';
    
    // Let Web Speech API handle permissions naturally
    recognition.start();
    
  } catch (error) {
    // Hide indicator and remove requesting state
    voiceIndicator.style.display = 'none';
    voiceBtn.classList.remove('requesting');
    
    if (error.name === 'NotAllowedError') {
      showError('🎤 Microphone access denied. Please click "Allow" when the browser prompts for microphone access.');
    } else if (error.name === 'NotFoundError') {
      showError('🎤 No microphone found. Please connect a microphone and try again.');
    } else if (error.name === 'NotReadableError') {
      showError('🎤 Microphone is already in use by another application.');
    } else if (error.message.includes('already started')) {
      // Ignore this error - recognition is already running
      console.log('Recognition already started, ignoring error');
    } else {
      showError('🎤 Could not start voice recognition. Please try again.');
    }
  }
}

/**
 * Stop voice recognition
 */
function stopVoiceRecognition() {
  isListening = false;
  voiceBtn.classList.remove('listening');
  voiceBtn.title = 'Voice input (click to speak, hold for Agent Mode)';
  voiceIndicator.style.display = 'none';
  updateStatus('ready');
}

// ============================================
// MODE SWITCHING (Chat vs Command)
// ============================================

/**
 * Switch between Chat and Command modes
 */
function switchMode(mode) {
  currentMode = mode;
  
  if (mode === 'chat') {
    chatModeBtn.classList.add('active');
    commandModeBtn.classList.remove('active');
    userInput.placeholder = 'Ask VynceAI anything...';
    showInfo('💬 Chat Mode: Talk with VynceAI about this webpage');
  } else {
    commandModeBtn.classList.add('active');
    chatModeBtn.classList.remove('active');
    userInput.placeholder = 'Speak a command: scroll, open tab, go to...';
    showInfo('⚡ Command Mode: Control your browser with voice commands');
  }
}

/**
 * Show info message
 */
function showInfo(message) {
  const infoDiv = document.createElement('div');
  infoDiv.className = 'error-message';
  infoDiv.style.background = 'rgba(59, 130, 246, 0.2)';
  infoDiv.style.borderColor = 'rgba(59, 130, 246, 0.4)';
  infoDiv.style.color = '#3b82f6';
  infoDiv.innerHTML = `
    <svg class="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
    <span>${message}</span>
  `;
  
  chatContainer.insertBefore(infoDiv, chatContainer.firstChild);
  setTimeout(() => infoDiv.remove(), 3000);
}

/**
 * Handle sending a message - Unified handler for all types of input
 */
async function handleSendMessage() {
  const message = sanitizeInput(userInput.value.trim());
  
  if (!message || isProcessing) return;
  
  const messageLower = message.toLowerCase();
  
  // Clear input and reset height
  userInput.value = '';
  userInput.style.height = 'auto';
  
  // Add user message to UI
  addMessage('user', message);
  
  // ✅ Detect "open" commands for new sites
  if (messageLower.startsWith("open ") || (messageLower.startsWith("go to ") && !messageLower.includes("scroll") && !messageLower.includes("section") && !messageLower.includes("footer") && !messageLower.includes("top"))) {
    await handleOpenSiteCommand(message, messageLower);
    return;
  }
  
  // ✅ Detect navigation commands within current page
  if (
    messageLower.includes("scroll") ||
    messageLower.includes("footer") ||
    messageLower.includes("top") ||
    messageLower.includes("bottom") ||
    messageLower.includes("section") ||
    (messageLower.startsWith("go to ") && (messageLower.includes("footer") || messageLower.includes("top") || messageLower.includes("section"))) ||
    (messageLower.startsWith("jump to ")) ||
    (messageLower.includes("find ") && messageLower.includes("section"))
  ) {
    await handleNavigationCommand(message, messageLower);
    return;
  }
  
  // ✅ Detect automation commands (YouTube search, form fill, etc.)
  if (
    (messageLower.includes("search") && (messageLower.includes("youtube") || messageLower.includes("yt"))) ||
    (messageLower.includes("find") && (messageLower.includes("youtube") || messageLower.includes("yt"))) ||
    (messageLower.includes("look") && messageLower.includes("youtube")) ||
    messageLower.includes("fill form") ||
    (messageLower.includes("submit") && messageLower.includes("form")) ||
    (messageLower.includes("click") && (messageLower.includes("button") || messageLower.includes("link"))) ||
    messageLower.includes("autofill") ||
    messageLower.includes("complete form") ||
    (messageLower.includes("fill") && messageLower.includes("with"))
  ) {
    await handleAutomationCommand(message);
    return;
  }
  
  // Check if in command mode
  if (currentMode === 'command') {
    await handleCommand(message);
    return;
  }
  
  // Default: Handle as normal chat with AI
  await handleChatMessage(message);
}

/**
 * Handle opening a new site
 */
async function handleOpenSiteCommand(message, messageLower) {
  let site = messageLower.replace(/^(open |go to )/, "").trim();

  // Site alias map for common sites
  const knownSites = {
    youtube: "https://www.youtube.com",
    linkedin: "https://www.linkedin.com",
    wikipedia: "https://en.wikipedia.org",
    twitter: "https://x.com",
    github: "https://github.com",
    google: "https://google.com",
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    reddit: "https://reddit.com",
    stackoverflow: "https://stackoverflow.com",
    amazon: "https://amazon.com",
    netflix: "https://netflix.com"
  };

  // Check if it's a known site alias
  if (knownSites[site]) {
    site = knownSites[site];
  } else {
    // Add https:// if missing
    if (!site.startsWith("http")) {
      if (!site.includes(".")) {
        site = `${site}.com`;
      }
      site = `https://${site}`;
    }
  }

  setProcessingState(true);
  const loadingId = addLoadingMessage();
  
  try {
    const response = await chrome.runtime.sendMessage({ type: "OPEN_SITE", url: site });
    
    removeLoadingMessage(loadingId);
    
    if (response && response.success) {
      addMessage('ai', `🌐 Successfully opened ${site} in a new tab`, FIXED_MODEL);
      
      // Auto-speak in Agent Mode
      if (isAgentModeActive) {
        setTimeout(() => speakText(`Opened ${site} in new tab`), 200);
      }
    } else {
      throw new Error(response?.error || 'Failed to open site');
    }
  } catch (error) {
    removeLoadingMessage(loadingId);
    const errorMsg = `❌ Failed to open site: ${error.message}`;
    addMessage('ai', errorMsg, FIXED_MODEL);
    
    if (isAgentModeActive) {
      setTimeout(() => speakText(errorMsg), 200);
    }
  } finally {
    setProcessingState(false);
  }
}

/**
 * Handle automation commands (YouTube search, form fill, etc.)
 */
async function handleAutomationCommand(message) {
  setProcessingState(true);
  const loadingId = addLoadingMessage();
  
  try {
    // Get active tab
    const tabs = await new Promise(resolve => chrome.tabs.query({ active: true, currentWindow: true }, resolve));
    if (!tabs || !tabs[0]) {
      throw new Error("No active tab found");
    }
    const tab = tabs[0];

    // Check for restricted pages
    const forbiddenPrefixes = ["chrome://", "chrome-extension://", "edge://", "about:"];
    if (forbiddenPrefixes.some(p => tab.url && tab.url.startsWith(p))) {
      removeLoadingMessage(loadingId);
      addMessage('ai', "❌ Cannot execute automation on browser internal pages.", FIXED_MODEL);
      setProcessingState(false);
      return;
    }

    // Send automation command to background script
    const response = await chrome.runtime.sendMessage({
      type: 'AUTOMATION_EXECUTE',
      command: message,
      tabId: tab.id
    });
    
    removeLoadingMessage(loadingId);
    
    if (response && response.success) {
      addMessage('ai', `✅ ${response.message || 'Automation completed successfully'}`, FIXED_MODEL);
      
      // Auto-speak in Agent Mode
      if (isAgentModeActive) {
        setTimeout(() => speakText(response.message || 'Automation completed'), 200);
      }
    } else {
      throw new Error(response?.error || 'Automation failed');
    }
    
  } catch (error) {
    console.error('Automation error:', error);
    removeLoadingMessage(loadingId);
    addMessage('ai', `❌ Automation failed: ${error.message}`, FIXED_MODEL);
    
    if (isAgentModeActive) {
      setTimeout(() => speakText(`Automation failed: ${error.message}`), 200);
    }
  } finally {
    setProcessingState(false);
  }
}

/**
 * Handle navigation within current page
 */
async function handleNavigationCommand(message, messageLower) {
  setProcessingState(true);
  
  try {
    const tabs = await new Promise(resolve => chrome.tabs.query({ active: true, currentWindow: true }, resolve));
    if (!tabs || !tabs[0]) throw new Error("No active tab found");
    const tab = tabs[0];

    // Check for restricted pages
    const forbiddenPrefixes = ["chrome://", "chrome-extension://", "edge://", "about:"];
    if (forbiddenPrefixes.some(p => tab.url && tab.url.startsWith(p))) {
      addMessage('ai', "❌ Cannot navigate browser internal pages.", FIXED_MODEL);
      setProcessingState(false);
      return;
    }

    // Inject content script if needed
    try {
      await executeScriptAsync(tab.id, ["content/content.js", "content/page-reader.js"]);
    } catch (injectErr) {
      console.warn("Content script injection failed:", injectErr.message);
    }

    // Check if this is a semantic section navigation command
    const sectionMatch = messageLower.match(/(?:go to|jump to|find|scroll to)\s+(?:the\s+)?(.+?)\s*(?:section)?$/i);
    if (sectionMatch && !messageLower.includes("scroll down") && !messageLower.includes("scroll up")) {
      const sectionName = sectionMatch[1].trim();
      
      // Skip if it's a basic navigation command
      if (!['top', 'bottom', 'footer', 'header', 'up', 'down'].includes(sectionName)) {
        const loadingId = addLoadingMessage();
        
        const response = await chrome.tabs.sendMessage(tab.id, { action: "scrollToSection", section: sectionName });
        
        removeLoadingMessage(loadingId);
        
        if (response && response.success) {
          addMessage('ai', `✅ Found and navigated to the "${sectionName}" section`, FIXED_MODEL);
          
          if (isAgentModeActive) {
            setTimeout(() => speakText(`Found and navigated to the ${sectionName} section`), 200);
          }
        } else {
          addMessage('ai', `🔍 I searched but couldn't find a "${sectionName}" section on this page. Try "scroll down" to explore more content.`, FIXED_MODEL);
          
          if (isAgentModeActive) {
            setTimeout(() => speakText(`I couldn't find a ${sectionName} section. Try scroll down.`), 200);
          }
        }
        
        setProcessingState(false);
        return;
      }
    }
    
    // Fall back to basic navigation
    const loadingId = addLoadingMessage();
    const response = await chrome.tabs.sendMessage(tab.id, { action: "NAVIGATE_PAGE", command: message });
    
    removeLoadingMessage(loadingId);
    
    addMessage('ai', `✅ Navigated: ${message}`, FIXED_MODEL);
    
    if (isAgentModeActive) {
      setTimeout(() => speakText(`Navigated: ${message}`), 200);
    }
    
  } catch (error) {
    console.error("Navigation error:", error);
    addMessage('ai', `❌ Navigation failed: ${error.message}`, FIXED_MODEL);
  } finally {
    setProcessingState(false);
  }
}

/**
 * Handle normal chat message with AI
 */
async function handleChatMessage(message) {
  // Show loading state
  setProcessingState(true);
  const loadingId = addLoadingMessage();
  
  try {
    // Get page context and recent memory
    const context = await getPageContext();
    const recentMemory = await getRecentMemory(3);
    
    // Send message to background script with memory and mode preference
    const response = await chrome.runtime.sendMessage({
      type: 'SEND_PROMPT',
      payload: {
        mode: userPreferredMode, // 'site-specific' or 'general'
        prompt: message,
        context: context,
        memory: recentMemory
      }
    });
    
    // Remove loading message
    removeLoadingMessage(loadingId);
    
    if (response.success) {
      // Add AI response to UI
      const aiResponse = response.data?.response || response.text || response.response;
      const modelUsed = response.data?.model || (userPreferredMode === 'site-specific' ? 'Gemini 2.5 Flash' : 'Llama 3.3 70B');
      addMessage('ai', aiResponse, modelUsed);
      
      // Save to memory
      await saveToMemory(message, aiResponse, context, modelUsed);
      updateMemoryBadge();
      
      // Save to history
      saveConversation();
    } else {
      // Show error
      showError(response.error || 'Failed to get response');
    }
    
  } catch (error) {
    console.error('Error sending message:', error);
    removeLoadingMessage(loadingId);
    showError('Failed to communicate with AI. Please try again.');
  } finally {
    setProcessingState(false);
  }
}

// ============================================
// COMMAND MODE HANDLERS
// ============================================

/**
 * Handle browser automation commands
 */
async function handleCommand(command) {
  const lowerCommand = command.toLowerCase();
  
  // Clear input
  userInput.value = '';
  userInput.style.height = 'auto';
  
  // Add command to chat
  addMessage('user', command);
  
  try {
    // Send command to background script
    const response = await chrome.runtime.sendMessage({
      type: 'EXECUTE_COMMAND',
      payload: { command: lowerCommand }
    });
    
    if (response.success) {
      addMessage('ai', `✅ ${response.message}`, 'Command');
    } else {
      showError(response.error || 'Command failed');
    }
  } catch (error) {
    console.error('Error executing command:', error);
    showError('Failed to execute command');
  }
}

/**
 * Add a message to the chat container
 */
function addMessage(sender, content, model = null) {
  if (!chatContainer) {
    console.error('chatContainer is null, cannot add message');
    return;
  }
  
  // Remove welcome message if exists
  const welcomeMsg = chatContainer.querySelector('.welcome-message');
  if (welcomeMsg) {
    welcomeMsg.remove();
  }
  
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}-message`;
  
  const timestamp = getCurrentTimestamp();
  const avatar = sender === 'user' ? 'You' : '🤖';
  const senderName = sender === 'user' ? 'You' : 'VynceAI';
  
  messageDiv.innerHTML = `
    <div class="message-header">
      <div class="message-avatar">${sender === 'user' ? 'Y' : 'V'}</div>
      <span class="message-sender">${senderName}</span>
      <span class="message-time">${timestamp}</span>
    </div>
    <div class="message-content">${formatResponse(content)}</div>
  `;
  
  // Add TTS button for AI responses
  if (sender === 'ai') {
    const messageActions = document.createElement('div');
    messageActions.className = 'message-actions';
    
    const speakBtn = document.createElement('button');
    speakBtn.className = 'speak-btn';
    speakBtn.innerHTML = '🔊';
    speakBtn.title = 'Listen to this response';
    speakBtn.onclick = () => {
      if (speechSynthesis.speaking) {
        stopSpeaking();
      } else {
        speakText(content, speakBtn);
      }
    };
    
    messageActions.appendChild(speakBtn);
    messageDiv.appendChild(messageActions);
    
    // Auto-speak if enabled OR in Agent Mode (with a small delay for better UX)
    if (autoSpeakEnabled || isAgentModeActive) {
      setTimeout(() => {
        speakText(content, speakBtn);
      }, 500);
    }
  }
  
  chatContainer.appendChild(messageDiv);
  
  // Scroll to bottom
  chatContainer.scrollTop = chatContainer.scrollHeight;
  
  // Add to conversation history
  conversationHistory.push({
    sender,
    content,
    model,
    timestamp: Date.now()
  });
}

/**
 * Add loading message while waiting for AI response
 */
function addLoadingMessage() {
  const loadingId = `loading-${Date.now()}`;
  
  // Re-query chatContainer in case it was lost
  const container = chatContainer || document.getElementById('chat-container');
  
  if (!container) {
    console.error('Cannot find chat container, skipping loading message');
    return loadingId;
  }
  
  try {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message ai-message';
    loadingDiv.id = loadingId;
    
    loadingDiv.innerHTML = `
      <div class="message-header">
        <div class="message-avatar">V</div>
        <span class="message-sender">VynceAI</span>
      </div>
      <div class="loading-message">
        <span>Thinking</span>
        <div class="loading-dots">
          <div class="loading-dot"></div>
          <div class="loading-dot"></div>
          <div class="loading-dot"></div>
        </div>
      </div>
    `;
    
    container.appendChild(loadingDiv);
    container.scrollTop = container.scrollHeight;
    
    return loadingId;
  } catch (error) {
    console.error('Error adding loading message:', error);
    return loadingId;
  }
}

/**
 * Remove loading message
 */
function removeLoadingMessage(loadingId) {
  const loadingElement = document.getElementById(loadingId);
  if (loadingElement) {
    loadingElement.remove();
  }
}

/**
 * Show error message
 */
function showError(message) {
  if (!chatContainer) {
    console.error('chatContainer is null, cannot show error:', message);
    alert(message); // Fallback to alert if chatContainer is not available
    return;
  }
  
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.innerHTML = `
    <svg class="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
    <span>${message}</span>
  `;
  
  chatContainer.appendChild(errorDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
  
  // Remove after 5 seconds
  setTimeout(() => errorDiv.remove(), 5000);
}

/**
 * Handle clear conversation
 */
function handleClearConversation() {
  showCustomConfirm();
}

/**
 * Show custom confirmation dialog
 */
function showCustomConfirm() {
  const overlay = document.getElementById('confirm-overlay');
  const cancelBtn = document.getElementById('confirm-cancel');
  const deleteBtn = document.getElementById('confirm-delete');
  
  overlay.style.display = 'flex';
  
  // Handle cancel
  const handleCancel = () => {
    overlay.style.display = 'none';
    cancelBtn.removeEventListener('click', handleCancel);
    deleteBtn.removeEventListener('click', handleDelete);
  };
  
  // Handle delete
  const handleDelete = () => {
    conversationHistory = [];
    chatContainer.innerHTML = `
      <div class="welcome-message">
        <svg class="welcome-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
        </svg>
        <h3>Welcome to VynceAI</h3>
        <p>Your intelligent AI browser assistant. Chat naturally - I'll handle everything!</p>
      </div>
    `;
    saveConversation();
    overlay.style.display = 'none';
    cancelBtn.removeEventListener('click', handleCancel);
    deleteBtn.removeEventListener('click', handleDelete);
  };
  
  cancelBtn.addEventListener('click', handleCancel);
  deleteBtn.addEventListener('click', handleDelete);
  
  // Close on overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      handleCancel();
    }
  });
}

/**
 * Handle settings button click
 */
function handleSettings() {
  // Navigate to settings page
  window.location.href = 'settings.html';
}

/**
 * Auto-resize textarea based on content
 */
function autoResizeTextarea() {
  userInput.style.height = 'auto';
  userInput.style.height = Math.min(userInput.scrollHeight, 120) + 'px';
}

/**
 * Safely set button state
 */
function setSafeButtonState(button, disabled, className = null) {
  if (!button) {
    return; // Silently return if button is null
  }
  
  try {
    // Double-check button still exists
    if (!button || typeof button !== 'object') {
      return;
    }
    
    // Ensure the button has the disabled property
    if (typeof button.disabled !== 'undefined') {
      button.disabled = disabled;
    }
    
    // Safely handle className/classList operations
    if (className) {
      if (button.classList && typeof button.classList.add === 'function') {
        if (disabled) {
          button.classList.add(className);
        } else {
          button.classList.remove(className);
        }
      } else if (button.className != null && typeof button.className === 'string') {
        // Fallback to className property
        const classNames = button.className.split(' ').filter(c => c);
        if (disabled && !classNames.includes(className)) {
          button.className = [...classNames, className].join(' ');
        } else if (!disabled) {
          button.className = classNames.filter(c => c !== className).join(' ');
        }
      }
    }
  } catch (error) {
    // Silently handle errors in production
    console.debug('Button state update failed (expected if button was removed):', error.message);
  }
}

/**
 * Set processing state
 */
function setProcessingState(processing) {
  isProcessing = processing;
  setSafeButtonState(sendBtn, processing);
  setSafeButtonState(userInput, processing);
  updateStatus(processing ? 'processing' : 'ready');
}

/**
 * Update status indicator
 */
function updateStatus(status) {
  const statusMap = {
    ready: { text: 'Ready', color: '#22c55e' },
    processing: { text: 'Processing...', color: '#f59e0b' },
    listening: { text: 'Listening...', color: '#ef4444' },
    error: { text: 'Error', color: '#ef4444' }
  };
  
  const { text, color } = statusMap[status] || statusMap.ready;
  statusText.textContent = text;
  statusDot.style.background = color;
  
  // Add listening class to status indicator
  const statusIndicator = document.querySelector('.status-indicator');
  if (status === 'listening') {
    statusIndicator.classList.add('listening');
  } else {
    statusIndicator.classList.remove('listening');
  }
}

/**
 * Get current page context for AI
 */
async function getPageContext() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab?.id) return null;
    
    // Skip restricted pages where content scripts can't run
    const restrictedPrefixes = ['chrome://', 'chrome-extension://', 'about:', 'edge://'];
    if (restrictedPrefixes.some(prefix => tab.url?.startsWith(prefix))) {
      console.log('Skipping page context - restricted page:', tab.url);
      return null;
    }
    
    // Try to ensure content script is injected (but don't fail if it's not)
    try {
      await ensureContentScriptInjected(tab.id);
    } catch (error) {
      console.debug('Could not inject content script:', error.message);
      return null;
    }
    
    // Get page info from content script
    const response = await chrome.tabs.sendMessage(tab.id, {
      type: 'GET_PAGE_CONTEXT'
    });
    
    return response;
  } catch (error) {
    // Silently handle content script connection errors (expected on some pages)
    console.debug('Could not get page context (normal for restricted pages):', error.message);
    return null;
  }
}

/**
 * Load conversation history from storage
 */
async function loadConversationHistory() {
  try {
    const result = await chrome.storage.local.get(['conversationHistory']);
    
    if (result.conversationHistory && result.conversationHistory.length > 0) {
      conversationHistory = result.conversationHistory;
      
      // Remove welcome message
      const welcomeMsg = chatContainer.querySelector('.welcome-message');
      if (welcomeMsg) {
        welcomeMsg.remove();
      }
      
      // Render conversation history
      conversationHistory.forEach(msg => {
        addMessage(msg.sender, msg.content, msg.model);
      });
    }
  } catch (error) {
    console.error('Error loading conversation history:', error);
  }
}

/**
 * Save conversation to storage
 */
function saveConversation() {
  chrome.storage.local.set({ conversationHistory });
}

// ============================================
// MEMORY MANAGEMENT FUNCTIONS
// ============================================

async function getMemory() {
  try {
    const result = await chrome.storage.local.get([MEMORY_KEY]);
    return result[MEMORY_KEY] || [];
  } catch (error) {
    console.error('Error getting memory:', error);
    return [];
  }
}

async function getRecentMemory(count = 3) {
  try {
    const memory = await getMemory();
    return memory.slice(0, count).map(item => ({
      user: item.user,
      bot: item.bot,
      timestamp: item.timestamp
    }));
  } catch (error) {
    console.error('Error getting recent memory:', error);
    return [];
  }
}

async function saveToMemory(userMessage, botResponse, context, model) {
  try {
    const memory = await getMemory();
    
    const interaction = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      user: userMessage,
      bot: botResponse,
      model: model,
      context: context ? {
        url: context.url,
        title: context.title
      } : null
    };
    
    memory.unshift(interaction);
    const trimmedMemory = memory.slice(0, MAX_MEMORY_ITEMS);
    
    await chrome.storage.local.set({ [MEMORY_KEY]: trimmedMemory });
  } catch (error) {
    console.error('Error saving memory:', error);
  }
}

/**
 * Add generic item to memory (simplified version)
 */
async function addToMemory(item) {
  try {
    const memory = await getMemory();
    
    const memoryItem = {
      id: Date.now(),
      timestamp: item.timestamp || new Date().toISOString(),
      type: item.type || 'generic',
      title: item.title || 'Memory Item',
      content: item.content || '',
      url: item.url || null
    };
    
    memory.unshift(memoryItem);
    const trimmedMemory = memory.slice(0, MAX_MEMORY_ITEMS);
    
    await chrome.storage.local.set({ [MEMORY_KEY]: trimmedMemory });
    
  } catch (error) {
    console.error('Error adding to memory:', error);
  }
}

async function clearAllMemory() {
  try {
    await chrome.storage.local.remove(MEMORY_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing memory:', error);
    return false;
  }
}

async function getMemoryStats() {
  try {
    const memory = await getMemory();
    return {
      count: memory.length,
      oldestTimestamp: memory.length > 0 ? memory[memory.length - 1].timestamp : null,
      newestTimestamp: memory.length > 0 ? memory[0].timestamp : null,
      totalSize: JSON.stringify(memory).length
    };
  } catch (error) {
    console.error('Error getting memory stats:', error);
    return { count: 0 };
  }
}

async function handleShowMemory() {
  try {
    const memory = await getMemory();
    
    memoryList.innerHTML = '';
    
    if (memory.length === 0) {
      memoryList.innerHTML = `
        <div class="memory-empty">
          <svg class="memory-empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
          <div class="memory-empty-text">
            <strong>No Memory Yet</strong>
            Start a conversation to build your memory storage
          </div>
        </div>
      `;
    } else {
      memory.forEach(item => {
        const memoryItem = document.createElement('div');
        memoryItem.className = 'memory-item';
        
        const timestamp = new Date(item.timestamp).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        
        // Handle two types of memory items:
        // 1. Chat interactions (has user/bot fields)
        // 2. Generic memory items (has title/content fields)
        let itemHTML = '';
        
        if (item.user && item.bot) {
          // Chat interaction format
          const contextInfo = item.context ? 
            `<div class="memory-context">${escapeHtml(item.context.title || item.context.url)}</div>` : '';
          
          const botText = item.bot || '';
          const botPreview = botText.length > 150 ? botText.substring(0, 150) + '...' : botText;
          
          itemHTML = `
            <div class="memory-item-header">
              <span class="memory-timestamp">${timestamp}</span>
              <span class="memory-model">${item.model || 'unknown'}</span>
            </div>
            <div class="memory-user">${escapeHtml(item.user || '')}</div>
            <div class="memory-bot">${escapeHtml(botPreview)}</div>
            ${contextInfo}
          `;
        } else {
          // Generic memory format
          const content = item.content || '';
          const contentPreview = content.length > 150 ? content.substring(0, 150) + '...' : content;
          
          itemHTML = `
            <div class="memory-item-header">
              <span class="memory-timestamp">${timestamp}</span>
              <span class="memory-model">${item.type || 'memory'}</span>
            </div>
            <div class="memory-user">${escapeHtml(item.title || 'Saved Item')}</div>
            <div class="memory-bot">${escapeHtml(contentPreview)}</div>
            ${item.url ? `<div class="memory-context">${escapeHtml(item.url)}</div>` : ''}
          `;
        }
        
        memoryItem.innerHTML = itemHTML;
        memoryList.appendChild(memoryItem);
      });
    }
    
    const stats = await getMemoryStats();
    memoryStats.innerHTML = `
      <span>
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
        </svg>
        ${stats.count} ${stats.count === 1 ? 'Interaction' : 'Interactions'}
      </span>
      <span>
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
        </svg>
        ${(stats.totalSize / 1024).toFixed(1)} KB
      </span>
    `;
    
    memorySection.style.display = 'flex';
  } catch (error) {
    console.error('Error showing memory:', error);
    showError('Failed to load memory');
  }
}

function handleCloseMemory() {
  memorySection.style.display = 'none';
}

async function handleClearMemory() {
  const confirmed = confirm('Clear all memory? This cannot be undone.');
  
  if (confirmed) {
    const success = await clearAllMemory();
    
    if (success) {
      addSystemMessage('✅ Memory cleared successfully');
      updateMemoryBadge();
      
      if (memorySection.style.display === 'flex') {
        handleShowMemory();
      }
    } else {
      showError('Failed to clear memory');
    }
  }
}

async function updateMemoryBadge() {
  try {
    if (!memoryBtn) {
      console.debug('Memory button not found, skipping badge update');
      return;
    }
    
    const stats = await getMemoryStats();
    if (stats.count > 0) {
      memoryBtn.setAttribute('data-count', stats.count);
      memoryBtn.style.position = 'relative';
    } else {
      memoryBtn.removeAttribute('data-count');
    }
  } catch (error) {
    console.error('Error updating memory badge:', error);
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ============================================
// PAGE SUMMARIZATION & ANALYSIS
// ============================================

/**
 * Ensure content script is injected before sending messages
 * This fixes "Could not establish connection" errors
 */
async function ensureContentScriptInjected(tabId) {
  try {
    // First, try to ping the existing content script
    const response = await chrome.tabs.sendMessage(tabId, { type: 'PING' });
    if (response && response.success) {
      return true; // Content script is already active
    }
  } catch (error) {
    // Content script not responding, need to inject it
    console.log('Content script not found, injecting...');
  }
  
  try {
    // Inject the content scripts
    await chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content/page-reader.js']
    });
    
    await chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content/content.js']
    });
    
    // Wait a bit for scripts to initialize
    await new Promise(resolve => setTimeout(resolve, 100));
    
    console.log('Content scripts injected successfully');
    return true;
  } catch (error) {
    console.error('Error injecting content script:', error);
    throw new Error('Failed to inject content script. This page may not support extensions.');
  }
}

/**
 * Handle summarize page button click
 * Extracts page content and asks AI to summarize it
 */
async function handleSummarizePage(event) {
  // query button every time (don't use stale references)
  const summarizeBtn = document.getElementById("summarize-btn");

  // Defensive guard
  if (!summarizeBtn) {
    console.error("summarizeBtn missing in popup DOM");
    return;
  }

  try {
    console.log("handleSummarizePage called");
    // UI -> set loading state safely
    summarizeBtn.disabled = true;
    if (summarizeBtn.classList) summarizeBtn.classList.add("loading");
    setProcessingState(true);

    // Remove welcome message if exists
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      const welcomeMsg = chatContainer.querySelector('.welcome-message');
      if (welcomeMsg) {
        welcomeMsg.remove();
      }
    }

    // Add system message
    addSystemMessage(' Analyzing page content...');

    // get active tab
    const tabs = await new Promise(resolve => chrome.tabs.query({ active: true, currentWindow: true }, resolve));
    if (!tabs || !tabs[0]) throw new Error("No active tab found");
    const tab = tabs[0];

    // detect pages you cannot inject into
    const forbiddenPrefixes = ["chrome://", "chrome-extension://", "edge://", "about:"];
    if (forbiddenPrefixes.some(p => tab.url && tab.url.startsWith(p))) {
      console.warn("Cannot inject into this page:", tab.url);
      showError(" This page cannot be summarized due to browser restrictions.");
      return;
    }

    // inject content script (safe: re-inject if not present)
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content/page-reader.js']
      });
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content/content.js']
      });
    } catch (injectErr) {
      console.error("Injection failed:", injectErr.message);
      showError(" Failed to inject content script: " + injectErr.message);
      return;
    }

    // ask content script to extract page text
    let pageData;
    try {
      pageData = await new Promise((resolve, reject) => {
        chrome.tabs.sendMessage(tab.id, { action: "summarizePage" }, (response) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(response);
          }
        });
      });
    } catch (msgErr) {
      console.error("Messaging error:", msgErr.message);
      showError(" Could not get page content: " + msgErr.message);
      return;
    }

    if (!pageData || !pageData.content) {
      console.warn("No content returned from content script", pageData);
      showError(" No readable content found on this page.");
      return;
    }

    // Show loading message
    const loadingId = addLoadingMessage();

    // Create prompt for summarization
    const prompt = `Please provide a comprehensive summary of the following web page content:

Title: ${pageData.title}
URL: ${pageData.url}
Words: ${pageData.wordCount}

Content:
${pageData.content}

Please summarize the main points, key information, and overall theme of this content in a clear and organized manner.`;

    // Send to AI backend
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'SEND_PROMPT',
        payload: {
          model: FIXED_MODEL,
          prompt: prompt,
          context: {
            url: pageData.url,
            title: pageData.title,
            pageContent: pageData.content
          }
        }
      });

      // Remove loading message
      removeLoadingMessage(loadingId);

      if (response.success) {
        const summary = response.data?.response || response.text || response.response;
        addMessage('ai', ` **Page Summary**\n\n${summary}`, FIXED_MODEL);
        
        // Store in memory with page info
        try {
          await addToMemory({
            title: `Summary: ${pageData.title}`,
            content: summary,
            url: pageData.url,
            timestamp: new Date().toISOString(),
            type: 'summary'
          });
          updateMemoryBadge();
        } catch (memoryError) {
          console.warn('Failed to save to memory:', memoryError);
        }
        
        // Save conversation
        saveConversation();
      } else {
        throw new Error(response.error || 'Invalid response from AI service');
      }
    } catch (aiError) {
      console.error('AI request failed:', aiError);
      showError(` AI service error: ${aiError.message}`);
      removeLoadingMessage(loadingId);
    }

  } catch (err) {
    console.error("Error summarizing page:", err);
    showError(" Error summarizing: " + err.message);
  } finally {
    // Always restore UI state safely
    const btn = document.getElementById("summarize-btn");
    if (btn) {
      btn.disabled = false;
      if (btn.classList) btn.classList.remove("loading");
    }
    setProcessingState(false);
  }
}

/**
 * Handle analyze page button click
 * Provides detailed analysis of page content
 */
async function handleAnalyzePage() {
  // Re-query button if null (defensive programming)
  if (!analyzeBtn) {
    analyzeBtn = document.getElementById('analyze-btn');
  }
  
  // Check if button exists and prevent multiple simultaneous calls
  if (!analyzeBtn || analyzeBtn.disabled) {
    console.warn('Analyze button not available or disabled');
    return;
  }
  
  try {
    // Show loading state
    setProcessingState(true);
    setSafeButtonState(analyzeBtn, true, 'loading');
    
    // Remove welcome message if exists
    if (chatContainer) {
      const welcomeMsg = chatContainer.querySelector('.welcome-message');
      if (welcomeMsg) {
        welcomeMsg.remove();
      }
    }
    
    // Add system message
    addSystemMessage('🔍 Performing deep content analysis...');
    
    // Get current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab?.id) {
      throw new Error('No active tab found');
    }
    
    // Check if it's a restricted page
    const restrictedPrefixes = ['chrome://', 'chrome-extension://', 'about:', 'edge://'];
    if (restrictedPrefixes.some(prefix => tab.url?.startsWith(prefix))) {
      showError(' Cannot read content from browser internal pages');
      setProcessingState(false);
      setSafeButtonState(analyzeBtn, false, 'loading');
      return;
    }
    
    // Ensure content script is injected first
    try {
      await ensureContentScriptInjected(tab.id);
    } catch (error) {
      throw new Error('Cannot access this page. Try reloading the page first.');
    }
    
    // Extract page content using content script
    const contentResponse = await chrome.tabs.sendMessage(tab.id, {
      type: 'EXTRACT_PAGE_CONTENT'
    });
    
    if (!contentResponse.success) {
      throw new Error(contentResponse.error || 'Failed to extract page content');
    }
    
    const pageData = contentResponse.data || contentResponse.content;
    
    // Show loading message
    const loadingId = addLoadingMessage();
    
    // Create analysis prompt
    const prompt = `Please provide a detailed analysis of this webpage. Include:

1. **Content Quality**: Assess the quality, depth, and credibility of the content
2. **Structure & Organization**: How well is the content organized?
3. **Key Information**: What are the most valuable insights or data?
4. **Sentiment & Tone**: What's the overall tone (professional, casual, persuasive, etc.)?
5. **Readability**: Is the content easy to understand? Reading level?
6. **Action Items**: Are there any calls-to-action or things the reader should do?

Provide insights that help understand the content better.

Page Details:
- Title: ${pageData.title || 'Unknown'}
- URL: ${pageData.url || tab.url}
- Word Count: ${pageData.wordCount || 'Unknown'}
- Reading Time: ${pageData.readingTime || 'Unknown'} minutes

Content Preview:
${pageData.fullText ? pageData.fullText.substring(0, 3000) : 'No text content found'}`;
    
    // Send to AI for analysis
    const response = await chrome.runtime.sendMessage({
      type: 'SEND_PROMPT',
      payload: {
        model: FIXED_MODEL,
        prompt: prompt,
        context: {
          url: pageData.url || tab.url,
          title: pageData.title || tab.title,
          pageContent: pageData.fullText
        }
      }
    });
    
    // Remove loading message
    removeLoadingMessage(loadingId);
    
    if (response.success) {
      const analysis = response.data?.response || response.text || response.response;
      addMessage('ai', ` **Content Analysis**\n\n${analysis}`, FIXED_MODEL);
      
      // Save to conversation
      saveConversation();
    } else {
      throw new Error(response.error || 'Failed to generate analysis');
    }
    
  } catch (error) {
    console.error('Error analyzing page:', error);
    showError(`Failed to analyze page: ${error.message}`);
  } finally {
    setProcessingState(false);
    // Re-query button in case it was lost
    const btn = analyzeBtn || document.getElementById('analyze-btn');
    if (btn) {
      setSafeButtonState(btn, false, 'loading');
    }
  }
}

/**
 * Add a system message to the chat (for status updates)
 */
function addSystemMessage(message) {
  // Re-query chatContainer in case it was lost
  const container = chatContainer || document.getElementById('chat-container');
  
  if (!container) {
    console.error('Cannot find chat container, skipping system message:', message);
    return;
  }
  
  try {
    const systemDiv = document.createElement('div');
    systemDiv.className = 'message system-message';
    systemDiv.style.textAlign = 'center';
    systemDiv.style.padding = '8px';
    systemDiv.style.margin = '8px 0';
    systemDiv.style.background = 'rgba(34, 197, 94, 0.1)';
    systemDiv.style.border = '1px solid rgba(34, 197, 94, 0.3)';
    systemDiv.style.borderRadius = '8px';
    systemDiv.style.fontSize = '13px';
    systemDiv.style.color = 'var(--green-primary)';
    systemDiv.textContent = message;
    
    container.appendChild(systemDiv);
    container.scrollTop = container.scrollHeight;
    
    // Remove after 3 seconds
    setTimeout(() => systemDiv.remove(), 3000);
  } catch (error) {
    console.error('Error adding system message:', error);
  }
}

// ============================================
// AGENT MODE - Futuristic AI Core Interface
// ============================================

/**
 * Initialize Agent Mode
 */
function initializeAgentMode() {
  if (!agentMode) return;
  
  const canvas = document.getElementById('ai-core-canvas');
  if (canvas && window.AICore) {
    aiCore = new window.AICore(canvas);
    console.log('AI Core initialized');
  }
}

/**
 * Enter Agent Mode with cinematic transition
 */
function enterAgentMode() {
  if (isAgentModeActive) return;
  
  isAgentModeActive = true;
  
  // Show Agent Mode overlay
  agentMode.style.display = 'flex';
  agentMode.classList.add('entering');
  
  // Start AI Core animation
  if (aiCore) {
    aiCore.start();
  }
  
  // Update status
  updateAgentStatus('AI Core Active', 'idle');
  
  // Setup audio analysis for microphone input
  setupAudioAnalysis();
  
  // Remove entering class after animation
  setTimeout(() => {
    agentMode.classList.remove('entering');
    agentMode.classList.add('active');
  }, 1200);
  
  // Haptic feedback if available
  if (navigator.vibrate) {
    navigator.vibrate([50, 100, 50]);
  }
  
  addSystemMessage('Agent Mode Activated - AI Core Online');
}

/**
 * Exit Agent Mode
 */
function exitAgentMode() {
  if (!isAgentModeActive) return;
  
  agentMode.classList.remove('active');
  agentMode.classList.add('exiting');
  
  // Stop AI Core animation
  if (aiCore) {
    aiCore.stop();
  }
  
  // Clean up audio analysis
  cleanupAudioAnalysis();
  
  setTimeout(() => {
    agentMode.style.display = 'none';
    agentMode.classList.remove('exiting');
    isAgentModeActive = false;
  }, 800);
  
  addSystemMessage('👋 Agent Mode Deactivated');
}

/**
 * Handle Agent Mode voice toggle
 */
function handleAgentVoiceToggle() {
  if (!isAgentModeActive) return;
  
  if (isListening) {
    // Stop listening
    recognition.stop();
    agentVoiceBtn.classList.remove('active');
    updateAgentStatus('AI Core Active', 'idle');
    
    if (aiCore) {
      aiCore.setListening(false);
    }
  } else {
    // Start listening
    try {
      recognition.start();
      agentVoiceBtn.classList.add('active');
      updateAgentStatus('Listening...', 'listening');
      agentMode.classList.add('listening');
      
      if (aiCore) {
        aiCore.setListening(true);
      }
    } catch (error) {
      console.error('Voice recognition error:', error);
      updateAgentStatus('Voice Error', 'error');
    }
  }
}

/**
 * Update Agent Mode status
 */
function updateAgentStatus(text, state) {
  if (!agentStatusText || !agentStatusDot) return;
  
  agentStatusText.textContent = text;
  
  // Remove existing state classes
  agentMode.classList.remove('listening', 'speaking', 'error');
  
  // Add new state class
  if (state !== 'idle') {
    agentMode.classList.add(state);
  }
}

/**
 * Setup audio analysis for microphone visualization
 */
async function setupAudioAnalysis() {
  try {
    // Don't create separate audio stream, just prepare for mock visualization
    console.log('Audio analysis setup - using mock visualization for Agent Mode');
    
    // Start mock audio visualization loop
    visualizeAudio();
    
  } catch (error) {
    console.error('Audio analysis setup failed:', error);
  }
}

/**
 * Cleanup audio analysis
 */
function cleanupAudioAnalysis() {
  // Clean up any audio context if it exists
  if (audioContext && audioContext.state !== 'closed') {
    audioContext.close();
  }
  audioContext = null;
  analyzer = null;
  dataArray = null;
}

/**
 * Visualize audio input with AI Core
 */
function visualizeAudio() {
  if (!aiCore || !isAgentModeActive) return;
  
  // Mock audio level based on listening state
  let normalizedLevel = 0;
  
  if (isListening) {
    // Generate mock audio waves during listening
    const time = Date.now() * 0.005;
    normalizedLevel = (Math.sin(time) + Math.sin(time * 2.1) + Math.sin(time * 3.7)) / 6 + 0.5;
    normalizedLevel = Math.max(0, Math.min(1, normalizedLevel * 0.8));
    
    // Update AI Core with mock audio level
    aiCore.setListening(true, normalizedLevel);
    
    // Trigger voice waves on significant audio
    if (normalizedLevel > 0.3) {
      aiCore.triggerVoiceWave(normalizedLevel);
    }
  } else {
    aiCore.setListening(false, 0);
  }
  
  // Continue visualization loop
  requestAnimationFrame(visualizeAudio);
}

/**
 * Handle speaking state in Agent Mode
 */
function setAgentSpeaking(speaking) {
  if (!isAgentModeActive || !aiCore) return;
  
  if (speaking) {
    updateAgentStatus('AI Speaking...', 'speaking');
    aiCore.setSpeaking(true);
    
    // Show voice response
    if (voiceResponse) {
      voiceResponse.style.display = 'block';
    }
    
    // Trigger speaking pulse effects
    const pulseInterval = setInterval(() => {
      if (aiCore && isAgentModeActive) {
        aiCore.triggerSpeakingPulse();
      }
    }, 200);
    
    // Store interval for cleanup
    aiCore.speakingInterval = pulseInterval;
    
  } else {
    updateAgentStatus('AI Core Active', 'idle');
    aiCore.setSpeaking(false);
    
    // Hide voice response
    if (voiceResponse) {
      voiceResponse.style.display = 'none';
    }
    
    // Clear speaking pulse interval
    if (aiCore.speakingInterval) {
      clearInterval(aiCore.speakingInterval);
      aiCore.speakingInterval = null;
    }
  }
}

/**
 * Enhanced voice recognition for Agent Mode
 */
function enhanceVoiceRecognitionForAgent() {
  if (!recognition) return;
  
  // Override existing handlers for Agent Mode
  const originalOnStart = recognition.onstart;
  const originalOnResult = recognition.onresult;
  const originalOnEnd = recognition.onend;
  
  recognition.onstart = () => {
    if (isAgentModeActive) {
      isListening = true;
      updateAgentStatus('Listening...', 'listening');
      agentVoiceBtn.classList.add('active');
      
      if (aiCore) {
        aiCore.setListening(true);
      }
    } else if (originalOnStart) {
      originalOnStart();
    }
  };
  
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    const confidence = event.results[0][0].confidence;
    
    if (isAgentModeActive) {
      // Show transcript in Agent Mode
      if (responseText) {
        responseText.textContent = `You said: "${transcript}"`;
        voiceResponse.style.display = 'block';
      }
      
      // Send to main input instead of deprecated Q&A section
      if (userInput) {
        userInput.value = transcript;
        // Auto-send after a short delay
        setTimeout(() => {
          handleSendMessage();
          if (voiceResponse) {
            voiceResponse.style.display = 'none';
          }
        }, 1000);
      }
      
    } else if (originalOnResult) {
      originalOnResult(event);
    }
  };
  
  recognition.onend = () => {
    if (isAgentModeActive) {
      isListening = false;
      agentVoiceBtn.classList.remove('active');
      updateAgentStatus('AI Core Active', 'idle');
      
      if (aiCore) {
        aiCore.setListening(false);
      }
    } else if (originalOnEnd) {
      originalOnEnd();
    }
  };
}

/**
 * Override speak function for Agent Mode
 */
const originalSpeakText = window.speakText;
window.speakText = function(text) {
  if (isAgentModeActive) {
    setAgentSpeaking(true);
    
    // Show response text in Agent Mode
    if (responseText) {
      responseText.textContent = text;
      voiceResponse.style.display = 'block';
    }
    
    // Call original speak function
    originalSpeakText(text);
    
    // Monitor speech end
    if (window.speechSynthesis) {
      const utterance = window.speechSynthesis.speak ? 
        new SpeechSynthesisUtterance(text) : null;
      
      if (utterance) {
        utterance.onend = () => {
          setAgentSpeaking(false);
        };
      } else {
        // Fallback: assume speech ends after text length-based delay
        setTimeout(() => {
          setAgentSpeaking(false);
        }, Math.max(2000, text.length * 100));
      }
    }
  } else {
    originalSpeakText(text);
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
