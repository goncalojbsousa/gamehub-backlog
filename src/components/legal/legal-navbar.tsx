import Link from 'next/link';
import React from 'react'

const LegalNavbar = () => {
  return (
    <div className="mb-6">
      <nav className="flex items-center space-x-1 bg-color_sec rounded-lg p-2 shadow-sm border border-border_detail">
        <Link 
          href="/terms" 
          className="px-4 py-2 rounded-md text-color_text_sec hover:text-color_text hover:bg-color_hover transition-all duration-200 font-medium"
        >
          Terms of Service
        </Link>
        <Link 
          href="/privacy" 
          className="px-4 py-2 rounded-md text-color_text_sec hover:text-color_text hover:bg-color_hover transition-all duration-200 font-medium"
        >
          Privacy Policy
        </Link>
      </nav>
    </div>
  )
}

export default LegalNavbar;