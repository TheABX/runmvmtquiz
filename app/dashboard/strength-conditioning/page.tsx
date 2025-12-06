'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { STRENGTH_QUESTIONS } from '@/src/lib/strengthQuizConfig'
import type { QuizQuestion, QuizAnswers, AnswerValue } from '@/src/lib/runmvmtTypes'

type Screen = 'intro' | 'question' | 'saving' | 'complete'

export default function StrengthConditioningPage() {
  const router = useRouter()
  const [screen, setScreen] = useState<Screen>('intro')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswers>({})
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [logoError, setLogoError] = useState(false)
  const [savingError, setSavingError] = useState<string | null>(null)

  // Filter questions based on conditional logic
  const getVisibleQuestions = useCallback((): QuizQuestion[] => {
    const visible: QuizQuestion[] = []
    for (const question of STRENGTH_QUESTIONS) {
      // Skip injury_type if no injuries
      if (question.id === "injury_type") {
        const injuryHistory = answers["injury_history"]
        if (injuryHistory && injuryHistory !== "none") {
          visible.push(question)
        }
      } else {
        visible.push(question)
      }
    }
    return visible
  }, [answers.injury_history])

  const visibleQuestions = getVisibleQuestions()
  const safeIndex = Math.min(currentQuestionIndex, Math.max(0, visibleQuestions.length - 1))
  const currentQuestion = visibleQuestions.length > 0 ? visibleQuestions[safeIndex] : null
  const progress = visibleQuestions.length > 0 ? ((safeIndex + 1) / visibleQuestions.length) * 100 : 0

  const handleAnswer = (value: AnswerValue) => {
    if (!currentQuestion) return
    
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value
    }))

    setIsTransitioning(true)
    setTimeout(() => {
      const visible = getVisibleQuestions()
      
      // Check if this is the movement_screening question
      if (currentQuestion.id === "movement_screening") {
        if (value === "yes") {
          // Continue to movement screening
          setIsTransitioning(false)
          router.push('/dashboard/movement-screening')
          return
        } else {
          // "maybe_later" or "no" - save and redirect to dashboard
          setScreen('saving')
          saveStrengthData(true) // Pass flag to redirect after save
          setIsTransitioning(false)
          return
        }
      } else if (currentQuestionIndex < visible.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1)
      } else {
        setScreen('saving')
        saveStrengthData()
      }
      setIsTransitioning(false)
    }, 400)
  }

  const handleMultiChoice = (optionId: string) => {
    if (!currentQuestion) return
    
    const currentValue = answers[currentQuestion.id] as string[] || []
    const newValue = currentValue.includes(optionId)
      ? currentValue.filter(id => id !== optionId)
      : [...currentValue, optionId]
    handleAnswer(newValue)
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

  const saveStrengthData = async (redirectAfterSave = false) => {
    try {
      setSavingError(null)
      
      const { createClient } = await import('@supabase/supabase-js')
      
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase is not configured. Please check your environment variables.')
      }
      
      const supabase = createClient(supabaseUrl, supabaseAnonKey)

      const { data: userData, error: userError } = await supabase.auth.getUser()
      
      if (userError || !userData?.user) {
        console.warn('User not logged in, skipping strength data save')
        setSavingError('You must be logged in to save your assessment. Please log in and try again.')
        if (!redirectAfterSave) {
          setScreen('question')
        }
        return
      }

      const userId = userData.user.id

      // Check if record exists
      const { data: existing } = await supabase
        .from('strength_assessment')
        .select('id')
        .eq('user_id', userId)
        .single()

      let saveError = null

      if (existing) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('strength_assessment')
          .update({
            answers: answers,
            completed: true,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)

        saveError = updateError
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('strength_assessment')
          .insert({
            user_id: userId,
            answers: answers,
            completed: true
          })

        saveError = insertError
      }

      if (saveError) {
        console.error('Error saving strength data:', saveError)
        setSavingError(`Failed to save assessment: ${saveError.message}. Please check the browser console for details.`)
        if (!redirectAfterSave) {
          setScreen('question')
        }
        return
      }

      console.log('✅ Strength assessment data saved successfully')
      
      if (redirectAfterSave) {
        router.push('/dashboard/performance-setup')
      } else {
        setScreen('complete')
      }
    } catch (err: any) {
      console.error('Error saving strength data:', err)
      setSavingError(err.message || 'Failed to save assessment. Please try again.')
      if (!redirectAfterSave) {
        setScreen('question')
      }
    }
  }

  // Adjust index if current question becomes invisible
  useEffect(() => {
    if (screen === 'question' && currentQuestionIndex >= 0) {
      const visible = getVisibleQuestions()
      if (currentQuestionIndex >= visible.length) {
        setCurrentQuestionIndex(Math.max(0, visible.length - 1))
      }
    }
  }, [getVisibleQuestions, screen, currentQuestionIndex])

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
                Strength & Conditioning Assessment
              </h1>
              <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-8">
                Evaluate your current strength, mobility, and movement patterns to create a personalized strength program that complements your running and reduces injury risk.
              </p>
              <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 mb-8 text-left max-w-2xl mx-auto">
                <h2 className="text-lg sm:text-xl font-semibold text-text-primary mb-4">What you'll get:</h2>
                <ul className="space-y-2 text-text-secondary">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Assesses your current strength and mobility levels</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Identifies muscle imbalances and weaknesses</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Creates a runner-specific strength program</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={handleStart}
                className="px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white font-bold text-base sm:text-lg rounded-lg shadow-lg hover:shadow-xl hover:opacity-90 transition-all duration-200"
              >
                Start Assessment
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
                Question {safeIndex + 1} of {visibleQuestions.length}
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

              {currentQuestion.type === 'multi_choice' && currentQuestion.options && (
                <div className="space-y-3">
                  {currentQuestion.options.map((option) => {
                    const currentValue = getCurrentAnswer() as string[] || []
                    const isSelected = currentValue.includes(option.id)
                    return (
                      <button
                        key={option.id}
                        onClick={() => handleMultiChoice(option.id)}
                        className={`w-full text-left px-6 py-4 rounded-lg border-2 transition-all ${
                          isSelected
                            ? 'border-primary bg-primary/5 text-text-primary'
                            : 'border-gray-200 hover:border-gray-300 text-text-secondary'
                        }`}
                      >
                        {isSelected && '✓ '}
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
                <div className="text-6xl mb-4">💪</div>
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
              Saving your assessment...
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
                    Assessment Complete!
                  </h2>
                  <p className="text-lg text-text-secondary mb-8">
                    Your strength & conditioning assessment has been saved. We'll use this information to create your personalized strength program.
                  </p>
                  <button
                    onClick={() => router.push('/dashboard/performance-setup')}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl hover:opacity-90 transition-all duration-200"
                  >
                    Return to Performance Setup
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
