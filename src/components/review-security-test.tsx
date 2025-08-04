'use client';

import { useState } from 'react';
import { validateReviewContent, sanitizeReviewForDisplay } from '@/src/utils/sanitizeReview';

export const ReviewSecurityTest: React.FC = () => {
  const [testContent, setTestContent] = useState('');
  const [validationResult, setValidationResult] = useState<any>(null);
  const [sanitizedContent, setSanitizedContent] = useState('');

  const testCases = [
    {
      name: 'XSS Script Tag',
      content: '<script>alert("XSS")</script>Hello World'
    },
    {
      name: 'JavaScript Protocol',
      content: '<a href="javascript:alert(\'XSS\')">Click me</a>'
    },
    {
      name: 'Event Handler',
      content: '<img src="x" onerror="alert(\'XSS\')" />'
    },
    {
      name: 'Iframe Injection',
      content: '<iframe src="http://malicious.com"></iframe>'
    },
    {
      name: 'Safe HTML',
      content: '<p>This is <strong>safe</strong> HTML with <em>formatting</em>.</p>'
    },
    {
      name: 'Mixed Content',
      content: '<p>Safe content</p><script>alert("XSS")</script><p>More safe content</p>'
    }
  ];

  const runTest = (content: string) => {
    setTestContent(content);
    
    // Test validation
    const validation = validateReviewContent(content);
    setValidationResult(validation);
    
    // Test sanitization for display
    const sanitized = sanitizeReviewForDisplay(content);
    setSanitizedContent(sanitized);
  };

  return (
    <div className="p-6 bg-color_sec rounded-xl border border-border_detail">
      <h2 className="text-2xl font-bold text-color_text mb-4">Review Security Test</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-color_text mb-3">Test Cases</h3>
          <div className="space-y-2">
            {testCases.map((testCase, index) => (
              <button
                key={index}
                onClick={() => runTest(testCase.content)}
                className="w-full text-left p-3 bg-color_main rounded-lg border border-border_detail hover:bg-color_hover transition-colors"
              >
                <div className="font-medium text-color_text">{testCase.name}</div>
                <div className="text-xs text-color_text_sec mt-1 truncate">
                  {testCase.content}
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-color_text mb-3">Results</h3>
          
          {testContent && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-color_text mb-2">Original Content:</h4>
                <div className="p-3 bg-color_main rounded-lg border border-border_detail text-sm">
                  <pre className="whitespace-pre-wrap text-color_text">{testContent}</pre>
                </div>
              </div>
              
              {validationResult && (
                <div>
                  <h4 className="font-medium text-color_text mb-2">Validation Result:</h4>
                  <div className="p-3 bg-color_main rounded-lg border border-border_detail">
                    <div className="text-sm">
                      <div className="mb-2">
                        <span className="font-medium">Valid: </span>
                        <span className={validationResult.isValid ? 'text-green-600' : 'text-red-600'}>
                          {validationResult.isValid ? 'Yes' : 'No'}
                        </span>
                      </div>
                      {validationResult.errors.length > 0 && (
                        <div>
                          <span className="font-medium">Errors:</span>
                          <ul className="list-disc list-inside mt-1 text-red-600">
                            {validationResult.errors.map((error: string, index: number) => (
                              <li key={index}>{error}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {sanitizedContent && (
                <div>
                  <h4 className="font-medium text-color_text mb-2">Sanitized Content (Safe to Display):</h4>
                  <div className="p-3 bg-color_main rounded-lg border border-border_detail">
                    <div 
                      className="text-sm text-color_text"
                      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 