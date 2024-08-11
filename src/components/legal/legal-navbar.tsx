import Link from 'next/link';
import React from 'react'

const LegalNavbar = () => {
  return (
    <div className="p-4 pl-6 pt-0">
    <ul className="flex list-disc list-inside space-x-4">
        <li className="p-2">
            <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
        </li>
        <li className="p-2">
            <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
        </li>
    </ul>
</div>
  )
}

export default LegalNavbar;