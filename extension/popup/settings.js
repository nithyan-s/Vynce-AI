/**
 * VynceAI Extension - Settings Script
 * Handles settings page functionality
 */

// Storage keys
const MODE_SELECTED_KEY = 'vynceai_mode_selected';
const PREFERRED_MODE_KEY = 'vynceai_preferred_mode';
const AUTO_SPEAK_KEY = 'vynceai_auto_speak';
const COMPACT_MODE_KEY = 'vynceai_compact_mode';
const MEMORY_KEY = 'vynceai_memory';

// DOM Elements
let backBtn;
let modeOptions;
let autoSpeakToggle;
let compactModeToggle;
let viewMemoryBtn;
let clearMemoryBtn;
let rateExtensionBtn;
let feedbackBtn;
let memoryCountEl;
let memorySizeEl;
let clearMemoryModal;
let cancelClearBtn;
let confirmClearBtn;
let modalMemoryCount;
let modalMemorySize;

// Initialize
document.addEventListener('DOMContentLoaded', init);

async function init() {
  console.log('Settings page initialized');
  
  // Get DOM elements
  backBtn = document.getElementById('back-btn');
  modeOptions = document.querySelectorAll('input[name="ai-mode"]');
  autoSpeakToggle = document.getElementById('auto-speak-toggle');
  compactModeToggle = document.getElementById('compact-mode-toggle');
  viewMemoryBtn = document.getElementById('view-memory-btn');
  clearMemoryBtn = document.getElementById('clear-memory-btn');
  rateExtensionBtn = document.getElementById('rate-extension-btn');
  feedbackBtn = document.getElementById('feedback-btn');
  memoryCountEl = document.getElementById('memory-count');
  memorySizeEl = document.getElementById('memory-size');
  clearMemoryModal = document.getElementById('clear-memory-modal');
  cancelClearBtn = document.getElementById('cancel-clear-btn');
  confirmClearBtn = document.getElementById('confirm-clear-btn');
  modalMemoryCount = document.getElementById('modal-memory-count');
  modalMemorySize = document.getElementById('modal-memory-size');
  
  // Load settings
  await loadSettings();
  
  // Setup event listeners
  setupEventListeners();
  
  // Load memory stats
  await updateMemoryStats();
}

/**
 * Load settings from storage
 */
async function loadSettings() {
  try {
    const result = await chrome.storage.local.get([
      PREFERRED_MODE_KEY,
      AUTO_SPEAK_KEY,
      COMPACT_MODE_KEY
    ]);
    
    // Set mode
    const mode = result[PREFERRED_MODE_KEY] || 'site-specific';
    const modeRadio = document.getElementById(`mode-${mode}`);
    if (modeRadio) {
      modeRadio.checked = true;
    }
    
    // Set toggles
    autoSpeakToggle.checked = result[AUTO_SPEAK_KEY] || false;
    compactModeToggle.checked = result[COMPACT_MODE_KEY] || false;
    
    console.log('Settings loaded:', result);
  } catch (error) {
    console.error('Error loading settings:', error);
  }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Back button
  backBtn.addEventListener('click', () => {
    window.location.href = 'popup.html';
  });
  
  // Mode selection
  modeOptions.forEach(radio => {
    radio.addEventListener('change', handleModeChange);
  });
  
  // Toggles
  autoSpeakToggle.addEventListener('change', handleAutoSpeakChange);
  compactModeToggle.addEventListener('change', handleCompactModeChange);
  
  // Memory buttons
  viewMemoryBtn.addEventListener('click', handleViewMemory);
  clearMemoryBtn.addEventListener('click', handleClearMemory);
  
  // Modal buttons
  cancelClearBtn.addEventListener('click', closeModal);
  confirmClearBtn.addEventListener('click', confirmClearMemory);
  
  // Click outside modal to close
  clearMemoryModal.addEventListener('click', (e) => {
    if (e.target === clearMemoryModal) {
      closeModal();
    }
  });
  
  // About buttons
  rateExtensionBtn.addEventListener('click', handleRateExtension);
  feedbackBtn.addEventListener('click', handleFeedback);
}

/**
 * Handle mode change
 */
async function handleModeChange(event) {
  const mode = event.target.value;
  
  try {
    await chrome.storage.local.set({
      [PREFERRED_MODE_KEY]: mode
    });
    
    console.log('Mode changed to:', mode);
    showSuccessMessage(`Switched to ${mode === 'site-specific' ? 'Site-Specific' : 'General'} Mode`);
  } catch (error) {
    console.error('Error changing mode:', error);
    alert('Failed to save mode preference');
  }
}

/**
 * Handle auto-speak toggle
 */
async function handleAutoSpeakChange(event) {
  const enabled = event.target.checked;
  
  try {
    await chrome.storage.local.set({
      [AUTO_SPEAK_KEY]: enabled
    });
    
    console.log('Auto-speak:', enabled);
    showSuccessMessage(`Auto-speak ${enabled ? 'enabled' : 'disabled'}`);
  } catch (error) {
    console.error('Error saving auto-speak setting:', error);
  }
}

/**
 * Handle compact mode toggle
 */
async function handleCompactModeChange(event) {
  const enabled = event.target.checked;
  
  try {
    await chrome.storage.local.set({
      [COMPACT_MODE_KEY]: enabled
    });
    
    console.log('Compact mode:', enabled);
    showSuccessMessage(`Compact mode ${enabled ? 'enabled' : 'disabled'}`);
  } catch (error) {
    console.error('Error saving compact mode setting:', error);
  }
}

/**
 * Update memory statistics
 */
async function updateMemoryStats() {
  try {
    const result = await chrome.storage.local.get([MEMORY_KEY]);
    const memory = result[MEMORY_KEY] || [];
    
    const count = memory.length;
    const size = JSON.stringify(memory).length;
    const sizeKB = (size / 1024).toFixed(1);
    
    memoryCountEl.textContent = count;
    memorySizeEl.textContent = `${sizeKB} KB`;
  } catch (error) {
    console.error('Error getting memory stats:', error);
    memoryCountEl.textContent = 'Error';
    memorySizeEl.textContent = 'Error';
  }
}

/**
 * Handle view memory
 */
function handleViewMemory() {
  // Go back to popup and open memory
  chrome.storage.local.set({ showMemoryOnLoad: true }, () => {
    window.location.href = 'popup.html';
  });
}

/**
 * Handle clear memory - show modal
 */
async function handleClearMemory() {
  try {
    // Update modal stats with current memory info
    const result = await chrome.storage.local.get([MEMORY_KEY]);
    const memory = result[MEMORY_KEY] || [];
    
    const count = memory.length;
    const size = JSON.stringify(memory).length;
    const sizeKB = (size / 1024).toFixed(1);
    
    modalMemoryCount.textContent = count;
    modalMemorySize.textContent = `${sizeKB} KB`;
    
    // Show modal
    clearMemoryModal.classList.add('active');
  } catch (error) {
    console.error('Error opening clear memory modal:', error);
  }
}

/**
 * Close modal
 */
function closeModal() {
  clearMemoryModal.classList.remove('active');
}

/**
 * Confirm clear memory
 */
async function confirmClearMemory() {
  try {
    await chrome.storage.local.remove(MEMORY_KEY);
    await updateMemoryStats();
    closeModal();
    showSuccessMessage('Memory cleared successfully');
  } catch (error) {
    console.error('Error clearing memory:', error);
    closeModal();
    alert('Failed to clear memory');
  }
}

/**
 * Handle rate extension
 */
function handleRateExtension() {
  // TODO: Open Chrome Web Store page
  alert('Rate Extension - Coming soon!\nWe appreciate your support!');
}

/**
 * Handle feedback
 */
function handleFeedback() {
  // TODO: Open feedback form or email
  alert('Feedback - Coming soon!\nContact: nithyan.dev@gmail.com');
}

/**
 * Show success message
 */
function showSuccessMessage(message) {
  const successDiv = document.createElement('div');
  successDiv.className = 'success-message';
  successDiv.textContent = message;
  
  document.body.appendChild(successDiv);
  
  setTimeout(() => {
    successDiv.remove();
  }, 3000);
}
