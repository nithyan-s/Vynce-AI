/**
 * VynceAI - Advanced Automation Engine
 * Handles data injection and webpage manipulation
 */

// Prevent multiple declarations
if (typeof window.AutomationEngine === 'undefined') {

class AutomationEngine {
  constructor() {
    this.timeout = 10000; // 10 second timeout for element detection
  }

  /**
   * Wait for an element to appear in the DOM
   * @param {string|Function} selector - CSS selector or function that returns element
   * @param {number} timeout - Maximum time to wait in ms
   * @returns {Promise<Element>}
   */
  async waitForElement(selector, timeout = this.timeout) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();

      // Check if element already exists
      const checkElement = () => {
        const element = typeof selector === 'function' 
          ? selector() 
          : document.querySelector(selector);
        
        if (element) {
          return element;
        }
        return null;
      };

      const existingElement = checkElement();
      if (existingElement) {
        resolve(existingElement);
        return;
      }

      // Use MutationObserver to watch for element
      const observer = new MutationObserver(() => {
        const element = checkElement();
        if (element) {
          observer.disconnect();
          resolve(element);
        } else if (Date.now() - startTime > timeout) {
          observer.disconnect();
          reject(new Error(`Element not found within ${timeout}ms: ${selector}`));
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true
      });

      // Also check periodically
      const interval = setInterval(() => {
        const element = checkElement();
        if (element) {
          clearInterval(interval);
          observer.disconnect();
          resolve(element);
        } else if (Date.now() - startTime > timeout) {
          clearInterval(interval);
          observer.disconnect();
          reject(new Error(`Element not found within ${timeout}ms: ${selector}`));
        }
      }, 100);
    });
  }

  /**
   * Set value on native input element (React/Vue compatible)
   * @param {HTMLElement} element - Input element
   * @param {string} value - Value to set
   */
  setNativeValue(element, value) {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value'
    ).set;

    const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      'value'
    ).set;

    if (element instanceof HTMLInputElement) {
      nativeInputValueSetter.call(element, value);
    } else if (element instanceof HTMLTextAreaElement) {
      nativeTextAreaValueSetter.call(element, value);
    } else {
      element.value = value;
    }

    // Dispatch events to trigger React/Vue listeners
    this.dispatchEvents(element);
  }

  /**
   * Dispatch all necessary events for input changes
   * @param {HTMLElement} element
   */
  dispatchEvents(element) {
    const events = [
      new Event('input', { bubbles: true, cancelable: true }),
      new Event('change', { bubbles: true, cancelable: true }),
      new KeyboardEvent('keydown', { bubbles: true, cancelable: true }),
      new KeyboardEvent('keypress', { bubbles: true, cancelable: true }),
      new KeyboardEvent('keyup', { bubbles: true, cancelable: true })
    ];

    events.forEach(event => element.dispatchEvent(event));
  }

  /**
   * Simulate Enter key press
   * @param {HTMLElement} element
   */
  pressEnter(element) {
    const enterEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      which: 13,
      bubbles: true,
      cancelable: true
    });
    
    element.dispatchEvent(enterEvent);

    // Also dispatch keypress and keyup
    const events = ['keypress', 'keyup'].map(type => 
      new KeyboardEvent(type, {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        which: 13,
        bubbles: true,
        cancelable: true
      })
    );

    events.forEach(event => element.dispatchEvent(event));
  }

  /**
   * Click an element
   * @param {HTMLElement} element
   */
  clickElement(element) {
    // Scroll element into view
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Wait a bit for scroll
    setTimeout(() => {
      element.click();
      element.dispatchEvent(new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      }));
    }, 300);
  }

  /**
   * YouTube Search Automation
   * @param {string} query - Search query
   * @returns {Promise<Object>}
   */
  async searchYouTube(query) {
    try {
      console.log('[Automation] Starting YouTube search:', query);

      // Multiple selector strategies for YouTube search
      const selectors = [
        'input#search',
        'input[name="search_query"]',
        'input[aria-label*="Search"]',
        '#search-input input',
        'ytd-searchbox input'
      ];

      let searchInput = null;
      
      // Try to find search input with multiple selectors
      for (const selector of selectors) {
        searchInput = document.querySelector(selector);
        if (searchInput) {
          console.log('[Automation] Found search input with selector:', selector);
          break;
        }
      }

      if (!searchInput) {
        // Wait for element to appear
        console.log('[Automation] Search input not found, waiting...');
        searchInput = await this.waitForElement(selectors[0], 5000);
      }

      if (!searchInput) {
        throw new Error('YouTube search input not found');
      }

      // Focus the input
      searchInput.focus();

      // Set the search query
      this.setNativeValue(searchInput, query);

      console.log('[Automation] Search query set:', query);

      // Wait a bit for the input to register
      await new Promise(resolve => setTimeout(resolve, 500));

      // Try to find and click search button
      const searchButton = document.querySelector('#search-icon-legacy') ||
                          document.querySelector('button[aria-label*="Search"]') ||
                          document.querySelector('#search-form button[type="submit"]');

      if (searchButton) {
        console.log('[Automation] Clicking search button');
        this.clickElement(searchButton);
      } else {
        // Fallback: press Enter
        console.log('[Automation] Search button not found, pressing Enter');
        this.pressEnter(searchInput);
      }

      return {
        success: true,
        message: `YouTube search completed for: "${query}"`,
        action: 'youtube_search',
        query: query
      };

    } catch (error) {
      console.error('[Automation] YouTube search failed:', error);
      return {
        success: false,
        message: `Failed to search YouTube: ${error.message}`,
        error: error.message
      };
    }
  }

  /**
   * Google Forms Auto-fill
   * @param {Object} formData - Key-value pairs for form fields
   * @returns {Promise<Object>}
   */
  async fillGoogleForm(formData) {
    try {
      console.log('[Automation] Starting Google Form fill:', formData);

      const results = [];

      // Find all form inputs
      const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea');

      for (const [key, value] of Object.entries(formData)) {
        let filled = false;

        // Strategy 1: Find by label text
        const labels = Array.from(document.querySelectorAll('label, .freebirdFormviewerComponentsQuestionBaseTitle'));
        
        for (const label of labels) {
          const labelText = label.textContent.toLowerCase().trim();
          const searchKey = key.toLowerCase().trim();

          if (labelText.includes(searchKey) || searchKey.includes(labelText)) {
            // Find associated input
            let input = null;

            // Try getting input by 'for' attribute
            if (label.htmlFor) {
              input = document.getElementById(label.htmlFor);
            }

            // Try finding input within same container
            if (!input) {
              const container = label.closest('.freebirdFormviewerComponentsQuestionBaseRoot') ||
                              label.closest('div[role="listitem"]') ||
                              label.closest('.form-group');
              
              if (container) {
                input = container.querySelector('input, textarea');
              }
            }

            // Try next sibling
            if (!input) {
              let sibling = label.nextElementSibling;
              while (sibling && !input) {
                input = sibling.querySelector('input, textarea') || 
                       (sibling.matches('input, textarea') ? sibling : null);
                sibling = sibling.nextElementSibling;
              }
            }

            if (input) {
              console.log(`[Automation] Filling field "${key}" with value:`, value);
              input.focus();
              this.setNativeValue(input, value);
              filled = true;
              results.push({ field: key, status: 'filled', value });
              break;
            }
          }
        }

        // Strategy 2: Find by placeholder
        if (!filled) {
          for (const input of inputs) {
            const placeholder = (input.placeholder || '').toLowerCase();
            if (placeholder.includes(key.toLowerCase())) {
              console.log(`[Automation] Filling field "${key}" by placeholder:`, value);
              input.focus();
              this.setNativeValue(input, value);
              filled = true;
              results.push({ field: key, status: 'filled', value });
              break;
            }
          }
        }

        // Strategy 3: Find by aria-label
        if (!filled) {
          for (const input of inputs) {
            const ariaLabel = (input.getAttribute('aria-label') || '').toLowerCase();
            if (ariaLabel.includes(key.toLowerCase())) {
              console.log(`[Automation] Filling field "${key}" by aria-label:`, value);
              input.focus();
              this.setNativeValue(input, value);
              filled = true;
              results.push({ field: key, status: 'filled', value });
              break;
            }
          }
        }

        if (!filled) {
          console.warn(`[Automation] Could not find field for: ${key}`);
          results.push({ field: key, status: 'not_found', value });
        }
      }

      const successCount = results.filter(r => r.status === 'filled').length;
      const totalFields = Object.keys(formData).length;

      return {
        success: successCount > 0,
        message: `Filled ${successCount} out of ${totalFields} fields`,
        action: 'google_form_fill',
        results: results,
        filledCount: successCount,
        totalFields: totalFields
      };

    } catch (error) {
      console.error('[Automation] Google Form fill failed:', error);
      return {
        success: false,
        message: `Failed to fill form: ${error.message}`,
        error: error.message
      };
    }
  }

  /**
   * Submit current form
   * @returns {Promise<Object>}
   */
  async submitForm() {
    try {
      console.log('[Automation] Attempting to submit form');

      // Find submit button with various strategies
      const submitButton = 
        document.querySelector('button[type="submit"]') ||
        document.querySelector('input[type="submit"]') ||
        document.querySelector('button[aria-label*="Submit"]') ||
        document.querySelector('.freebirdFormviewerViewNavigationSubmitButton') ||
        Array.from(document.querySelectorAll('button, input[type="button"]'))
          .find(btn => /submit|send|next/i.test(btn.textContent || btn.value));

      if (submitButton) {
        console.log('[Automation] Found submit button, clicking');
        this.clickElement(submitButton);

        return {
          success: true,
          message: 'Form submitted successfully',
          action: 'submit_form'
        };
      } else {
        return {
          success: false,
          message: 'Submit button not found',
          action: 'submit_form'
        };
      }

    } catch (error) {
      console.error('[Automation] Form submission failed:', error);
      return {
        success: false,
        message: `Failed to submit form: ${error.message}`,
        error: error.message
      };
    }
  }

  /**
   * Generic click action
   * @param {string} selector - Element selector or description
   * @returns {Promise<Object>}
   */
  async clickAction(selector) {
    try {
      console.log('[Automation] Attempting to click:', selector);

      let element = null;

      // Try as CSS selector first
      element = document.querySelector(selector);

      // Try finding by text content
      if (!element) {
        const buttons = Array.from(document.querySelectorAll('button, a, input[type="button"], input[type="submit"]'));
        element = buttons.find(btn => 
          (btn.textContent || btn.value || '').toLowerCase().includes(selector.toLowerCase())
        );
      }

      if (element) {
        console.log('[Automation] Element found, clicking');
        this.clickElement(element);

        return {
          success: true,
          message: `Clicked element: ${selector}`,
          action: 'click'
        };
      } else {
        return {
          success: false,
          message: `Element not found: ${selector}`,
          action: 'click'
        };
      }

    } catch (error) {
      console.error('[Automation] Click action failed:', error);
      return {
        success: false,
        message: `Failed to click: ${error.message}`,
        error: error.message
      };
    }
  }

  /**
   * Generic fill action
   * @param {string} selector - Input selector or description
   * @param {string} value - Value to fill
   * @returns {Promise<Object>}
   */
  async fillAction(selector, value) {
    try {
      console.log('[Automation] Attempting to fill:', selector, 'with:', value);

      let input = null;

      // Try as CSS selector
      input = document.querySelector(selector);

      // Try finding by placeholder
      if (!input) {
        input = Array.from(document.querySelectorAll('input, textarea'))
          .find(inp => (inp.placeholder || '').toLowerCase().includes(selector.toLowerCase()));
      }

      // Try finding by label
      if (!input) {
        const labels = Array.from(document.querySelectorAll('label'));
        const matchingLabel = labels.find(label => 
          label.textContent.toLowerCase().includes(selector.toLowerCase())
        );
        
        if (matchingLabel) {
          input = matchingLabel.htmlFor 
            ? document.getElementById(matchingLabel.htmlFor)
            : matchingLabel.querySelector('input, textarea');
        }
      }

      if (input) {
        console.log('[Automation] Input found, filling');
        input.focus();
        this.setNativeValue(input, value);

        return {
          success: true,
          message: `Filled "${selector}" with "${value}"`,
          action: 'fill'
        };
      } else {
        return {
          success: false,
          message: `Input not found: ${selector}`,
          action: 'fill'
        };
      }

    } catch (error) {
      console.error('[Automation] Fill action failed:', error);
      return {
        success: false,
        message: `Failed to fill: ${error.message}`,
        error: error.message
      };
    }
  }
}

// Store in window to prevent re-declaration
window.AutomationEngine = AutomationEngine;

} // End of AutomationEngine declaration guard
else {
  console.log('[Automation Engine] Already loaded, skipping re-initialization');
}

// Initialize engine only if not already initialized
if (typeof window.automationEngine === 'undefined') {
  window.automationEngine = new window.AutomationEngine();
  
  // Listen for automation commands
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'AUTOMATION_COMMAND') {
      console.log('[Automation] Received command:', request.command);

      handleAutomationCommand(request.command)
        .then(result => sendResponse({ success: true, data: result }))
        .catch(error => sendResponse({ success: false, error: error.message }));

      return true; // Keep message channel open for async response
    }
  });

  /**
   * Handle automation command and route to appropriate function
   * @param {Object} command - Parsed command object
   * @returns {Promise<Object>}
   */
  async function handleAutomationCommand(command) {
    const { action, params } = command;

    switch (action) {
      case 'youtube_search':
        return await window.automationEngine.searchYouTube(params.query);

      case 'google_form_fill':
        return await window.automationEngine.fillGoogleForm(params.formData);

      case 'submit_form':
        return await window.automationEngine.submitForm();

      case 'click':
        return await window.automationEngine.clickAction(params.selector);

      case 'fill':
        return await window.automationEngine.fillAction(params.selector, params.value);

      default:
        return {
          success: false,
          message: `Unknown action: ${action}`,
          action: action
        };
    }
  }

  console.log('[Automation Engine] Loaded and ready');
} else {
  console.log('[Automation Engine] Already initialized, reusing existing instance');
}
