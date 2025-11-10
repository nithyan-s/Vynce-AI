/**
 * VynceAI Extension - Mode Selection Script
 * Handles first-time mode selection for user preference
 */

// Storage keys
const MODE_SELECTED_KEY = 'vynceai_mode_selected';
const PREFERRED_MODE_KEY = 'vynceai_preferred_mode';

// Initialize
document.addEventListener('DOMContentLoaded', init);

function init() {
  console.log('Mode selection initialized');
  
  // Add click handlers to mode cards and buttons
  const modeCards = document.querySelectorAll('.mode-card');
  const selectBtns = document.querySelectorAll('.select-mode-btn');
  
  modeCards.forEach(card => {
    card.addEventListener('click', () => handleCardClick(card));
  });
  
  selectBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const mode = btn.getAttribute('data-mode');
      selectMode(mode);
    });
  });
}

/**
 * Handle mode card click to preview selection
 */
function handleCardClick(card) {
  // Remove selected class from all cards
  document.querySelectorAll('.mode-card').forEach(c => {
    c.classList.remove('selected');
  });
  
  // Add selected class to clicked card
  card.classList.add('selected');
}

/**
 * Select and save mode preference
 */
async function selectMode(mode) {
  console.log('Mode selected:', mode);
  
  // Get the button
  const btn = document.querySelector(`.select-mode-btn[data-mode="${mode}"]`);
  
  // Show loading state
  btn.classList.add('loading');
  btn.disabled = true;
  
  try {
    // Save mode preference to storage
    await chrome.storage.local.set({
      [MODE_SELECTED_KEY]: true,
      [PREFERRED_MODE_KEY]: mode
    });
    
    console.log('Mode saved successfully:', mode);
    
    // Show success feedback
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Redirect to main popup
    window.location.href = 'popup.html';
    
  } catch (error) {
    console.error('Error saving mode:', error);
    
    // Remove loading state
    btn.classList.remove('loading');
    btn.disabled = false;
    
    // Show error message
    alert('Failed to save mode preference. Please try again.');
  }
}

/**
 * Animate cards on load
 */
function animateCards() {
  const cards = document.querySelectorAll('.mode-card');
  
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.style.animation = 'cardAppear 0.5s ease forwards';
    }, index * 100);
  });
}

// Run animations
animateCards();
