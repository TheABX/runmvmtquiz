'use client'

import Link from 'next/link'

export default function TrainingDiagnosticPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-text-primary mb-4">
          Athlete Training Diagnostic
        </h1>
        <p className="text-text-secondary mb-6">
          This module is coming soon. We're building a comprehensive diagnostic to tailor your training plan.
        </p>
        <Link
          href="/dashboard/performance-setup"
          className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white font-semibold rounded-lg hover:opacity-90 transition-all"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}


