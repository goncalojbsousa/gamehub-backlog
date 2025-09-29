'use client';

import { useState } from 'react';

/**
 * SecuritySettings component - Administrative security management interface
 * Provides comprehensive security monitoring, testing, and management capabilities
 * Includes security feature status, automated security tests, and recommendations
 * Used for maintaining platform security and monitoring protection mechanisms
 * 
 * @returns JSX element representing the complete security settings interface
 */
export const SecuritySettings: React.FC = () => {
  // State management for security test operations
  const [isLoading, setIsLoading] = useState(false);

  // Configuration for active security features
  const securityFeatures = [
    {
      title: 'XSS Protection',
      description: 'DOMPurify sanitization for all user-generated content',
      status: 'Active',
      statusColor: 'text-green-600',
      icon: '🛡️'
    },
    {
      title: 'Input Validation',
      description: 'Server-side validation with Zod schemas',
      status: 'Active',
      statusColor: 'text-green-600',
      icon: '✅'
    },
    {
      title: 'Role-Based Access Control',
      description: 'Admin-only actions with server-side verification',
      status: 'Active',
      statusColor: 'text-green-600',
      icon: '🔐'
    },
    {
      title: 'User Banning System',
      description: 'Complete account suspension with data cleanup',
      status: 'Active',
      statusColor: 'text-green-600',
      icon: '🚫'
    },
    {
      title: 'Content Sanitization',
      description: 'Automatic removal of dangerous HTML/JavaScript',
      status: 'Active',
      statusColor: 'text-green-600',
      icon: '🧹'
    },
    {
      title: 'Session Management',
      description: 'Secure authentication with NextAuth.js',
      status: 'Active',
      statusColor: 'text-green-600',
      icon: '🔑'
    }
  ];

  // Configuration for security test cases
  const securityTests = [
    {
      name: 'XSS Script Injection',
      description: 'Test for <script> tag injection',
      testCode: '<script>alert("XSS")</script>',
      expected: 'Blocked and sanitized'
    },
    {
      name: 'JavaScript Protocol',
      description: 'Test for javascript: protocol in links',
      testCode: '<a href="javascript:alert(\'XSS\')">Click</a>',
      expected: 'Protocol removed'
    },
    {
      name: 'Event Handlers',
      description: 'Test for onclick, onerror handlers',
      testCode: '<img src="x" onerror="alert(\'XSS\')" />',
      expected: 'Event handlers removed'
    },
    {
      name: 'Iframe Injection',
      description: 'Test for iframe tag injection',
      testCode: '<iframe src="http://malicious.com"></iframe>',
      expected: 'Iframe tag removed'
    }
  ];

  /**
   * Runs a security test against the platform's sanitization system
   * Sends test content to the security API and displays results
   * 
   * @param testCode - The malicious code to test against sanitization
   */
  const runSecurityTest = async (testCode: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/testSecurity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: testCode })
      });

      const result = await response.json();
      
      if (result.success) {
        alert(`Test passed! Sanitized content: ${result.sanitizedContent}`);
      } else {
        alert(`Test failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Error running security test:', error);
      alert('Error running security test');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-color_text mb-4">Security Settings</h2>
        <p className="text-color_text_sec">
          Monitor and manage security features and test protection mechanisms
        </p>
      </div>

      {/* Security features overview */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-color_text mb-4">Active Security Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {securityFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-color_main rounded-lg p-4 border border-border_detail"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{feature.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-color_text">{feature.title}</h4>
                    <span className={`text-sm font-medium ${feature.statusColor}`}>
                      {feature.status}
                    </span>
                  </div>
                  <p className="text-sm text-color_text_sec">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security testing section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-color_text mb-4">Security Tests</h3>
        <div className="space-y-4">
          {securityTests.map((test, index) => (
            <div
              key={index}
              className="bg-color_main rounded-lg p-4 border border-border_detail"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-color_text mb-1">{test.name}</h4>
                  <p className="text-sm text-color_text_sec mb-2">{test.description}</p>
                  {/* Test code display */}
                  <div className="bg-color_sec rounded p-2 mb-3">
                    <code className="text-xs text-color_text_sec">{test.testCode}</code>
                  </div>
                  <p className="text-xs text-color_text_sec">
                    Expected: <span className="font-medium text-green-600">{test.expected}</span>
                  </p>
                </div>
                {/* Test execution button */}
                <button
                  onClick={() => runSecurityTest(test.testCode)}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {isLoading ? 'Testing...' : 'Run Test'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security recommendations section */}
      <div>
        <h3 className="text-lg font-semibold text-color_text mb-4">Security Recommendations</h3>
        <div className="bg-color_main rounded-lg p-4 border border-border_detail">
          <div className="space-y-3">
            {/* Regular security audits recommendation */}
            <div className="flex items-start gap-3">
              <span className="text-yellow-500 text-lg">⚠️</span>
              <div>
                <h4 className="font-medium text-color_text">Regular Security Audits</h4>
                <p className="text-sm text-color_text_sec">
                  Conduct periodic security reviews and penetration testing
                </p>
              </div>
            </div>
            
            {/* User activity monitoring recommendation */}
            <div className="flex items-start gap-3">
              <span className="text-blue-500 text-lg">📊</span>
              <div>
                <h4 className="font-medium text-color_text">Monitor User Activity</h4>
                <p className="text-sm text-color_text_sec">
                  Track suspicious patterns and unusual user behavior
                </p>
              </div>
            </div>
            
            {/* Dependency updates recommendation */}
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-lg">🔄</span>
              <div>
                <h4 className="font-medium text-color_text">Keep Dependencies Updated</h4>
                <p className="text-sm text-color_text_sec">
                  Regularly update all packages and dependencies
                </p>
              </div>
            </div>
            
            {/* Backup strategy recommendation */}
            <div className="flex items-start gap-3">
              <span className="text-purple-500 text-lg">🔒</span>
              <div>
                <h4 className="font-medium text-color_text">Backup Strategy</h4>
                <p className="text-sm text-color_text_sec">
                  Implement regular database backups and disaster recovery plans
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 