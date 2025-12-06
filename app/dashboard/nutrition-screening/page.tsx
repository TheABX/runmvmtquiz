'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { NUTRITION_QUESTIONS } from '@/src/lib/nutritionQuizConfig'
import type { QuizQuestion, QuizAnswers, AnswerValue } from '@/src/lib/runmvmtTypes'

type Screen = 'intro' | 'question' | 'creating' | 'complete'

export default function NutritionScreeningPage() {
  const router = useRouter()
  const [screen, setScreen] = useState<Screen>('intro')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswers>({})
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [logoError, setLogoError] = useState(false)
  const [savingError, setSavingError] = useState<string | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)

  // Filter questions based on conditional logic
  const getVisibleQuestions = useCallback((): QuizQuestion[] => {
    const visible: QuizQuestion[] = []
    for (const question of NUTRITION_QUESTIONS) {
      // Skip body_fat_percent if knows_body_fat is not "yes"
      if (question.id === "body_fat_percent") {
        if (answers["knows_body_fat"] === "yes") {
          visible.push(question)
        }
      } else {
        visible.push(question)
      }
    }
    return visible
  }, [answers.knows_body_fat])

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
      if (currentQuestionIndex < visible.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1)
      } else {
        setScreen('creating')
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

  const handleTextInput = (value: string) => {
    if (!currentQuestion) return
    
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value || null
    }))
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

  const getCurrentAnswer = (): AnswerValue => {
    if (!currentQuestion) return null
    return answers[currentQuestion.id] || null
  }

  // Safety check: if current question is no longer visible (e.g., user changed knows_body_fat to "no"),
  // adjust the index to the last valid question
  useEffect(() => {
    if (screen === 'question' && currentQuestionIndex >= 0) {
      const visible = getVisibleQuestions()
      if (currentQuestionIndex >= visible.length) {
        setCurrentQuestionIndex(Math.max(0, visible.length - 1))
      }
    }
  }, [getVisibleQuestions, screen, currentQuestionIndex])

  // Creating steps
  const creatingSteps = [
    "Calculating your BMR and maintenance calories...",
    "Analyzing your training load from your plan...",
    "Building daily macro targets...",
    "Creating personalized meal suggestions...",
    "Optimizing pre/post workout nutrition...",
    "Finalizing your nutrition plan..."
  ]

  const [creatingStep, setCreatingStep] = useState(0)

  useEffect(() => {
    if (screen === 'creating') {
      const timer = setInterval(() => {
        setCreatingStep((prev) => {
          if (prev < creatingSteps.length - 1) {
            return prev + 1
          } else {
            clearInterval(timer)
            setTimeout(() => {
              setScreen('complete')
            }, 1000)
            return prev
          }
        })
      }, 1200)

      return () => clearInterval(timer)
    } else {
      setCreatingStep(0)
    }
  }, [screen, creatingSteps.length])

  // Save to Supabase when complete
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return
    
    if (screen === 'complete') {
      const saveNutritionData = async () => {
        try {
          setSavingError(null)
          
          // Dynamic import to avoid SSR issues
          const { createClient } = await import('@supabase/supabase-js')
          
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
          const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
          
          if (!supabaseUrl || !supabaseAnonKey) {
            throw new Error('Supabase is not configured. Please check your environment variables.')
          }
          
          const supabase = createClient(supabaseUrl, supabaseAnonKey)

          const { data: userData, error: userError } = await supabase.auth.getUser()
          
          if (userError || !userData?.user) {
            console.warn('User not logged in, skipping nutrition data save')
            setSavingError('You must be logged in to save your nutrition data. Please log in and try again.')
            return
          }

          const userId = userData.user.id

          // Prepare data for Supabase
          const nutritionData: any = {
            user_id: userId,
            biological_sex: answers.biological_sex || null,
            age: answers.age ? parseInt(String(answers.age)) : null,
            weight_kg: answers.weight_kg ? parseFloat(String(answers.weight_kg)) : null,
            height_cm: answers.height_cm ? parseInt(String(answers.height_cm)) : null,
            knows_body_fat: answers.knows_body_fat || null,
            body_fat_percent: answers.body_fat_percent ? parseFloat(String(answers.body_fat_percent)) : null,
            nutrition_goal: answers.nutrition_goal || null,
            dietary_preference: answers.dietary_preference || null,
            allergies_intolerances: answers.allergies_intolerances || null,
            disliked_foods: answers.disliked_foods || null,
            fueling_preference: answers.fueling_preference || null,
            training_time: answers.training_time || null,
            meals_per_day: answers.meals_per_day || null,
            tracking_habits: answers.tracking_habits || null,
            alcohol_consumption: answers.alcohol_consumption || null,
            caffeine_tolerance: answers.caffeine_tolerance || null,
            current_fueling_products: Array.isArray(answers.current_fueling_products) 
              ? answers.current_fueling_products 
              : null,
          }

          // Check if record exists for this user
          const { data: existingRecord } = await supabase
            .from('nutrition_screening')
            .select('id')
            .eq('user_id', userId)
            .single()

          let saveError = null

          if (existingRecord) {
            // Update existing record
            const { error: updateError } = await supabase
              .from('nutrition_screening')
              .update(nutritionData)
              .eq('user_id', userId)

            saveError = updateError
          } else {
            // Insert new record
            const { error: insertError } = await supabase
              .from('nutrition_screening')
              .insert(nutritionData)

            saveError = insertError
          }

          if (saveError) {
            console.error('Error saving nutrition data:', saveError)
            console.error('Error details:', {
              message: saveError.message,
              details: saveError.details,
              hint: saveError.hint,
              code: saveError.code,
            })
            setSavingError(`Failed to save nutrition data: ${saveError.message}. Please check the browser console for details.`)
            return
          }

          console.log('✅ Nutrition screening data saved successfully')
        } catch (err: any) {
          console.error('Error saving nutrition data:', err)
          setSavingError(err.message || 'Failed to save nutrition data. Please try again.')
        }
      }

      saveNutritionData()
    }
  }, [screen, answers])

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      {screen !== 'question' && screen !== 'creating' && (
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
                Performance Nutrition Screening
              </h1>
              <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-8">
                Answer a few questions about your body, goals, and eating habits. We'll combine this with your training plan to create personalized daily nutrition targets.
              </p>
              <button
                onClick={handleStart}
                className="px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white font-bold text-base sm:text-lg rounded-lg shadow-lg hover:shadow-xl hover:opacity-90 transition-all duration-200"
              >
                Start Nutrition Screening
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
                  className="h-full bg-black transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-text-secondary mt-2 text-center">
                Question {safeIndex + 1} of {visibleQuestions.length}
              </p>
            </div>

            {/* Question */}
            <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-6">
                {currentQuestion.question}
              </h2>

              {currentQuestion.helperText && (
                <p className="text-sm text-text-secondary mb-6 italic">
                  {currentQuestion.helperText}
                </p>
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

              {(currentQuestion.type === 'number' || currentQuestion.type === 'text') && (
                <div className="space-y-4">
                  <input
                    type={currentQuestion.type === 'number' ? 'number' : 'text'}
                    value={(getCurrentAnswer() as string) || ''}
                    onChange={(e) => handleTextInput(e.target.value)}
                    placeholder={currentQuestion.placeholder || ''}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none text-text-primary"
                  />
                  {!currentQuestion.required && (
                    <button
                      onClick={() => handleAnswer(null)}
                      className="w-full px-6 py-3 border-2 border-gray-200 rounded-lg hover:border-gray-300 text-text-secondary transition-all"
                    >
                      Skip this question
                    </button>
                  )}
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
              {currentQuestion.type === 'text' || currentQuestion.type === 'number' ? (
                <button
                  onClick={() => {
                    const visible = getVisibleQuestions()
                    if (currentQuestionIndex < visible.length - 1) {
                      setCurrentQuestionIndex((prev) => prev + 1)
                    } else {
                      setScreen('creating')
                    }
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white font-medium rounded-lg hover:opacity-90 transition-all"
                >
                  Next →
                </button>
              ) : null}
            </div>
          </div>
        )}

        {screen === 'creating' && (
          <div className="w-full max-w-md mx-auto px-4 text-center">
            <div className="mb-8">
              {logoError ? (
                <div className="text-6xl mb-4">🏃</div>
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
              {creatingSteps[creatingStep]}
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

            <div className="mt-12">
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden max-w-md mx-auto shadow-inner">
                <div
                  className="h-full bg-black transition-all duration-700 rounded-full shadow-lg"
                  style={{ width: `${((creatingStep + 1) / creatingSteps.length) * 100}%` }}
                />
              </div>
              <p className="text-sm text-text-secondary mt-3">
                {creatingStep + 1} of {creatingSteps.length}
              </p>
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
                    Nutrition Screening Complete!
                  </h2>
                  <p className="text-lg text-text-secondary mb-8">
                    Your nutrition data has been saved. Download your personalized nutrition plan with daily calorie targets, macro breakdown, and meal suggestions.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={async () => {
                        try {
                          setIsDownloading(true)
                          
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
                        } finally {
                          setIsDownloading(false)
                        }
                      }}
                      disabled={isDownloading}
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isDownloading ? 'Generating PDF...' : 'Download Nutrition Plan'}
                    </button>
                    <button
                      onClick={() => router.push('/dashboard/performance-setup')}
                      className="px-8 py-4 bg-white border-2 border-gray-300 text-text-primary font-bold text-lg rounded-lg shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all duration-200"
                    >
                      Back to Performance Setup
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
