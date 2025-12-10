'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { MOVEMENT_TESTS, getPathway, getPathwayDescription } from '@/src/lib/movementScreeningConfig'
import type { MovementTest } from '@/src/lib/movementScreeningConfig'

type Screen = 'intro' | 'test' | 'results' | 'saving' | 'complete'

export default function MovementScreeningPage() {
  const router = useRouter()
  const [screen, setScreen] = useState<Screen>('intro')
  const [currentTestIndex, setCurrentTestIndex] = useState(0)
  const [scores, setScores] = useState<Record<string, any>>({})
  const [logoError, setLogoError] = useState(false)
  const [savingError, setSavingError] = useState<string | null>(null)
  const [currentSide, setCurrentSide] = useState<'left' | 'right' | 'both'>('left')

  const currentTest = MOVEMENT_TESTS[currentTestIndex]
  const progress = ((currentTestIndex + 1) / MOVEMENT_TESTS.length) * 100

  const handleScore = (score: 0 | 1 | 2) => {
    if (currentTest.hasLeftRight) {
      if (currentSide === 'left') {
        setScores(prev => ({
          ...prev,
          [currentTest.id]: {
            ...(prev[currentTest.id] || {}),
            left: score
          }
        }))
        setCurrentSide('right')
      } else {
        setScores(prev => ({
          ...prev,
          [currentTest.id]: {
            ...(prev[currentTest.id] || {}),
            right: score
          }
        }))
        // Move to next test
        if (currentTestIndex < MOVEMENT_TESTS.length - 1) {
          setCurrentTestIndex(prev => prev + 1)
          setCurrentSide('left')
        } else {
          calculateResults()
        }
      }
    } else {
      setScores(prev => ({
        ...prev,
        [currentTest.id]: score
      }))
      // Move to next test
      if (currentTestIndex < MOVEMENT_TESTS.length - 1) {
        setCurrentTestIndex(prev => prev + 1)
        setCurrentSide('left')
      } else {
        calculateResults()
      }
    }
  }

  const getCurrentScore = (side?: 'left' | 'right'): number | null => {
    const testScore = scores[currentTest.id]
    if (!testScore) return null
    if (currentTest.hasLeftRight && side) {
      return testScore[side] ?? null
    }
    return typeof testScore === 'number' ? testScore : null
  }

  const handleBack = () => {
    if (currentTest.hasLeftRight && currentSide === 'right') {
      setCurrentSide('left')
    } else if (currentTestIndex > 0) {
      setCurrentTestIndex(prev => prev - 1)
      const prevTest = MOVEMENT_TESTS[currentTestIndex - 1]
      if (prevTest.hasLeftRight) {
        setCurrentSide('right')
      } else {
        setCurrentSide('left')
      }
    }
  }

  const calculateResults = () => {
    let total = 0
    const scoreObject: Record<string, any> = {}

    MOVEMENT_TESTS.forEach(test => {
      const testScore = scores[test.id]
      if (test.hasLeftRight && testScore) {
        const left = testScore.left ?? 0
        const right = testScore.right ?? 0
        total += left + right
        scoreObject[test.id] = { left, right }
      } else if (typeof testScore === 'number') {
        total += testScore
        scoreObject[test.id] = testScore
      }
    })

    const pathway = getPathway(total)
    
    setScores(prev => ({
      ...prev,
      _total: total,
      _pathway: pathway,
      _scores: scoreObject
    }))

    setScreen('results')
  }

  const saveResults = async () => {
    try {
      setSavingError(null)
      setScreen('saving')

      const { createClient } = await import('@supabase/supabase-js')
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase is not configured')
      }
      
      const supabase = createClient(supabaseUrl, supabaseAnonKey)
      const { data: userData } = await supabase.auth.getUser()
      
      if (!userData?.user) {
        throw new Error('User not authenticated')
      }

      // Check if strength_assessment exists
      const { data: existing } = await supabase
        .from('strength_assessment')
        .select('id')
        .eq('user_id', userData.user.id)
        .single()

      if (existing) {
        const { error } = await supabase
          .from('strength_assessment')
          .update({
            movement_screening_completed: true,
            movement_screening_scores: scores._scores,
            movement_screening_total: scores._total,
            movement_screening_pathway: scores._pathway,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userData.user.id)

        if (error) throw error
      } else {
        // Create record if it doesn't exist
        const { error } = await supabase
          .from('strength_assessment')
          .insert({
            user_id: userData.user.id,
            movement_screening_completed: true,
            movement_screening_scores: scores._scores,
            movement_screening_total: scores._total,
            movement_screening_pathway: scores._pathway
          })

        if (error) throw error
      }

      setScreen('complete')
    } catch (err: any) {
      console.error('Error saving movement screening:', err)
      setSavingError(err.message || 'Failed to save results')
      setScreen('results')
    }
  }

  // Calculate running total
  const getRunningTotal = (): number => {
    let total = 0
    MOVEMENT_TESTS.forEach((test, index) => {
      if (index < currentTestIndex) {
        const testScore = scores[test.id]
        if (test.hasLeftRight && testScore) {
          total += (testScore.left ?? 0) + (testScore.right ?? 0)
        } else if (typeof testScore === 'number') {
          total += testScore
        }
      } else if (index === currentTestIndex && !currentTest.hasLeftRight) {
        const testScore = scores[test.id]
        if (typeof testScore === 'number') {
          total += testScore
        }
      } else if (index === currentTestIndex && currentTest.hasLeftRight && currentSide === 'right') {
        const testScore = scores[test.id]
        if (testScore) {
          total += (testScore.left ?? 0) + (testScore.right ?? 0)
        }
      }
    })
    return total
  }

  if (screen === 'intro') {
    return (
      <div className="min-h-screen bg-white flex flex-col pt-24 sm:pt-32 pb-16">
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

        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl w-full text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Movement Screening
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8">
              Time required: 8–10 minutes
            </p>
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">⭐ How to Use This Screen</h2>
              <ul className="space-y-2 text-gray-700 mb-4">
                <li>• Follow each test exactly as described</li>
                <li>• Score yourself after each one</li>
                <li>• Add up your total score</li>
                <li>• Your score determines your personalized strength pathway</li>
              </ul>
              <div className="bg-white rounded p-4 mt-4">
                <h3 className="font-semibold text-gray-900 mb-2">Scoring System:</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li><strong>2</strong> = Looks and feels good</li>
                  <li><strong>1</strong> = Some wobble or restriction</li>
                  <li><strong>0</strong> = Big struggle / painful / can't do it</li>
                </ul>
                <p className="text-xs text-gray-600 mt-2">Pain = automatic 0. If unsure, choose the lower number.</p>
              </div>
            </div>
            <button
              onClick={() => setScreen('test')}
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:opacity-90 transition-opacity shadow-lg"
            >
              Start Screening
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (screen === 'test' && currentTest) {
    const runningTotal = getRunningTotal()
    const leftScore = currentTest.hasLeftRight ? getCurrentScore('left') : null
    const rightScore = currentTest.hasLeftRight ? getCurrentScore('right') : null

    return (
      <div className="min-h-screen bg-white flex flex-col pt-24 sm:pt-32 pb-16">
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
            </div>
          </div>
        </header>

        {/* Progress Bar */}
        <div className="fixed top-16 sm:top-20 left-0 right-0 z-10 bg-gray-100 h-1">
          <div
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 h-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl w-full">
            {/* Test Header */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-primary uppercase tracking-wide">
                  Test {currentTestIndex + 1} of {MOVEMENT_TESTS.length}
                </span>
                <span className="text-sm text-gray-600">
                  Running Total: <strong>{runningTotal}</strong> / 14
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                {currentTest.name}
              </h2>
              <p className="text-lg text-gray-600">
                {currentTest.whatItTests}
              </p>
            </div>

            {/* Current Side Indicator */}
            {currentTest.hasLeftRight && (
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-center font-semibold text-blue-900">
                  {currentSide === 'left' ? 'Left Side' : 'Right Side'}
                  {leftScore !== null && currentSide === 'right' && (
                    <span className="ml-2 text-sm text-blue-700">(Left: {leftScore})</span>
                  )}
                </p>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">How to do it:</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                {currentTest.instructions.map((instruction, i) => (
                  <li key={i}>{instruction}</li>
                ))}
              </ol>
            </div>

            {/* Scoring Options */}
            <div className="bg-white rounded-lg border-2 border-gray-200 p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Score yourself:</h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleScore(2)}
                  className="w-full text-left p-4 rounded-lg border-2 border-green-200 bg-green-50 hover:bg-green-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-green-900">Score: 2</div>
                      <div className="text-sm text-green-700">{currentTest.scoring.score2}</div>
                    </div>
                    <div className="text-2xl">✓</div>
                  </div>
                </button>
                <button
                  onClick={() => handleScore(1)}
                  className="w-full text-left p-4 rounded-lg border-2 border-yellow-200 bg-yellow-50 hover:bg-yellow-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-yellow-900">Score: 1</div>
                      <div className="text-sm text-yellow-700">{currentTest.scoring.score1}</div>
                    </div>
                    <div className="text-2xl">→</div>
                  </div>
                </button>
                <button
                  onClick={() => handleScore(0)}
                  className="w-full text-left p-4 rounded-lg border-2 border-red-200 bg-red-50 hover:bg-red-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-red-900">Score: 0</div>
                      <div className="text-sm text-red-700">{currentTest.scoring.score0}</div>
                    </div>
                    <div className="text-2xl">✗</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <button
                onClick={handleBack}
                disabled={currentTestIndex === 0 && currentSide === 'left'}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  currentTestIndex === 0 && currentSide === 'left'
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-text-secondary hover:text-text-primary hover:bg-gray-50'
                }`}
              >
                ← Back
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (screen === 'results') {
    const total = scores._total || 0
    const pathway = scores._pathway || getPathway(total)
    const description = getPathwayDescription(pathway)

    return (
      <div className="min-h-screen bg-white flex flex-col pt-24 sm:pt-32 pb-16">
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
            </div>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl w-full">
            <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 text-center">
                Your Results
              </h2>

              {/* Total Score */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6 text-center">
                <div className="text-5xl font-bold text-gray-900 mb-2">
                  {total} / 14
                </div>
                <div className="text-lg text-gray-600">Total Score</div>
              </div>

              {/* Pathway */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {pathway}
                </h3>
                <p className="text-gray-700">
                  {description}
                </p>
              </div>

              {/* Individual Scores */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Your Scores:</h3>
                <div className="space-y-2">
                  {MOVEMENT_TESTS.map((test, i) => {
                    const testScore = scores._scores?.[test.id]
                    let displayScore = ''
                    if (test.hasLeftRight && testScore) {
                      displayScore = `L: ${testScore.left ?? 0}, R: ${testScore.right ?? 0}`
                    } else if (typeof testScore === 'number') {
                      displayScore = String(testScore)
                    }
                    return (
                      <div key={test.id} className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-gray-700">{i + 1}. {test.name}</span>
                        <span className="font-semibold text-gray-900">{displayScore}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {savingError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {savingError}
                </div>
              )}

              <button
                onClick={saveResults}
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:opacity-90 transition-opacity shadow-lg"
              >
                Save Results
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (screen === 'saving') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Saving your results...</p>
        </div>
      </div>
    )
  }

  if (screen === 'complete') {
    return (
      <div className="min-h-screen bg-white flex flex-col pt-24 sm:pt-32 pb-16">
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
            </div>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl w-full text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                Screening Complete!
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Your movement screening results have been saved. We'll use this information to create your personalized strength program.
              </p>
            </div>
            <button
              onClick={() => router.push('/dashboard/performance-setup')}
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:opacity-90 transition-opacity shadow-lg"
            >
              Return to Performance Setup
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}


