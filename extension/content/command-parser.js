/**
 * VynceAI - AI Command Parser
 * Parses natural language commands into structured automation actions
 */

// Prevent multiple declarations
if (typeof window.AICommandParser === 'undefined') {

class AICommandParser {
  constructor() {
    this.patterns = this.initializePatterns();
  }

  /**
   * Initialize command patterns
   * @returns {Array<Object>}
   */
  initializePatterns() {
    return [
      // YouTube Search Patterns
      {
        regex: /(?:search|find|look\s+for|lookup)\s+(?:for\s+)?(.+?)\s+on\s+(?:youtube|yt)/i,
        action: 'youtube_search',
        extract: (match) => ({ query: match[1].trim() })
      },
      {
        regex: /youtube\s+search[:\s]+(.+)/i,
        action: 'youtube_search',
        extract: (match) => ({ query: match[1].trim() })
      },

      // Google Form Fill Patterns
      {
        regex: /fill\s+(?:this\s+)?(?:google\s+)?form\s+with[:\s]+(.+)/i,
        action: 'google_form_fill',
        extract: (match) => {
          const formData = this.parseFormData(match[1]);
          return { formData };
        }
      },
      {
        regex: /complete\s+(?:the\s+)?form[:\s]+(.+)/i,
        action: 'google_form_fill',
        extract: (match) => {
          const formData = this.parseFormData(match[1]);
          return { formData };
        }
      },
      {
        regex: /autofill\s+(?:form\s+)?(?:with\s+)?[:\s]*(.+)/i,
        action: 'google_form_fill',
        extract: (match) => {
          const formData = this.parseFormData(match[1]);
          return { formData };
        }
      },

      // Submit Form Patterns
      {
        regex: /submit\s+(?:the\s+)?(?:this\s+)?form/i,
        action: 'submit_form',
        extract: () => ({})
      },

      // Generic Click Patterns
      {
        regex: /click\s+(?:on\s+)?(?:the\s+)?(.+?)\s+button/i,
        action: 'click',
        extract: (match) => ({ selector: match[1].trim() })
      },
      {
        regex: /click\s+(.+)/i,
        action: 'click',
        extract: (match) => ({ selector: match[1].trim() })
      },
      {
        regex: /press\s+(?:the\s+)?(.+?)\s+button/i,
        action: 'click',
        extract: (match) => ({ selector: match[1].trim() })
      },

      // Generic Fill Patterns
      {
        regex: /fill\s+(?:the\s+)?(.+?)\s+(?:field|box|input)\s+with\s+(.+)/i,
        action: 'fill',
        extract: (match) => ({ 
          selector: match[1].trim(), 
          value: match[2].trim() 
        })
      },
      {
        regex: /type\s+(.+?)\s+(?:in|into)\s+(?:the\s+)?(.+)/i,
        action: 'fill',
        extract: (match) => ({ 
          selector: match[2].trim(), 
          value: match[1].trim() 
        })
      },
      {
        regex: /enter\s+(.+?)\s+(?:in|into)\s+(?:the\s+)?(.+)/i,
        action: 'fill',
        extract: (match) => ({ 
          selector: match[2].trim(), 
          value: match[1].trim() 
        })
      }
    ];
  }

  /**
   * Parse form data from natural language
   * Supports formats:
   * - "name: John, email: test@gmail.com"
   * - "name=John, email=test@gmail.com"
   * - "name John, email test@gmail.com"
   * @param {string} text
   * @returns {Object}
   */
  parseFormData(text) {
    const formData = {};

    // Try colon format: "name: John, email: test@gmail.com"
    let matches = text.match(/(\w+)\s*:\s*([^,]+)/g);
    
    if (matches) {
      matches.forEach(match => {
        const [key, value] = match.split(':').map(s => s.trim());
        if (key && value) {
          formData[key] = value;
        }
      });
      return formData;
    }

    // Try equals format: "name=John, email=test@gmail.com"
    matches = text.match(/(\w+)\s*=\s*([^,]+)/g);
    
    if (matches) {
      matches.forEach(match => {
        const [key, value] = match.split('=').map(s => s.trim());
        if (key && value) {
          formData[key] = value;
        }
      });
      return formData;
    }

    // Try space-separated pairs: "name John email test@gmail.com"
    const words = text.split(/\s+/);
    for (let i = 0; i < words.length - 1; i += 2) {
      const key = words[i].toLowerCase().replace(/[^a-z0-9]/g, '');
      const value = words[i + 1];
      if (key && value) {
        formData[key] = value;
      }
    }

    return formData;
  }

  /**
   * Parse natural language command into structured action
   * @param {string} command - Natural language command
   * @returns {Object|null} - { action, params } or null if no match
   */
  parseCommand(command) {
    const trimmedCommand = command.trim();

    // Try each pattern
    for (const pattern of this.patterns) {
      const match = trimmedCommand.match(pattern.regex);
      
      if (match) {
        const params = pattern.extract(match);
        
        return {
          action: pattern.action,
          params: params,
          originalCommand: command,
          confidence: 1.0
        };
      }
    }

    return null;
  }

  /**
   * Parse command using AI backend (fallback)
   * @param {string} command
   * @returns {Promise<Object>}
   */
  async parseWithAI(command) {
    try {
      // Send to background script for AI parsing
      const response = await chrome.runtime.sendMessage({
        type: 'PARSE_AUTOMATION_COMMAND',
        command: command
      });

      if (response.success && response.parsedCommand) {
        return response.parsedCommand;
      }

      return null;

    } catch (error) {
      console.error('[Command Parser] AI parsing failed:', error);
      return null;
    }
  }

  /**
   * Parse command with fallback to AI
   * @param {string} command
   * @returns {Promise<Object>}
   */
  async parse(command) {
    // Try regex patterns first (fast)
    const regexResult = this.parseCommand(command);
    
    if (regexResult) {
      console.log('[Command Parser] Parsed with regex:', regexResult);
      return regexResult;
    }

    // Fallback to AI parsing (slower but more flexible)
    console.log('[Command Parser] Trying AI parsing...');
    const aiResult = await this.parseWithAI(command);
    
    if (aiResult) {
      console.log('[Command Parser] Parsed with AI:', aiResult);
      return aiResult;
    }

    // No match found
    return {
      action: 'unknown',
      params: {},
      originalCommand: command,
      confidence: 0,
      error: 'Could not parse command'
    };
  }

  /**
   * Get command suggestions based on current page
   * @returns {Array<string>}
   */
  getCommandSuggestions() {
    const suggestions = [
      'Search for [query] on YouTube',
      'Fill form with name: [name], email: [email]',
      'Click the [button name] button',
      'Submit the form',
      'Fill the [field name] with [value]'
    ];

    // Add page-specific suggestions
    const url = window.location.href;
    
    if (url.includes('youtube.com')) {
      suggestions.unshift(
        'Search for lo-fi music on YouTube',
        'Find cat videos on YouTube'
      );
    } else if (url.includes('google.com/forms')) {
      suggestions.unshift(
        'Fill form with name: John Doe, email: test@gmail.com',
        'Submit this form'
      );
    }

    return suggestions;
  }
}

// Store in window to prevent re-declaration
window.AICommandParser = AICommandParser;

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AICommandParser;
}

} // End of AICommandParser declaration guard
else {
  console.log('[Command Parser] Already loaded, skipping re-initialization');
}

// Initialize parser only if not already initialized
if (typeof window.commandParser === 'undefined') {
  window.commandParser = new window.AICommandParser();
  
  // Listen for command parsing requests
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'PARSE_COMMAND') {
      console.log('[Command Parser] Received parse request:', request.command);

      window.commandParser.parse(request.command)
        .then(parsedCommand => {
          sendResponse({
            success: true,
            parsedCommand: parsedCommand
          });
        })
        .catch(error => {
          sendResponse({
            success: false,
            error: error.message
          });
        });

      return true; // Keep message channel open for async response
    }
  });

  console.log('[Command Parser] Loaded and ready');
} else {
  console.log('[Command Parser] Already initialized, reusing existing instance');
}
