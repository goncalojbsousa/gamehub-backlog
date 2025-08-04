import DOMPurify from 'dompurify';

/**
 * Sanitizes review content to prevent XSS attacks (server-side)
 * @param content The review content to sanitize
 * @returns Sanitized content safe for display
 */
export const sanitizeReviewContent = (content: string): string => {
  if (!content) return '';
  
  // Server-side sanitization using regex patterns
  let sanitized = content;
  
  // Remove dangerous tags and their content
  const dangerousTags = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
    /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
    /<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi,
    /<input\b[^<]*(?:(?!<\/input>)<[^<]*)*>/gi,
    /<textarea\b[^<]*(?:(?!<\/textarea>)<[^<]*)*<\/textarea>/gi,
    /<select\b[^<]*(?:(?!<\/select>)<[^<]*)*<\/select>/gi,
    /<button\b[^<]*(?:(?!<\/button>)<[^<]*)*<\/button>/gi,
    /<link\b[^<]*(?:(?!<\/link>)<[^<]*)*>/gi,
    /<meta\b[^<]*(?:(?!<\/meta>)<[^<]*)*>/gi,
    /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi
  ];
  
  dangerousTags.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });
  
  // Remove dangerous attributes
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/vbscript:/gi, '');
  sanitized = sanitized.replace(/data:/gi, '');
  
  // Remove dangerous protocols from href and src
  sanitized = sanitized.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, '');
  sanitized = sanitized.replace(/src\s*=\s*["']javascript:[^"']*["']/gi, '');
  
  // Only allow safe tags
  const allowedTags = [
    'p', 'br', 'strong', 'em', 'u', 'i', 'b', 'ul', 'ol', 'li',
    'blockquote', 'code', 'pre', 'span', 'div'
  ];
  
  // Remove all tags except allowed ones
  const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g;
  sanitized = sanitized.replace(tagRegex, (match, tagName) => {
    const lowerTagName = tagName.toLowerCase();
    if (allowedTags.includes(lowerTagName)) {
      return match;
    }
    return '';
  });
  
  // Remove dangerous attributes from allowed tags
  const dangerousAttrs = [
    /on\w+\s*=\s*["'][^"']*["']/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /data:/gi
  ];
  
  dangerousAttrs.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });
  
  return sanitized;
};

/**
 * Validates review content before saving
 * @param content The review content to validate
 * @returns Object with validation result and sanitized content
 */
export const validateReviewContent = (content: string): {
  isValid: boolean;
  sanitizedContent: string;
  errors: string[];
} => {
  const errors: string[] = [];
  let sanitizedContent = '';

  // Check if content is provided
  if (!content || content.trim().length === 0) {
    errors.push('Review content cannot be empty');
    return { isValid: false, sanitizedContent: '', errors };
  }

  // Check length
  if (content.length > 2000) {
    errors.push('Review content cannot exceed 2000 characters');
    return { isValid: false, sanitizedContent: '', errors };
  }

  // Check for potentially dangerous patterns
  const dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
    /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
    /<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi,
    /<input\b[^<]*(?:(?!<\/input>)<[^<]*)*>/gi,
    /<textarea\b[^<]*(?:(?!<\/textarea>)<[^<]*)*<\/textarea>/gi,
    /<select\b[^<]*(?:(?!<\/select>)<[^<]*)*<\/select>/gi,
    /<button\b[^<]*(?:(?!<\/button>)<[^<]*)*<\/button>/gi,
    /<link\b[^<]*(?:(?!<\/link>)<[^<]*)*>/gi,
    /<meta\b[^<]*(?:(?!<\/meta>)<[^<]*)*>/gi,
    /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi,
    /<link\b[^<]*(?:(?!<\/link>)<[^<]*)*>/gi
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(content)) {
      errors.push('Review content contains potentially dangerous code');
      break;
    }
  }

  // If no dangerous patterns found, sanitize the content
  if (errors.length === 0) {
    sanitizedContent = sanitizeReviewContent(content);
    
    // Check if sanitization removed too much content
    if (sanitizedContent.trim().length < content.trim().length * 0.5) {
      errors.push('Review content was heavily modified during sanitization');
    }
  }

  return {
    isValid: errors.length === 0,
    sanitizedContent,
    errors
  };
};

/**
 * Sanitizes review content for display (client-side)
 * @param content The review content to sanitize for display
 * @returns Sanitized content safe for rendering
 */
export const sanitizeReviewForDisplay = (content: string): string => {
  if (!content) return '';
  
  // Check if we're in the browser environment
  if (typeof window !== 'undefined' && typeof DOMPurify !== 'undefined') {
    // Use DOMPurify in browser environment
    const config = {
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'u', 'i', 'b', 'ul', 'ol', 'li',
        'blockquote', 'code', 'pre', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
      ],
      ALLOWED_ATTR: [
        'class', 'id', 'style', 'title'
      ],
      ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
      KEEP_CONTENT: true,
      RETURN_DOM: false,
      RETURN_DOM_FRAGMENT: false,
      RETURN_TRUSTED_TYPE: false
    };

    return DOMPurify.sanitize(content, config);
  } else {
    // Fallback to server-side sanitization
    return sanitizeReviewContent(content);
  }
}; 