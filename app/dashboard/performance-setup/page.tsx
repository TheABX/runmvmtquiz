'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export default function PerformanceSetupPage() {
  const router = useRouter()
  const [logoError, setLogoError] = useState(false)
  const [showMovementScreening, setShowMovementScreening] = useState(false)
  const [moduleStatus, setModuleStatus] = useState({
    trainingProgram: true, // ✅ Completed (they purchased)
    trainingDiagnostic: false,
    strengthConditioning: false,
    nutritionScreening: false,
    psychologicalProfile: false,
    competitionPrep: false,
    recoveryAssessment: false,
  })

  // Handle checkout success redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('checkout') === 'success') {
      // Clean up URL
      window.history.replaceState({}, '', '/dashboard/performance-setup')
    }
  }, [])

  // Fetch module completion status from Supabase
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    const checkModuleStatus = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const { createClient } = await import('@supabase/supabase-js')
        
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        
        if (!supabaseUrl || !supabaseAnonKey) return
        
        const supabase = createClient(supabaseUrl, supabaseAnonKey)

        const { data: userData } = await supabase.auth.getUser()
        if (!userData?.user) return

        // Check nutrition screening completion
        const { data: nutritionData } = await supabase
          .from('nutrition_screening')
          .select('id')
          .eq('user_id', userData.user.id)
          .single()

        if (nutritionData) {
          setModuleStatus(prev => ({
            ...prev,
            nutritionScreening: true,
          }))
        }

        // Check strength assessment completion
        const { data: strengthData } = await supabase
          .from('strength_assessment')
          .select('answers, movement_screening_completed, completed')
          .eq('user_id', userData.user.id)
          .single()

        if (strengthData) {
          setModuleStatus(prev => ({
            ...prev,
            strengthConditioning: strengthData.movement_screening_completed || strengthData.completed || false,
          }))
          
          // Check if they said "maybe later" to movement screening
          const wantsScreening = strengthData.answers?.movement_screening
          if (wantsScreening === "maybe_later" && !strengthData.movement_screening_completed) {
            setShowMovementScreening(true)
          } else {
            setShowMovementScreening(false)
          }
        }

        // Check psychological profile completion
        const { data: psychologicalData } = await supabase
          .from('psychological_profile')
          .select('completed')
          .eq('user_id', userData.user.id)
          .single()

        if (psychologicalData?.completed) {
          setModuleStatus(prev => ({
            ...prev,
            psychologicalProfile: true,
          }))
        }
      } catch (err) {
        console.warn('Error checking module status:', err)
      }
    }

    checkModuleStatus()
  }, [])

  // Download nutrition plan PDF
  const handleDownloadNutritionPlan = async () => {
    try {
      // Dynamic import to avoid SSR issues
      const { createClient } = await import('@supabase/supabase-js')
      
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseAnonKey) {
        alert('Supabase is not configured')
        return
      }
      
      const supabase = createClient(supabaseUrl, supabaseAnonKey)

      const { data: userData } = await supabase.auth.getUser()
      if (!userData?.user) {
        alert('Please log in to download your nutrition plan')
        return
      }

      // Fetch user's first name for PDF
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('first_name')
        .eq('user_id', userData.user.id)
        .single()

      const response = await fetch('/api/generate-nutrition-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userData.user.id,
          name: profile?.first_name || undefined,
        }),
      })

      if (!response.ok) {
        let errorMessage = 'Failed to generate PDF'
        try {
          const error = await response.json()
          errorMessage = error.error || error.details || errorMessage
        } catch (e) {
          errorMessage = `Server error: ${response.status} ${response.statusText}`
        }
        throw new Error(errorMessage)
      }

      // Check if response is actually a PDF
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/pdf')) {
        const errorText = await response.text()
        console.error('Unexpected response:', errorText)
        throw new Error('Server returned an error instead of PDF. Please check the console.')
      }

      // Download the PDF
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'nutrition-plan.pdf'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err: any) {
      console.error('Error downloading nutrition plan:', err)
      alert(err.message || 'Failed to download nutrition plan. Please try again.')
    }
  }

  const modules = [
    {
      id: 'training-diagnostic',
      title: 'Athlete Training Diagnostic',
      description: 'Answer a few questions about your training history, current load, and injury background so we can refine your periodisation, session structure, and progression.',
      bullets: [
        'Tailors your plan to your running history and goals',
        'Adjusts periodisation blocks and key sessions',
        'Takes into account injuries and constraints',
      ],
      buttonText: 'Start Athlete Training Diagnostic',
      route: '/dashboard/training-diagnostic',
      completed: moduleStatus.trainingDiagnostic,
    },
    {
      id: 'strength-conditioning',
      title: 'Strength & Conditioning Assessment',
      description: 'Evaluate your current strength, mobility, and movement patterns to create a personalized strength program that complements your running and reduces injury risk.',
      bullets: [
        'Assesses your current strength and mobility levels',
        'Identifies muscle imbalances and weaknesses',
        'Creates a runner-specific strength program',
      ],
      buttonText: 'Start Strength Assessment',
      route: '/dashboard/strength-conditioning',
      completed: moduleStatus.strengthConditioning,
    },
    {
      id: 'nutrition-screening',
      title: 'Performance Nutrition Screening',
      description: 'Set up your daily energy targets and basic nutrition guidelines based on your body, training volume, and food preferences.',
      bullets: [
        'Estimates your calorie needs relative to training load',
        'Recommends macro balance (carbs, protein, fats)',
        'Considers your diet style and constraints',
      ],
      buttonText: 'Start Nutrition Screening',
      route: '/dashboard/nutrition-screening',
      completed: moduleStatus.nutritionScreening,
    },
    {
      id: 'psychological-profile',
      title: 'Psychological Performance Profile',
      description: "We'll build a picture of your mindset, confidence, and stress levels so we can give you simple tools to stay consistent when things get hard.",
      bullets: [
        'Identifies mental roadblocks and triggers',
        'Helps set practical mindset routines',
        'Supports race-day confidence and focus',
      ],
      buttonText: 'Start Mindset Profile',
      route: '/dashboard/psychological-profile',
      completed: moduleStatus.psychologicalProfile,
    },
    {
      id: 'competition-prep',
      title: 'Competition Preparation Audit',
      description: "Build a clear race-day game plan: pacing, fuelling, and a simple checklist so you're not guessing on the start line.",
      bullets: [
        'Defines your pace strategy for race day',
        'Shapes a fuelling and hydration plan',
        'Covers the night-before and race morning checklist',
      ],
      buttonText: 'Start Race Prep Audit',
      route: '/dashboard/competition-prep',
      completed: moduleStatus.competitionPrep,
      comingSoon: true,
    },
    {
      id: 'recovery-assessment',
      title: 'Recovery + Readiness Assessment',
      description: 'A quick check-in on sleep, soreness and life stress so we can give guidance on how to balance training and recovery.',
      bullets: [
        'Tracks basic sleep and recovery patterns',
        'Flags potential overload or burnout',
        'Helps adjust training on high-stress weeks',
      ],
      buttonText: 'Start Recovery Assessment',
      route: '/dashboard/recovery-assessment',
      completed: moduleStatus.recoveryAssessment,
      optional: true,
      comingSoon: true,
    },
  ]

  const completedCount = Object.values(moduleStatus).filter(Boolean).length
  const totalSteps = 6 // 5 main modules + training program

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header - Same as quiz page */}
      <header className="fixed top-0 left-0 right-0 z-20 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/runmvmt-quiz" className="flex items-center">
                {logoError ? (
                  <div className="text-primary text-2xl sm:text-3xl font-bold cursor-pointer hover:opacity-80 transition-opacity">
                    RUN MVMT
                  </div>
                ) : (
                  <div className="relative h-10 sm:h-12 w-auto cursor-pointer hover:opacity-80 transition-opacity">
                    <Image
                      src="/images/Runmvmt6png.png"
                      alt="RUN MVMT"
                      width={180}
                      height={48}
                      className="h-full w-auto object-contain"
                      priority
                      onError={() => setLogoError(true)}
                    />
                  </div>
                )}
              </Link>
              <div className="hidden lg:block border-l border-gray-300 pl-4">
                <p className="text-sm text-text-secondary italic">
                  A community of runners, moving as one.
                </p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/dashboard/performance-setup" className="text-text-primary text-sm font-medium">
                DASHBOARD
              </Link>
              <a href="#" className="text-text-secondary hover:text-text-primary text-sm font-medium transition-colors">ABOUT</a>
              <a href="#" className="text-text-secondary hover:text-text-primary text-sm font-medium transition-colors">PRICING</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-24 sm:pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-4">
              You're in. Let's build your perfect running system.
            </h1>
            <p className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto mb-2">
              Your 12-week RunMVMT program is ready to go. Now we'll dial in your training structure, nutrition, mindset, and race-day plan so every session actually moves you towards your goal.
            </p>
            <p className="text-sm text-text-secondary">
              This setup takes around 5–10 minutes and you can come back to it any time from your dashboard.
            </p>
          </div>

          {/* Progress Strip */}
          <div className="mb-12 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-text-primary">
                Your RunMVMT Performance Setup
              </h2>
              <span className="text-sm text-text-secondary">
                Step {completedCount} of {totalSteps}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 transition-all duration-500 rounded-full"
                style={{ width: `${(completedCount / totalSteps) * 100}%` }}
              />
            </div>

            {/* Progress Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-green-600 font-bold">✅</span>
                <span className="text-text-secondary">Training Program</span>
              </div>
              <div className="flex items-center gap-2">
                <span>{moduleStatus.trainingDiagnostic ? '✅' : '⏳'}</span>
                <span className={moduleStatus.trainingDiagnostic ? 'text-text-primary' : 'text-text-secondary'}>
                  Athlete Training Diagnostic
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span>{moduleStatus.strengthConditioning ? '✅' : '⏳'}</span>
                <span className={moduleStatus.strengthConditioning ? 'text-text-primary' : 'text-text-secondary'}>
                  Strength & Conditioning
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span>{moduleStatus.nutritionScreening ? '✅' : '⏳'}</span>
                <span className={moduleStatus.nutritionScreening ? 'text-text-primary' : 'text-text-secondary'}>
                  {moduleStatus.nutritionScreening ? 'Performance Nutrition' : 'Performance Nutrition Screening'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span>{moduleStatus.psychologicalProfile ? '✅' : '⏳'}</span>
                <span className={moduleStatus.psychologicalProfile ? 'text-text-primary' : 'text-text-secondary'}>
                  Psychological Performance Profile
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span>{moduleStatus.competitionPrep ? '✅' : '⏳'}</span>
                <span className={moduleStatus.competitionPrep ? 'text-text-primary' : 'text-text-secondary'}>
                  Competition Preparation Audit
                </span>
              </div>
            </div>
          </div>

          {/* Module Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {modules.map((module) => (
              <div
                key={module.id}
                className={`relative bg-white rounded-xl border-2 p-6 shadow-lg transition-all duration-200 ${
                  module.completed
                    ? 'border-green-200 bg-green-50/30'
                    : 'border-gray-200 hover:border-primary hover:shadow-xl'
                } ${module.comingSoon ? 'opacity-75' : ''}`}
              >
                {/* Coming Soon Overlay */}
                {module.comingSoon && (
                  <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center z-10 backdrop-blur-sm">
                    <div className="text-center">
                      <p className="text-white text-2xl font-bold mb-2">Coming Soon</p>
                      <p className="text-white/90 text-sm">This feature is in development</p>
                    </div>
                  </div>
                )}
                {module.completed && (
                  <div className="flex items-center justify-end mb-2">
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold">
                      Completed
                    </span>
                  </div>
                )}
                
                <h3 className="text-xl font-bold text-text-primary mb-3">
                  {module.id === 'nutrition-screening' && module.completed 
                    ? 'Performance Nutrition' 
                    : module.title}
                </h3>
                
                {!(module.id === 'nutrition-screening' && module.completed) && (
                  <>
                    <p className="text-sm text-text-secondary mb-4">
                      {module.description}
                    </p>

                    <ul className="space-y-2 mb-6">
                      {module.bullets.map((bullet, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-text-secondary">
                          <span className="text-primary mt-1">•</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {module.id === 'nutrition-screening' && module.completed ? (
                  <div className="space-y-3">
                    <button
                      onClick={handleDownloadNutritionPlan}
                      className="block w-full text-center px-6 py-3 rounded-lg font-semibold transition-all duration-200 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white hover:opacity-90 hover:shadow-lg"
                    >
                      Download Nutrition Plan
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          const response = await fetch('/api/generate-runners-cookbook', {
                            method: 'GET',
                          });
                          
                          if (!response.ok) {
                            throw new Error('Failed to generate cookbook');
                          }
                          
                          const blob = await response.blob();
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'runners-cookbook.pdf';
                          document.body.appendChild(a);
                          a.click();
                          window.URL.revokeObjectURL(url);
                          document.body.removeChild(a);
                        } catch (error) {
                          console.error('Error downloading cookbook:', error);
                          alert('Failed to download cookbook. Please try again.');
                        }
                      }}
                      className="block w-full text-center px-6 py-3 rounded-lg font-semibold transition-all duration-200 bg-white border-2 border-gray-300 text-text-primary hover:bg-gray-50 hover:shadow-lg"
                    >
                      Runner's Cookbook
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          const response = await fetch('/api/generate-nutrition-guide', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                          })

                          if (!response.ok) {
                            let errorMessage = 'Failed to generate PDF'
                            try {
                              const error = await response.json()
                              errorMessage = error.error || error.details || errorMessage
                            } catch (e) {
                              errorMessage = `Server error: ${response.status} ${response.statusText}`
                            }
                            throw new Error(errorMessage)
                          }

                          // Check if response is actually a PDF
                          const contentType = response.headers.get('content-type')
                          if (!contentType || !contentType.includes('application/pdf')) {
                            const errorText = await response.text()
                            console.error('Unexpected response:', errorText)
                            throw new Error('Server returned an error instead of PDF. Please check the console.')
                          }

                          // Download the PDF
                          const blob = await response.blob()
                          const url = window.URL.createObjectURL(blob)
                          const a = document.createElement('a')
                          a.href = url
                          a.download = 'nutrition-guide.pdf'
                          document.body.appendChild(a)
                          a.click()
                          window.URL.revokeObjectURL(url)
                          document.body.removeChild(a)
                        } catch (err: any) {
                          console.error('Error downloading nutrition guide:', err)
                          alert(err.message || 'Failed to download nutrition guide. Please try again.')
                        }
                      }}
                      className="block w-full text-center px-6 py-3 rounded-lg font-semibold transition-all duration-200 bg-white border-2 border-gray-300 text-text-primary hover:bg-gray-50 hover:shadow-lg"
                    >
                      Nutrition Guide
                    </button>
                  </div>
                ) : module.id === 'strength-conditioning' && showMovementScreening ? (
                  <div className="space-y-3">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-3">
                      <p className="text-sm text-yellow-800 mb-3">
                        Complete the movement screening to get your personalized strength program, or skip to use quiz questions only.
                      </p>
                      <button
                        onClick={() => router.push('/dashboard/movement-screening')}
                        className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                      >
                        Start Movement Screening
                      </button>
                    </div>
                    <Link
                      href={module.route}
                      className="block w-full text-center px-6 py-3 rounded-lg font-semibold transition-all duration-200 bg-white border-2 border-gray-300 text-text-primary hover:bg-gray-50 hover:shadow-lg"
                    >
                      Skip to Quiz Questions Only
                    </Link>
                  </div>
                ) : module.comingSoon ? (
                  <div className="block w-full text-center px-6 py-3 rounded-lg font-semibold transition-all duration-200 bg-gray-300 text-gray-600 cursor-not-allowed">
                    Coming Soon
                  </div>
                ) : (
                  <Link
                    href={module.route}
                    className={`block w-full text-center px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                      module.completed
                        ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white hover:opacity-90 hover:shadow-lg'
                    }`}
                  >
                    {module.completed ? 'Completed' : module.buttonText}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Reassurance Text */}
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-base text-text-secondary leading-relaxed">
              <strong className="text-text-primary">No rush – but momentum matters.</strong>
              {' '}
              You can come back to these modules any time from your RunMVMT dashboard. The more detail you give us, the more accurate your training, nutrition, and mindset recommendations will be. If you're short on time, start with the Athlete Training Diagnostic.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

