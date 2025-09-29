'use client';

import { useState } from 'react';
import { ChevronDownIcon } from '@/src/components/svg/navigation/chevron-down-icon';
import { ChevronUpIcon } from '@/src/components/svg/navigation/chevron-up-icon';
import { Navbar } from '@/src/components/navbar/navbar';
import { Footer } from '@/src/components/footer';

interface RoadmapItem {
  id: string;
  version: string;
  date: string;
  title: string;
  description: string;
  features: string[];
  improvements: string[];
  fixes: string[];
  status: 'completed' | 'in-progress' | 'planned';
  category: 'major' | 'minor' | 'patch';
}

const roadmapData: RoadmapItem[] = [
  {
    id: '3.0.0',
    version: '3.0.0',
    date: '2025-XX-XX',
    title: 'Future Features',
    description: 'Planned features for the next major version.',
    features: [
      'Social features and friend system',
      'Backlog export functionality',
      'Custom achievements system',
      'Integration with more gaming platforms',
      'Advanced game analytics and statistics',
      'Custom tags system',
      'Game recommendations based on preferences'
    ],
    improvements: [
      'Enhanced user dashboard with personalized insights',
      'Improved mobile experience',
      'Advanced filtering and search capabilities'
    ],
    fixes: [],
    status: 'planned',
    category: 'major'
  },
  {
    id: '2.0.0',
    version: '2.0.0',
    date: '2025-01-XX',
    title: 'Complete Platform Remaster',
    description: 'Major redesign and feature expansion with comprehensive user management and review system.',
    features: [
      'Complete design remasterization with modern UI/UX',
      'Advanced review system with text reviews and 1-5 star ratings',
      'Comprehensive administration dashboard',
      'User reporting system for reviews and profiles',
      'New authentication methods: Discord and Steam integration',
      'Enhanced user profile system with biography and privacy settings',
      'Public/private profile options',
      'User review history in profiles',
      'Admin ticket system for managing reports',
      'User ban/suspension system',
      'Updated Terms of Service and Privacy Policy',
      'New roadmap page for platform evolution tracking'
    ],
    improvements: [
      'Simplified backlog system with only 4 possible states',
      'Streamlined game status selection process',
      'Direct status selection from game cards without opening game page',
      'Remastered user profile with comprehensive editing options',
      'Enhanced home page with better onboarding for new users',
      'Improved navigation and user experience',
      'Better mobile responsiveness',
      'Optimized performance and loading times'
    ],
    fixes: [
      'Resolved various UI inconsistencies',
      'Fixed authentication edge cases',
      'Improved error handling and user feedback',
      'Database optimization for better performance'
    ],
    status: 'completed',
    category: 'major'
  },
  {
    id: '1.0.0',
    version: '1.0.0',
    date: '2024-08-11',
    title: 'Real-time Price Comparison Release',
    description: 'Official release featuring real-time price comparison and significant user experience improvements.',
    features: [
      'Real-time price comparison system',
      'Success and error notification system',
      'Default user image template',
      'Server-side user data fetching'
    ],
    improvements: [
      'Improved game status update modal interface',
      'Profile page and user menu improvements',
      'Performance optimization with server-side fetching'
    ],
    fixes: [
      'Cleanup of unnecessary files',
      'UI and responsiveness fixes'
    ],
    status: 'completed',
    category: 'major'
  },
  {
    id: 'beta-6',
    version: 'Beta 6.0',
    date: '2024-08-10',
    title: 'Legal and Policies',
    description: 'Addition of legal pages and privacy policies.',
    features: [
      'Terms of Service',
      'Privacy Policy',
      'Developer information in footer'
    ],
    improvements: [
      'Better legal navigation structure',
      'Complete footer information'
    ],
    fixes: [],
    status: 'completed',
    category: 'minor'
  },
  {
    id: 'beta-5',
    version: 'Beta 5.0',
    date: '2024-08-09',
    title: 'Game Management System',
    description: 'Complete game status management system implementation.',
    features: [
      'API to get game status by user',
      'IGDB data integration for game listings',
      'Reusable game card component',
      'Pagination system for game lists'
    ],
    improvements: [
      'Optimized rate limiting (60 requests/minute)',
      'Better component organization'
    ],
    fixes: [
      'Deploy fixes and image configuration',
      'Database query optimization'
    ],
    status: 'completed',
    category: 'major'
  },
  {
    id: 'beta-4',
    version: 'Beta 4.0',
    date: '2024-08-08',
    title: 'User Profile System',
    description: 'Complete user profile system implementation.',
    features: [
      'User profile pages',
      'Unique username system',
      'Personalized home page',
      'User settings page'
    ],
    improvements: [
      'Improved login interface',
      'Better navigation experience'
    ],
    fixes: [
      'Settings page build fixes',
      'Authentication validation in all routes'
    ],
    status: 'completed',
    category: 'major'
  },
  {
    id: 'beta-3',
    version: 'Beta 3.0',
    date: '2024-08-07',
    title: 'Prisma Migration',
    description: 'Complete database system migration to Prisma ORM.',
    features: [
      'Complete Prisma ORM integration',
      'Optimized database schema',
      'NextAuth.js adapters with Prisma'
    ],
    improvements: [
      'Better database connection management',
      'Optimized queries for performance'
    ],
    fixes: [
      'Prisma deploy issues fixes',
      'Authentication validation in API routes'
    ],
    status: 'completed',
    category: 'major'
  },
  {
    id: 'beta-2',
    version: 'Beta 2.0',
    date: '2024-08-06',
    title: 'Performance and UI Improvements',
    description: 'Performance optimizations and user interface improvements.',
    features: [],
    improvements: [
      'Replaced img tags with Next.js Image for better performance',
      'Improved empty results component',
      'Database connection optimization'
    ],
    fixes: [
      'Deploy fixes and IGDB proxy configuration',
      'Auto-fill game status modal'
    ],
    status: 'completed',
    category: 'minor'
  },
  {
    id: 'beta-1',
    version: 'Beta 1.0',
    date: '2024-08-05',
    title: 'Initial Beta Release',
    description: 'Initial beta version of GameHub Backlog with basic authentication and navigation features.',
    features: [
      'Basic Google OAuth authentication system',
      'Responsive navbar with basic navigation',
      'Game search system integrated with IGDB API',
      'Game details page',
      'Game status update system'
    ],
    improvements: [],
    fixes: [],
    status: 'completed',
    category: 'major'
  }
];

const Roadmap = () => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'planned':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'major':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'minor':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'patch':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-color_text mb-4">
              GameHub Roadmap
            </h1>
            <p className="text-lg text-color_text_sec max-w-2xl mx-auto">
              Track the evolution of GameHub Backlog through our chronological updates. 
              From the initial release to upcoming planned features.
            </p>
          </div>



          {/* Roadmap Timeline */}
          <div className="space-y-6">
            {roadmapData.map((item, index) => (
              <div
                key={item.id}
                className={`bg-color_sec rounded-lg border border-border_detail overflow-hidden transition-all duration-300 ${
                  expandedItems.includes(item.id) ? 'shadow-lg' : 'shadow-md hover:shadow-lg'
                }`}
              >
                {/* Header */}
                <div 
                  className="p-6 cursor-pointer hover:bg-color_hover transition-colors duration-200"
                  onClick={() => toggleItem(item.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-bold text-color_text">
                            {item.title}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(item.status)}`}>
                            {item.status === 'completed' ? 'Completed' : 
                             item.status === 'in-progress' ? 'In Progress' : 'Planned'}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(item.category)}`}>
                            {item.category === 'major' ? 'Major' : 
                             item.category === 'minor' ? 'Minor' : 'Patch'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-color_text_sec">
                          <span className="font-medium">v{item.version}</span>
                          <span>{item.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {expandedItems.includes(item.id) ? (
                        <ChevronUpIcon className="w-5 h-5 text-color_icons" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 text-color_icons" />
                      )}
                    </div>
                  </div>
                  <p className="text-color_text_sec mt-3">{item.description}</p>
                </div>

                {/* Expanded Content */}
                {expandedItems.includes(item.id) && (
                  <div className="px-6 pb-6 border-t border-border_detail">
                    <div className="pt-4 space-y-4">
                      {item.features.length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold text-color_text mb-2 flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            New Features
                          </h4>
                          <ul className="space-y-1">
                            {item.features.map((feature, idx) => (
                              <li key={idx} className="text-color_text_sec flex items-start gap-2">
                                <span className="text-green-500 mt-1">•</span>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {item.improvements.length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold text-color_text mb-2 flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            Improvements
                          </h4>
                          <ul className="space-y-1">
                            {item.improvements.map((improvement, idx) => (
                              <li key={idx} className="text-color_text_sec flex items-start gap-2">
                                <span className="text-blue-500 mt-1">•</span>
                                {improvement}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {item.fixes.length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold text-color_text mb-2 flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                            Fixes
                          </h4>
                          <ul className="space-y-1">
                            {item.fixes.map((fix, idx) => (
                              <li key={idx} className="text-color_text_sec flex items-start gap-2">
                                <span className="text-red-500 mt-1">•</span>
                                {fix}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-color_text_sec">
              Want to contribute to GameHub development? 
              <a 
                href="https://github.com/goncalojbsousa/gamehub-backlog" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-color_text hover:text-color_hover ml-1 underline"
              >
                Visit our GitHub repository
              </a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Roadmap; 