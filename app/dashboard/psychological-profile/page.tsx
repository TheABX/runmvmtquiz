'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { PSYCHOLOGICAL_QUESTIONS, getMindsetSection, getPersonalizedIntro, getStrength } from '@/src/lib/psychologicalQuizConfig'
import type { QuizQuestion, QuizAnswers, AnswerValue } from '@/src/lib/runmvmtTypes'

type Screen = 'intro' | 'question' | 'saving' | 'complete'

export default function PsychologicalProfilePage() {
  const router = useRouter()
  const [screen, setScreen] = useState<Screen>('intro')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswers>({})
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [logoError, setLogoError] = useState(false)
  const [savingError, setSavingError] = useState<string | null>(null)

  const currentQuestion = PSYCHOLOGICAL_QUESTIONS[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / PSYCHOLOGICAL_QUESTIONS.length) * 100

  const handleAnswer = (value: AnswerValue) => {
    if (!currentQuestion) return
    
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value
    }))

    setIsTransitioning(true)
    setTimeout(() => {
      if (currentQuestionIndex < PSYCHOLOGICAL_QUESTIONS.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1)
      } else {
        setScreen('saving')
        savePsychologicalData()
      }
      setIsTransitioning(false)
    }, 400)
  }

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const handleStart = () => {
    setScreen('question')
    setCurrentQuestionIndex(0)
  }

  const savePsychologicalData = async () => {
    try {
      setSavingError(null)
      
      const { createClient } = await import('@supabase/supabase-js')
      
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase is not configured')
      }
      
      const supabase = createClient(supabaseUrl, supabaseAnonKey)

      const { data: userData, error: userError } = await supabase.auth.getUser()
      
      if (userError || !userData?.user) {
        setSavingError('You must be logged in to save your assessment.')
        setScreen('question')
        return
      }

      const userId = userData.user.id
      const section = getMindsetSection(answers)
      const intro = getPersonalizedIntro(answers, section)
      const strength = getStrength(answers)

      // Check if record exists
      const { data: existing } = await supabase
        .from('psychological_profile')
        .select('id')
        .eq('user_id', userId)
        .single()

      let saveError = null

      if (existing) {
        const { error: updateError } = await supabase
          .from('psychological_profile')
          .update({
            answers: answers,
            main_section: section,
            personalized_intro: intro,
            strength: strength,
            completed: true,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)

        saveError = updateError
      } else {
        const { error: insertError } = await supabase
          .from('psychological_profile')
          .insert({
            user_id: userId,
            answers: answers,
            main_section: section,
            personalized_intro: intro,
            strength: strength,
            completed: true
          })

        saveError = insertError
      }

      if (saveError) {
        console.error('Error saving psychological data:', saveError)
        setSavingError(`Failed to save assessment: ${saveError.message}`)
        setScreen('question')
        return
      }

      setScreen('complete')
    } catch (err: any) {
      console.error('Error saving psychological data:', err)
      setSavingError(err.message || 'Failed to save assessment.')
      setScreen('question')
    }
  }

  const getCurrentAnswer = (): AnswerValue => {
    if (!currentQuestion) return null
    return answers[currentQuestion.id] || null
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      {screen !== 'question' && screen !== 'saving' && (
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
              </div>
              <button
                onClick={() => router.push('/dashboard/performance-setup')}
                className="text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                ← Back to Performance Setup
              </button>
            </div>
          </div>
        </header>
      )}

      <main className={`flex-1 ${screen === 'question' ? 'pt-32 sm:pt-36' : screen === 'intro' ? '' : 'pt-24 sm:pt-28'} ${screen === 'intro' ? '' : 'flex items-center justify-center py-8 sm:py-12'}`}>
        {screen === 'intro' && (
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-16">
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-text-primary mb-6">
                Psychological Performance Profile
              </h1>
              <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-8">
                Identify your biggest mental challenge and get practical, high-performance strategies to overcome it.
              </p>
              <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 mb-8 text-left max-w-2xl mx-auto">
                <h2 className="text-lg sm:text-xl font-semibold text-text-primary mb-4">What you'll get:</h2>
                <ul className="space-y-2 text-text-secondary">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Identify your main mental challenge</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Get practical strategies backed by sports psychology</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Receive a personalized mindset guide you can download</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={handleStart}
                className="px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white font-bold text-base sm:text-lg rounded-lg shadow-lg hover:shadow-xl hover:opacity-90 transition-all duration-200"
              >
                Start Mindset Profile
              </button>
            </div>
          </div>
        )}

        {screen === 'question' && currentQuestion && (
          <div className="w-full max-w-2xl mx-auto px-4">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-text-secondary mt-2 text-center">
                Question {currentQuestionIndex + 1} of {PSYCHOLOGICAL_QUESTIONS.length}
              </p>
            </div>

            {/* Question */}
            <div className={`bg-white rounded-2xl shadow-xl p-8 sm:p-10 mb-6 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
              {/* Section Header */}
              {currentQuestion.section && (
                <div className="mb-4">
                  <span className="text-sm font-semibold text-primary uppercase tracking-wide">
                    {currentQuestion.section}
                  </span>
                </div>
              )}

              <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-6">
                {currentQuestion.question}
              </h2>

              {savingError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {savingError}
                </div>
              )}

              {/* Answer Options */}
              {currentQuestion.type === 'single_choice' && currentQuestion.options && (
                <div className="space-y-3">
                  {currentQuestion.options.map((option) => {
                    const isSelected = getCurrentAnswer() === option.id
                    return (
                      <button
                        key={option.id}
                        onClick={() => handleAnswer(option.id)}
                        className={`w-full text-left px-6 py-4 rounded-lg border-2 transition-all ${
                          isSelected
                            ? 'border-primary bg-primary/5 text-text-primary'
                            : 'border-gray-200 hover:border-gray-300 text-text-secondary'
                        }`}
                      >
                        {option.label}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <button
                onClick={handleBack}
                disabled={currentQuestionIndex === 0}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  currentQuestionIndex === 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-text-secondary hover:text-text-primary hover:bg-gray-50'
                }`}
              >
                ← Back
              </button>
            </div>
          </div>
        )}

        {screen === 'saving' && (
          <div className="w-full max-w-md mx-auto px-4 text-center">
            <div className="mb-8">
              {logoError ? (
                <div className="text-6xl mb-4">🧠</div>
              ) : (
                <div className="relative w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl mx-auto">
                  <div className="relative w-32 h-32 sm:w-40 sm:h-40">
                    <Image
                      src="/images/Runmvmt2.png"
                      alt="RUN MVMT"
                      width={160}
                      height={160}
                      className="w-full h-full object-contain animate-bounce"
                      style={{ animationDuration: '2s' }}
                      onError={() => setLogoError(true)}
                    />
                  </div>
                </div>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary mb-6">
              Creating your mindset profile...
            </h2>

            <div className="flex justify-center gap-2 mt-4">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-pulse"
                  style={{
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: '1s'
                  }}
                ></div>
              ))}
            </div>
          </div>
        )}

        {screen === 'complete' && (
          <div className="w-full max-w-2xl mx-auto px-4 text-center">
            <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
              {savingError ? (
                <>
                  <div className="text-6xl mb-6">⚠️</div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
                    Error Saving Data
                  </h2>
                  <p className="text-lg text-text-secondary mb-8">
                    {savingError}
                  </p>
                  <button
                    onClick={() => router.push('/dashboard/performance-setup')}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl hover:opacity-90 transition-all duration-200"
                  >
                    Back to Performance Setup
                  </button>
                </>
              ) : (
                <>
                  <div className="text-6xl mb-6">✅</div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
                    Profile Complete!
                  </h2>
                  <p className="text-lg text-text-secondary mb-8">
                    Your psychological performance profile has been saved. Download your personalized mindset guide with practical strategies tailored to your answers.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={async () => {
                        try {
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
                            alert('Please log in to download your profile')
                            return
                          }

                          const { data: profile } = await supabase
                            .from('user_profiles')
                            .select('first_name')
                            .eq('user_id', userData.user.id)
                            .single()

                          const response = await fetch('/api/generate-psychological-profile', {
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
                            throw new Error('Failed to generate PDF')
                          }

                          const blob = await response.blob()
                          const url = window.URL.createObjectURL(blob)
                          const a = document.createElement('a')
                          a.href = url
                          a.download = 'psychological-performance-profile.pdf'
                          document.body.appendChild(a)
                          a.click()
                          window.URL.revokeObjectURL(url)
                          document.body.removeChild(a)
                        } catch (err: any) {
                          console.error('Error downloading profile:', err)
                          alert(err.message || 'Failed to download profile. Please try again.')
                        }
                      }}
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl hover:opacity-90 transition-all duration-200"
                    >
                      Download Mindset Guide
                    </button>
                    <button
                      onClick={() => router.push('/dashboard/performance-setup')}
                      className="px-8 py-4 bg-white border-2 border-gray-300 text-text-primary font-bold text-lg rounded-lg shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all duration-200"
                    >
                      Return to Performance Setup
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
