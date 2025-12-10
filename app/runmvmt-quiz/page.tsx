'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { loadStripe } from '@stripe/stripe-js'
import { QUIZ_QUESTIONS } from '@/src/lib/runmvmtQuizConfig'
import { generateInsights } from '@/src/lib/runmvmtInsights'
import { classifyPersona } from '@/src/lib/runmvmtPersonas'
import { generateTrainingPlan } from '@/src/lib/runmvmtPlanGenerator'
import type { QuizQuestion, QuizAnswers, AnswerValue, TrainingPlan, WeeklyPlan } from '@/src/lib/runmvmtTypes'
import { 
  trackLead, 
  trackCompleteRegistration, 
  trackAddToCart, 
  trackInitiateCheckout, 
  trackViewContent 
} from '@/src/lib/facebookPixel'

// Sample reviews data
const reviews = [
  {
    name: 'Sarah M.',
    distance: 'Marathon Runner',
    rating: 5,
    text: 'This training plan completely transformed my running. I went from struggling with 5K to completing my first marathon in 4 months. The personalized approach made all the difference!',
  },
  {
    name: 'James T.',
    distance: 'Half Marathon',
    rating: 5,
    text: 'Best investment I\'ve made in my running journey. The plan adapted to my busy schedule and helped me shave 15 minutes off my half marathon time. Highly recommend!',
  },
  {
    name: 'Emma L.',
    distance: 'Ultra Runner',
    rating: 5,
    text: 'As someone training for my first 50K, I needed a plan that understood ultra running. RUN MVMT delivered exactly that. The injury prevention focus kept me healthy throughout training.',
  },
  {
    name: 'Michael R.',
    distance: '10K Runner',
    rating: 5,
    text: 'I was skeptical at first, but the science-backed approach and personalized recommendations exceeded my expectations. Finally broke my 10K PR after years of plateauing.',
  },
  {
    name: 'Lisa K.',
    distance: '5K Runner',
    rating: 5,
    text: 'Perfect for beginners! The plan was easy to follow and built my confidence gradually. I went from couch to 5K in 8 weeks and now I\'m hooked on running.',
  },
  {
    name: 'David P.',
    distance: 'Marathon Runner',
    rating: 5,
    text: 'The strength training integration was a game-changer. I\'ve never felt stronger or more injury-resistant. Qualified for Boston thanks to this program!',
  },
]

const stripePromise =
  typeof window !== 'undefined' && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
    : null

// Log Stripe initialization
if (typeof window !== 'undefined') {
  if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    console.log('Stripe publishable key found:', process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.substring(0, 20) + '...')
  } else {
    console.warn('⚠️ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY not found in environment')
  }
}

type Screen = 'intro' | 'question' | 'creating' | 'email' | 'check-email' | 'final'

export default function RunMvmtQuizPage() {
  const [screen, setScreen] = useState<Screen>('intro')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswers>({})
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [creatingStep, setCreatingStep] = useState(0)
  const [logoError, setLogoError] = useState(false)
  const [modalLogoError, setModalLogoError] = useState(false)
  const [creatingLogoError, setCreatingLogoError] = useState(false)
  const [selectedWeek, setSelectedWeek] = useState(1)
  const [expandedInsight, setExpandedInsight] = useState<number | null>(null)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [checkoutClientSecret, setCheckoutClientSecret] = useState<string | null>(null)
  const checkoutRef = useRef<any>(null)
  const [userEmail, setUserEmail] = useState('')
  const [userFirstName, setUserFirstName] = useState('')
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null)
  const [showReviewsModal, setShowReviewsModal] = useState(false)
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0)

  // If coming back from magic-link with ?screen=final, restore quiz data and jump to final screen
  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const params = new URLSearchParams(window.location.search)
      const targetScreen = params.get('screen')

      if (targetScreen === 'final') {
        const stored = localStorage.getItem('runmvmt_training_quiz')
        if (!stored) {
          console.warn('No stored quiz data found for magic-link login')
          return
        }

        const { firstName, quizData } = JSON.parse(stored)

        if (quizData && typeof quizData === 'object') {
          setAnswers(quizData)
        }

        if (firstName) {
          setUserFirstName(firstName)
        }

        setScreen('final')
      }
    } catch (err) {
      console.error('Failed to restore quiz data from localStorage:', err)
    }
  }, [])

  // Check if user is logged in (Supabase) and store their email for header display
  useEffect(() => {
    let isMounted = true

    const checkUser = async () => {
      try {
        const { supabase } = await import('@/src/lib/supabaseClient')
        if (!supabase) return

        const { data, error } = await supabase.auth.getUser()
        if (error) {
          console.warn('Error getting current user:', error)
          return
        }

        if (!isMounted) return
        if (data?.user?.email) {
          setCurrentUserEmail(data.user.email)
        } else {
          setCurrentUserEmail(null)
        }
      } catch (err) {
        console.warn('Error checking auth user:', err)
      }
    }

    checkUser()

    return () => {
      isMounted = false
    }
  }, [])

  // Track quiz completion and ViewContent when screen changes
  useEffect(() => {
    if (screen === 'final' || screen === 'creating') {
      // Track lead when quiz is completed
      trackLead('RunMVMT Quiz Completion')
      // Track ViewContent for quiz completion
      trackViewContent('RunMVMT Quiz Results', 'quiz')
    }
  }, [screen])

  // Filter questions based on conditional logic
  const getVisibleQuestions = (): QuizQuestion[] => {
    const visible: QuizQuestion[] = []
    for (const question of QUIZ_QUESTIONS) {
      // Skip race_date if has_race_date is not "yes"
      if (question.id === "race_date") {
        if (answers["has_race_date"] === "yes") {
          visible.push(question)
        }
      }
      // Skip other_challenge_detail if biggest_challenge is not "other"
      else if (question.id === "other_challenge_detail") {
        if (answers["biggest_challenge"] === "other") {
          visible.push(question)
        }
      }
      // Skip threshold_hr if uses_hr is not "hr_yes"
      else if (question.id === "threshold_hr") {
        if (answers["uses_hr"] === "hr_yes") {
          visible.push(question)
        }
      }
      else {
        visible.push(question)
      }
    }
    return visible
  }

  const visibleQuestions = getVisibleQuestions()
  // Ensure currentQuestionIndex is within bounds
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

  const handleSkip = () => {
    const visible = getVisibleQuestions()
    if (currentQuestionIndex < visible.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      setScreen('creating')
    }
  }

  const handleStart = () => {
    trackViewContent('RunMVMT Quiz Start', 'quiz')
    setScreen('question')
    setCurrentQuestionIndex(0)
  }

  const handleCheckout = async () => {
    try {
      // Track AddToCart when user clicks checkout button
      trackAddToCart(99.00, 'AUD')
      
      // Verify Stripe is available
      if (!stripePromise) {
        alert('Payment system is not ready yet. Please check your configuration.')
        return
      }

      // Wait for Stripe to be actually loaded
      const stripe = await stripePromise
      if (!stripe) {
        alert('Failed to load Stripe. Please refresh the page and try again.')
        return
      }

      setIsProcessingPayment(true)
      setCheckoutError(null)

      // Clean up any existing checkout before creating new one
      if (checkoutRef.current) {
        try {
          checkoutRef.current.unmount()
        } catch (error) {
          console.warn('Error cleaning up existing checkout:', error)
        }
        checkoutRef.current = null
      }

      // Create embedded checkout session
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to create checkout session')
      }

      const data = await res.json()
      console.log('Checkout session response:', data)

      if (!data.clientSecret) {
        console.error('No client secret in response:', data)
        throw new Error(data.error || 'No client secret received from server')
      }

      console.log('Setting client secret and showing checkout...')
      setCheckoutClientSecret(data.clientSecret)
      setShowCheckout(true)
      
      // Track InitiateCheckout when Stripe form is shown
      trackInitiateCheckout(99.00, 'AUD')
      
      setIsProcessingPayment(false)
    } catch (error: any) {
      console.error('Error starting checkout:', error)
      setCheckoutError(error.message || 'Unable to start checkout. Please try again.')
      setIsProcessingPayment(false)
    }
  }

  const handleSendMagicLink = async () => {
    setIsSubmittingEmail(true)
    setCheckoutError(null)

    try {
      // Validate email
      if (!userEmail || !userEmail.includes('@')) {
        throw new Error('Please enter a valid email address')
      }

      // Debug: Log environment variables
      console.log('Environment check:', {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...',
      })

      // Check if Supabase env vars are available
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        throw new Error('Supabase is not configured. Please check your environment variables and restart the server.')
      }

      // Save to localStorage
      localStorage.setItem(
        'runmvmt_training_quiz',
        JSON.stringify({ 
          firstName: userFirstName, 
          quizData: answers 
        })
      )

      // Import supabase dynamically
      const supabaseModule = await import('@/src/lib/supabaseClient')
      const supabase = supabaseModule.supabase

      // Validate Supabase client
      if (!supabase) {
        throw new Error('Failed to initialize Supabase client. Please check your environment variables and restart the server.')
      }

      console.log('Sending magic link to:', userEmail)
      console.log('Redirect URL:', `${window.location.origin}/auth/callback`)

      // Send magic link with explicit error handling
      const { data, error } = await supabase.auth.signInWithOtp({
        email: userEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        console.error('Supabase auth error:', error)
        // Provide user-friendly error messages
        if (error.message.includes('Invalid email') || error.message.includes('invalid')) {
          throw new Error('Please enter a valid email address.')
        } else if (error.message.includes('rate limit') || error.message.includes('too many')) {
          throw new Error('Too many requests. Please wait a moment and try again.')
        } else if (error.message.includes('Email rate limit')) {
          throw new Error('Email sending is temporarily limited. Please try again in a few minutes.')
        } else {
          throw new Error(error.message || 'Failed to send email. Please try again.')
        }
      }

      // Track registration/lead when magic link is sent successfully
      trackCompleteRegistration()
      trackLead('RunMVMT Account Signup')

      console.log('Magic link sent successfully:', data)

      // Show check email screen
      setScreen('check-email')
    } catch (err: any) {
      console.error('Error sending magic link:', err)
      
      // Provide more specific error messages
      let errorMessage = 'Something went wrong. Please try again.'
      
      if (err.message) {
        errorMessage = err.message
      } else if (err instanceof TypeError && err.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection and try again. If this persists, check your Supabase project settings in the dashboard.'
      } else if (err.code === 'invalid_email') {
        errorMessage = 'Please enter a valid email address.'
      } else if (err.message?.includes('fetch') || err.message?.includes('Failed to fetch')) {
        errorMessage = 'Failed to connect to Supabase. Please check your internet connection and Supabase project settings. Make sure your redirect URL is configured in Supabase dashboard.'
      }
      
      setCheckoutError(errorMessage)
    } finally {
      setIsSubmittingEmail(false)
    }
  }

  // Handle checkout success redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('checkout') === 'success') {
      // Redirect to performance setup page
      window.location.href = '/dashboard/performance-setup?checkout=success'
    }
  }, [])

  // Mount embedded checkout when client secret is ready
  useEffect(() => {
    // Only clean up when hiding checkout, not when mounting
    if (!showCheckout || !checkoutClientSecret) {
      if (checkoutRef.current) {
        try {
          checkoutRef.current.unmount()
        } catch (error) {
          console.warn('Error unmounting checkout:', error)
        }
        checkoutRef.current = null
      }
      return
    }

    // Check if Stripe is available
    if (!stripePromise) {
      setCheckoutError('Stripe is not configured. Please check your environment variables.')
      return
    }

    let isMounted = false
    let timeoutId: NodeJS.Timeout | null = null
    let mountedCheckout: any = null

    const mountCheckout = async () => {
      try {
        // Wait for Stripe to load
      const stripe = await stripePromise
      if (!stripe) {
          setCheckoutError('Failed to load Stripe. Please refresh the page.')
          return
        }

        // Check if we already have a checkout instance
        if (checkoutRef.current) {
          console.log('Checkout already exists, skipping mount')
          return
        }

        // Wait for DOM element with more attempts
        let attempts = 0
        const maxAttempts = 50
        let checkoutElement: HTMLElement | null = null

        while (attempts < maxAttempts && !checkoutElement) {
          checkoutElement = document.getElementById('checkout')
          if (!checkoutElement) {
            await new Promise(resolve => setTimeout(resolve, 100))
            attempts++
          }
        }

        if (!checkoutElement) {
          console.error('Checkout element not found after', maxAttempts, 'attempts')
          setCheckoutError('Payment form container not found. Please refresh the page.')
          return
        }

        // Final check - make sure we don't have a checkout already
        if (checkoutRef.current) {
          console.log('Checkout already exists (final check), aborting')
          return
        }

        // Clear element content
        checkoutElement.innerHTML = ''

        console.log('Creating Stripe embedded checkout...')
        console.log('Client secret length:', checkoutClientSecret.length)
        console.log('Checkout element:', checkoutElement)
        console.log('Element dimensions:', {
          width: checkoutElement.offsetWidth,
          height: checkoutElement.offsetHeight,
          visible: checkoutElement.offsetParent !== null
        })
        
        const checkout = await stripe.initEmbeddedCheckout({
          clientSecret: checkoutClientSecret,
        })

        console.log('Checkout object created:', checkout)
        console.log('Checkout object type:', typeof checkout)
        console.log('Checkout has mount method:', typeof checkout.mount === 'function')

        // Store reference BEFORE mounting to prevent race conditions
        checkoutRef.current = checkout
        mountedCheckout = checkout
        isMounted = true

        // Mount the checkout
        console.log('Attempting to mount checkout to element...')
        checkout.mount(checkoutElement)
        console.log('Mount call completed')
        console.log('✅ Checkout mounted successfully!')
        console.log('Checkout element after mount:', checkoutElement)
        console.log('Checkout ref after mount:', checkoutRef.current)
        
        // Force a small delay to ensure the form renders, then hide loading
        setTimeout(() => {
          setCheckoutError(null)
          // Force React to recognize the checkout is mounted
          if (checkoutRef.current) {
            console.log('Checkout confirmed mounted, hiding loading overlay')
          }
        }, 500)
        
        // Redirect is handled automatically by Stripe via return_url after payment
        // The return_url in /api/create-checkout-session will redirect to:
        // /dashboard/performance-setup?checkout=success
    } catch (error) {
        console.error('❌ Error initializing checkout:', error)
        if (error instanceof Error) {
          if (error.message.includes('multiple Embedded Checkout')) {
            setCheckoutError('Payment form is already loaded. Please refresh the page.')
            // Force cleanup
            if (checkoutRef.current) {
              try {
                checkoutRef.current.unmount()
              } catch (e) {
                // Ignore cleanup errors
              }
            }
            checkoutRef.current = null
          } else {
            setCheckoutError(`Failed to load payment form: ${error.message}`)
          }
        } else {
          setCheckoutError('Failed to load payment form. Please try again.')
        }
        checkoutRef.current = null
        isMounted = false
      }
    }

    // Small delay to ensure DOM is ready and React has finished rendering
    // Increased delay to ensure element is fully rendered
    timeoutId = setTimeout(() => {
      mountCheckout()
    }, 500)

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      // Only clean up if we're not in the process of mounting
      // This prevents cleanup from interfering with mounting
      if (!isMounted && checkoutRef.current) {
        try {
          checkoutRef.current.unmount()
        } catch (error) {
          // Ignore unmount errors during cleanup
        }
        checkoutRef.current = null
      }
    }
  }, [showCheckout, checkoutClientSecret]) // Removed stripePromise from dependencies

  const handleDownloadReport = async () => {
    try {
      const res = await fetch("/api/generate-runmvmt-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: "Runner",
          answers: answers
        }),
      });
      
      if (!res.ok) {
        throw new Error("Failed to generate report");
      }
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "runmvmt-training-plan.pdf";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading report:", error);
      alert("Failed to download report. Please try again.");
    }
  }

  const getCurrentAnswer = (): AnswerValue => {
    if (!currentQuestion) return null
    return answers[currentQuestion.id] || null
  }

  // Creating plan steps
  const creatingSteps = [
    "Calculating your optimal heart rate zones...",
    "Optimising key workouts for your fitness level...",
    "Creating your ideal training week structure...",
    "Analysing your current running patterns...",
    "Building your 12-week progression plan...",
    "Personalising recovery and strength recommendations...",
    "Finalising your custom training program..."
  ]

  // Handle creating screen progression
  useEffect(() => {
    if (screen === 'creating') {
      const timer = setInterval(() => {
        setCreatingStep((prev) => {
          if (prev < creatingSteps.length - 1) {
            return prev + 1
          } else {
            clearInterval(timer)
            setTimeout(() => {
              setScreen('email')
            }, 1000)
            return prev
          }
        })
      }, 1200) // Change step every 1.2 seconds

      return () => clearInterval(timer)
    } else {
      setCreatingStep(0)
    }
  }, [screen, creatingSteps.length])

  // Generate insights when on final screen
  const insights = useMemo(() => {
    if (screen === 'final' && Object.keys(answers).length > 0) {
      return generateInsights(answers)
    }
    return []
  }, [screen, answers])

  // Generate training plan when on final screen
  const trainingPlan = useMemo<TrainingPlan | null>(() => {
    if (screen === 'final' && Object.keys(answers).length > 0) {
      try {
        const persona = classifyPersona(answers)
        return generateTrainingPlan(answers, persona)
      } catch (error) {
        console.error('Error generating training plan:', error)
        return null
      }
    }
    return null
  }, [screen, answers])

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Brand Header - Hidden on question and creating screens */}
      {screen !== 'question' && screen !== 'creating' && (
        <header className="fixed top-0 left-0 right-0 z-20 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {logoError ? (
                  <div className="text-primary text-2xl sm:text-3xl font-bold">
                    RUN MVMT
                  </div>
                ) : (
                  <div className="relative h-10 sm:h-12 w-auto">
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
                <div className="hidden lg:block border-l border-gray-300 pl-4">
                  <p className="text-sm text-text-secondary italic">
                    A community of runners, moving as one.
                  </p>
                </div>
              </div>
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/about" className="text-text-secondary hover:text-text-primary text-sm font-medium transition-colors">ABOUT</Link>
                <Link href="/pricing" className="text-text-secondary hover:text-text-primary text-sm font-medium transition-colors">PRICING</Link>
                <a href="#" className="text-text-secondary hover:text-text-primary text-sm font-medium transition-colors">WHY RUN MVMT?</a>
              </nav>
              <div className="hidden md:flex items-center gap-4">
                {currentUserEmail ? (
                  <div className="flex items-center gap-3 px-3 py-2 rounded-full border border-gray-200 bg-white shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center text-xs font-semibold text-white">
                      {currentUserEmail.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-text-secondary uppercase tracking-wide">
                        Logged in
                      </span>
                      <span className="text-xs font-medium text-text-primary max-w-[140px] truncate">
                        {currentUserEmail}
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
                <button className="px-4 py-2 text-sm font-medium text-text-primary border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  LOG IN
                </button>
                <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 rounded-lg hover:opacity-90 transition-all">
                  SIGN UP FOR FREE
                </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>
      )}


      {/* Main Content */}
      <main className={`flex-1 ${screen === 'question' ? 'pt-32 sm:pt-36' : screen === 'intro' ? '' : 'pt-24 sm:pt-28'} ${screen === 'intro' ? '' : 'flex items-center justify-center py-8 sm:py-12'}`}>
        <div
          className={`w-full transition-opacity duration-300 ${
            isTransitioning ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {screen === 'intro' && (
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* Left Column - Text Content */}
                <div className="space-y-8">
                  <div>
                    <p className="text-sm sm:text-base text-text-secondary uppercase tracking-wide mb-3">
                      PERSONALISED RUNNING TRAINING PLANS
                    </p>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary leading-tight mb-6">
                      Training Plans That Make It Easy to Reach Your Race Goals
                    </h1>
                    <p className="text-lg sm:text-xl text-text-secondary leading-relaxed mb-8">
                      Reach your full potential with RUN MVMT: personalized training plans made specifically for runners who want to achieve something amazing in their running journey.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <button
                      onClick={handleStart}
                      className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white font-bold text-base sm:text-lg rounded-lg shadow-lg hover:shadow-xl hover:opacity-90 transition-all duration-200"
                    >
                      👉 Start My Plan
                    </button>
                    
                    <p className="text-sm text-text-secondary">
                      Free • No credit card required • Takes less than 2 minutes
                    </p>
                  </div>

                  {/* Social Proof */}
                  <div className="pt-4">
                    <button
                      onClick={() => {
                        setShowReviewsModal(true)
                        setCurrentReviewIndex(0)
                      }}
                      className="flex items-center justify-center sm:justify-start gap-2 cursor-pointer hover:opacity-80 transition-opacity group w-full sm:w-auto"
                    >
                      <div className="flex -space-x-2">
                        {/* Avatar icon bubbles */}
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border-2 border-white group-hover:scale-110 transition-transform"></div>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-white group-hover:scale-110 transition-transform"></div>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-blue-500 border-2 border-white group-hover:scale-110 transition-transform"></div>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 border-2 border-white group-hover:scale-110 transition-transform"></div>
                      </div>
                      <p className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors">
                        Over <span className="font-bold text-primary">10,000 runners</span> trained
                      </p>
                    </button>
                  </div>

                  {/* Credibility Row - Compact */}
                  <div className="pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-start gap-2">
                        <span className="text-primary text-lg mt-0.5 flex-shrink-0">✔</span>
                        <p className="text-sm text-text-primary leading-relaxed">
                          Created by elite athlete & national-level runner
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-primary text-lg mt-0.5 flex-shrink-0">✔</span>
                        <p className="text-sm text-text-primary leading-relaxed">
                          Evidence-based training from thousands of programs
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-primary text-lg mt-0.5 flex-shrink-0">✔</span>
                        <p className="text-sm text-text-primary leading-relaxed">
                          Designed to reduce injuries & build progress
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-primary text-lg mt-0.5 flex-shrink-0">✔</span>
                        <p className="text-sm text-text-primary leading-relaxed">
                          Fits your schedule — 2 to 6 days per week
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Visual Elements */}
                <div className="relative hidden lg:block">
                  {/* Mock Training Plan Preview Card */}
                  <div className="relative bg-white rounded-2xl shadow-2xl p-6 border border-gray-200 transform rotate-2">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-text-primary">TRAINING PLAN</h3>
                        <div className="text-xs text-text-secondary">Week 1 of 12</div>
                      </div>
                      
                      {/* Mini Calendar */}
                      <div className="grid grid-cols-7 gap-1">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                          <div key={i} className={`text-center p-2 rounded ${i === 0 || i === 2 || i === 4 || i === 6 ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
                            <div className="text-xs text-text-secondary mb-1">{day}</div>
                            {i === 0 || i === 2 || i === 4 || i === 6 ? (
                              <div className="text-xs font-semibold text-blue-700">8km</div>
                            ) : null}
                          </div>
                        ))}
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-xs text-text-secondary mb-1">Total Distance</div>
                          <div className="text-xl font-bold text-primary">42km</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-xs text-text-secondary mb-1">Training Days</div>
                          <div className="text-xl font-bold text-primary">5 days</div>
                        </div>
                      </div>

                      {/* Progress Circle Placeholder */}
                      <div className="flex items-center justify-center pt-2">
                        <div className="relative w-24 h-24">
                          <svg className="transform -rotate-90 w-24 h-24">
                            <circle
                              cx="48"
                              cy="48"
                              r="40"
                              stroke="#E5E7EB"
                              strokeWidth="8"
                              fill="none"
                            />
                            <circle
                              cx="48"
                              cy="48"
                              r="40"
                              stroke="#145A5A"
                              strokeWidth="8"
                              fill="none"
                              strokeDasharray={`${2 * Math.PI * 40}`}
                              strokeDashoffset={`${2 * Math.PI * 40 * 0.3}`}
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <div className="text-lg font-bold text-text-primary">82%</div>
                            <div className="text-xs text-text-secondary">Complete</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute -top-8 -right-8 w-32 h-32 bg-blue-100 rounded-full opacity-50 blur-2xl"></div>
                  <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-purple-100 rounded-full opacity-50 blur-2xl"></div>
                  <div className="absolute top-1/2 right-0 w-24 h-24 bg-pink-100 rounded-full opacity-50 blur-xl transform translate-x-1/2"></div>
                </div>
              </div>

              {/* Footer Bar - Sports Categories */}
              <div className="mt-16 lg:mt-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 py-4 rounded-lg">
                <div className="flex items-center justify-center gap-4 text-white text-sm font-medium overflow-x-auto">
                  <span>5K</span>
                  <span>•</span>
                  <span>10K</span>
                  <span>•</span>
                  <span>HALF MARATHON</span>
                  <span>•</span>
                  <span>MARATHON</span>
                  <span>•</span>
                  <span>50K ULTRA</span>
                  <span>•</span>
                  <span>80K ULTRA</span>
                  <span>•</span>
                  <span>100K+ ULTRA</span>
                </div>
              </div>
            </div>
          )}

          {screen === 'question' && currentQuestion && (
            <>
              {/* Blurred Background Preview - Training Plan Teaser */}
              <div className="fixed inset-0 bg-background overflow-hidden">
                <div className="absolute inset-0 blur-md opacity-50">
                  <div className="h-full w-full bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 p-6 sm:p-8 overflow-y-auto">
                    {/* Full Training Dashboard Preview */}
                    <div className="max-w-7xl mx-auto space-y-6">
                      {/* Top Stats Bar */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-white rounded-lg shadow-md p-4">
                          <div className="text-xs text-text-secondary mb-1">Total Distance</div>
                          <div className="text-2xl font-bold text-primary">342km</div>
                          <div className="text-xs text-text-secondary mt-1">This month</div>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-4">
                          <div className="text-xs text-text-secondary mb-1">Training Days</div>
                          <div className="text-2xl font-bold text-primary">18</div>
                          <div className="text-xs text-text-secondary mt-1">This month</div>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-4">
                          <div className="text-xs text-text-secondary mb-1">Avg Pace</div>
                          <div className="text-2xl font-bold text-primary">5:24</div>
                          <div className="text-xs text-text-secondary mt-1">per km</div>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-4">
                          <div className="text-xs text-text-secondary mb-1">Consistency</div>
                          <div className="text-2xl font-bold text-primary">94%</div>
                          <div className="text-xs text-text-secondary mt-1">Completion rate</div>
                        </div>
                      </div>

                      {/* Training Calendar */}
                      <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-bold text-text-primary">TRAINING CALENDAR</h3>
                          <div className="text-sm text-text-secondary">Week {Math.floor(currentQuestionIndex / 7) + 1} of 12</div>
                        </div>
                        <div className="grid grid-cols-7 gap-2 mb-4">
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                            const weekDay = i + 1;
                            const hasWorkout = [1, 3, 5, 7].includes(weekDay);
                            return (
                              <div key={day} className={`rounded-lg p-3 text-center border-2 ${hasWorkout ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-200'}`}>
                                <div className="text-xs text-text-secondary mb-1">{day}</div>
                                <div className="text-xs font-semibold text-text-primary mb-2">Day {weekDay}</div>
                                {hasWorkout && (
                                  <div className="text-xs text-blue-700 font-medium">8km</div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex gap-4 text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded"></div>
                            <span className="text-text-secondary">Easy Run</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-orange-400 rounded"></div>
                            <span className="text-text-secondary">Tempo</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-400 rounded"></div>
                            <span className="text-text-secondary">Long Run</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-purple-400 rounded"></div>
                            <span className="text-text-secondary">Intervals</span>
                          </div>
                        </div>
                      </div>

                      {/* Two Column Layout */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Weekly Breakdown */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                          <h4 className="text-lg font-semibold text-text-primary mb-4">WEEKLY BREAKDOWN</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                              <span className="text-sm text-text-primary">Monday</span>
                              <span className="text-sm font-semibold text-primary">Easy Run - 8km</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                              <span className="text-sm text-text-primary">Tuesday</span>
                              <span className="text-sm font-semibold text-primary">Rest Day</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                              <span className="text-sm text-text-primary">Wednesday</span>
                              <span className="text-sm font-semibold text-primary">Tempo - 6km</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                              <span className="text-sm text-text-primary">Thursday</span>
                              <span className="text-sm font-semibold text-primary">Easy Run - 7km</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                              <span className="text-sm text-text-primary">Friday</span>
                              <span className="text-sm font-semibold text-primary">Intervals - 5km</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                              <span className="text-sm text-text-primary">Saturday</span>
                              <span className="text-sm font-semibold text-primary">Rest Day</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-text-primary">Sunday</span>
                              <span className="text-sm font-semibold text-primary">Long Run - 16km</span>
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-semibold text-text-primary">Week Total</span>
                              <span className="text-lg font-bold text-primary">42km</span>
                            </div>
                          </div>
                        </div>

                        {/* Performance Analysis */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                          <h4 className="text-lg font-semibold text-text-primary mb-4">PERFORMANCE ANALYSIS</h4>
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-text-primary">Aerobic Base</span>
                                <span className="text-sm font-semibold text-primary">85%</span>
                              </div>
                              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: '85%' }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-text-primary">Speed Development</span>
                                <span className="text-sm font-semibold text-primary">72%</span>
                              </div>
                              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-orange-400 rounded-full" style={{ width: '72%' }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-text-primary">Endurance</span>
                                <span className="text-sm font-semibold text-primary">91%</span>
                              </div>
                              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-400 rounded-full" style={{ width: '91%' }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-text-primary">Recovery Quality</span>
                                <span className="text-sm font-semibold text-primary">78%</span>
                              </div>
                              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-400 rounded-full" style={{ width: '78%' }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Training Patterns */}
                      <div className="bg-white rounded-lg shadow-lg p-6">
                        <h4 className="text-lg font-semibold text-text-primary mb-4">TRAINING PATTERNS</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-primary mb-1">4.2</div>
                            <div className="text-xs text-text-secondary">Avg Sessions/Week</div>
                          </div>
                          <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-primary mb-1">10.2km</div>
                            <div className="text-xs text-text-secondary">Avg Distance/Session</div>
                          </div>
                          <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-primary mb-1">52min</div>
                            <div className="text-xs text-text-secondary">Avg Duration</div>
                          </div>
                        </div>
                      </div>

                      {/* Progress Chart Placeholder */}
                      <div className="bg-white rounded-lg shadow-lg p-6">
                        <h4 className="text-lg font-semibold text-text-primary mb-4">12-WEEK PROGRESSION</h4>
                        <div className="h-32 bg-gray-50 rounded-lg flex items-end justify-around p-4">
                          {[25, 28, 32, 30, 35, 38, 40, 42, 45, 38, 30, 20].map((height, i) => (
                            <div
                              key={i}
                              className="bg-primary rounded-t"
                              style={{
                                width: '6%',
                                height: `${(height / 50) * 100}%`,
                                minHeight: '8px'
                              }}
                            ></div>
                          ))}
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-text-secondary">
                          <span>Week 1</span>
                          <span>Week 6</span>
                          <span>Week 12</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Overlay for Quiz Question */}
              <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  {/* Modal Header with Gradient */}
                  <div className="bg-gradient-to-r from-black via-blue-600 via-purple-600 to-pink-500 rounded-t-2xl p-6 text-center">
                    <div className="flex justify-center items-center mb-2">
                      {modalLogoError ? (
                        <div className="text-white text-2xl font-bold">RUN MVMT</div>
                      ) : (
                        <div className="relative h-10 w-auto">
                          <Image
                            src="/images/Runmvmt7.png"
                            alt="RUN MVMT"
                            width={180}
                            height={48}
                            className="h-full w-auto object-contain"
                            onError={() => setModalLogoError(true)}
                          />
                        </div>
                      )}
                    </div>
                    <div className="text-white/90 text-sm">Let's personalize a training plan specifically for you...</div>
                  </div>

                  {/* Progress Bar */}
                  <div className="px-6 pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-text-secondary">Question {currentQuestionIndex + 1} of {visibleQuestions.length}</span>
                      <span className="text-xs text-text-secondary">{Math.round(((currentQuestionIndex + 1) / visibleQuestions.length) * 100)}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-black transition-all duration-300"
                        style={{ width: `${((currentQuestionIndex + 1) / visibleQuestions.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Question Content */}
                  <div className="p-6 sm:p-8 space-y-6">
                    <div className="text-center space-y-4">
                      <div className="text-xs sm:text-sm text-text-secondary uppercase tracking-wide">
                        {currentQuestion.section}
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-text-primary leading-tight">
                        {currentQuestion.question}
                      </h2>
                      {currentQuestion.helperText && (
                        <p className="text-sm text-text-secondary italic">
                          {currentQuestion.helperText}
                        </p>
                      )}
                    </div>

                    {/* Answer Options */}
                    <div className="space-y-3">
                      {currentQuestion.type === 'single_choice' && currentQuestion.options && (
                        <div className="grid gap-3">
                          {currentQuestion.options.map((option) => {
                            const isSelected = getCurrentAnswer() === option.id
                            return (
                              <button
                                key={option.id}
                                onClick={() => handleAnswer(option.id)}
                                className={`px-6 py-4 rounded-lg border-2 text-left transition-all ${
                                  isSelected
                                    ? 'border-black bg-black/10 text-black font-semibold'
                                    : 'border-gray-200 hover:border-black/50 text-text-primary'
                                }`}
                              >
                                {option.label}
                              </button>
                            )
                          })}
                        </div>
                      )}

                      {currentQuestion.type === 'multi_choice' && currentQuestion.options && (
                        <div className="grid gap-3">
                          {currentQuestion.options.map((option) => {
                            const currentValue = getCurrentAnswer() as string[] || []
                            const isSelected = currentValue.includes(option.id)
                            return (
                              <button
                                key={option.id}
                                onClick={() => handleMultiChoice(option.id)}
                                className={`px-6 py-4 rounded-lg border-2 text-left transition-all ${
                                  isSelected
                                    ? 'border-black bg-black/10 text-black font-semibold'
                                    : 'border-gray-200 hover:border-black/50 text-text-primary'
                                }`}
                              >
                                {option.label}
                              </button>
                            )
                          })}
                        </div>
                      )}

                      {currentQuestion.type === 'text' && (
                        <div>
                          <textarea
                            value={(getCurrentAnswer() as string) || ''}
                            onChange={(e) => handleTextInput(e.target.value)}
                            placeholder={currentQuestion.placeholder || 'Type your answer...'}
                            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none text-text-primary resize-none"
                            rows={3}
                          />
                          <button
                        onClick={() => {
                          const visible = getVisibleQuestions()
                          if (currentQuestionIndex < visible.length - 1) {
                            setCurrentQuestionIndex((prev) => prev + 1)
                          } else {
                            setScreen('creating')
                          }
                        }}
                            className="mt-4 w-full px-8 py-3 bg-black text-white font-semibold rounded-lg hover:bg-black/90 transition-all"
                          >
                            Continue
                          </button>
                        </div>
                      )}

                      {currentQuestion.type === 'number' && (
                        <div>
                          <input
                            type="number"
                            value={(getCurrentAnswer() as number) || ''}
                            onChange={(e) => handleTextInput(e.target.value)}
                            placeholder={currentQuestion.placeholder || 'Enter a number...'}
                            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none text-text-primary"
                          />
                          <button
                        onClick={() => {
                          const visible = getVisibleQuestions()
                          if (currentQuestionIndex < visible.length - 1) {
                            setCurrentQuestionIndex((prev) => prev + 1)
                          } else {
                            setScreen('creating')
                          }
                        }}
                            className="mt-4 w-full px-8 py-3 bg-black text-white font-semibold rounded-lg hover:bg-black/90 transition-all"
                          >
                            Continue
                          </button>
                        </div>
                      )}

                      {currentQuestion.type === 'date' && (
                        <div>
                          <input
                            type="date"
                            value={(getCurrentAnswer() as string) || ''}
                            onChange={(e) => handleTextInput(e.target.value)}
                            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none text-text-primary"
                          />
                          <button
                        onClick={() => {
                          const visible = getVisibleQuestions()
                          if (currentQuestionIndex < visible.length - 1) {
                            setCurrentQuestionIndex((prev) => prev + 1)
                          } else {
                            setScreen('creating')
                          }
                        }}
                            className="mt-4 w-full px-8 py-3 bg-black text-white font-semibold rounded-lg hover:bg-black/90 transition-all"
                          >
                            Continue
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Navigation Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <button
                        onClick={handleBack}
                        disabled={currentQuestionIndex === 0}
                        className={`flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors ${
                          currentQuestionIndex === 0
                            ? 'opacity-50 cursor-not-allowed'
                            : 'cursor-pointer'
                        }`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                        <span className="text-sm">Back</span>
                      </button>

                      {!currentQuestion.required && (
                        <button
                          onClick={handleSkip}
                          className="text-text-secondary hover:text-text-primary transition-colors text-sm"
                        >
                          Skip
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {screen === 'creating' && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-background">
              <div className="text-center space-y-12 max-w-3xl mx-auto px-4 sm:px-6">
                {/* Illustration Placeholder - Stylized running figures */}
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    {/* Abstract geometric shapes in background */}
                    <div className="absolute -top-8 -right-8 w-32 h-32 bg-blue-200/30 rounded-lg blur-xl"></div>
                    <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-purple-200/30 rounded-lg blur-xl"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-pink-200/20 rounded-full blur-2xl"></div>
                    
                    {/* Main illustration circle */}
                    <div className="relative w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl">
                      {creatingLogoError ? (
                        <div className="text-white text-7xl sm:text-8xl animate-bounce" style={{ animationDuration: '2s' }}>🏃</div>
                      ) : (
                        <div className="relative w-32 h-32 sm:w-40 sm:h-40">
                          <Image
                            src="/images/Runmvmt2.png"
                            alt="RUN MVMT"
                            width={160}
                            height={160}
                            className="w-full h-full object-contain animate-bounce"
                            style={{ animationDuration: '2s' }}
                            onError={() => setCreatingLogoError(true)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Animated Text */}
                <div className="space-y-6 min-h-[120px] flex flex-col justify-center">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary transition-opacity duration-500">
                    {creatingSteps[creatingStep]}
                  </h2>
                  
                  {/* Loading Animation */}
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

                {/* Progress Indicator */}
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
            </div>
          )}

          {screen === 'email' && (
            <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
              <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
                    Where should we send your training program?
                  </h2>
                  <p className="text-sm text-text-secondary">
                    Enter your details to receive your personalized plan
                  </p>
                </div>

                <form
                    onSubmit={async (e) => {
                      e.preventDefault()
                      await handleSendMagicLink()
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-text-primary mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        required
                        value={userFirstName}
                        onChange={(e) => setUserFirstName(e.target.value)}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none text-text-primary"
                        placeholder="John"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none text-text-primary"
                        placeholder="john@example.com"
                      />
                    </div>

                    {checkoutError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-600">{checkoutError}</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmittingEmail || !userFirstName || !userEmail}
                      className={`w-full px-6 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white font-bold text-lg rounded-lg shadow-lg transition-all duration-200 ${
                        isSubmittingEmail || !userFirstName || !userEmail
                          ? 'opacity-70 cursor-not-allowed'
                          : 'hover:opacity-90 hover:shadow-xl'
                      }`}
                    >
                      {isSubmittingEmail ? 'Sending...' : 'Get My Training Program'}
                    </button>
                  </form>
              </div>
            </div>
          )}

          {screen === 'check-email' && (
            <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
              <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6 text-center">
                <div className="text-6xl mb-4">📧</div>
                <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
                  Check your email
                </h2>
                <p className="text-text-secondary">
                  We've sent a confirmation link to <strong>{userEmail}</strong>
                </p>
                <p className="text-sm text-text-secondary mt-4">
                  Click the link in your email to view your training plan.
                </p>
              </div>
            </div>
          )}

          {screen === 'final' && (
            <div className="w-full min-h-screen bg-gray-50 flex">
              {/* Left Sidebar Dashboard */}
              <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 p-6 sticky top-0 h-screen overflow-y-auto">
                <div className="space-y-6">
                  {/* Logo/Header */}
                  <div className="pb-4 border-b border-gray-200">
                    {logoError ? (
                      <div className="text-primary text-xl font-bold">RUN MVMT</div>
                    ) : (
                      <div className="relative h-8 w-auto">
                        <Image
                          src="/images/Runmvmt6png.png"
                          alt="RUN MVMT"
                          width={120}
                          height={32}
                          className="h-full w-auto object-contain"
                          onError={() => setLogoError(true)}
                        />
                      </div>
                    )}
                  </div>

                  {/* Dashboard Stats */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wide">Dashboard</h3>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-xs text-text-secondary mb-1">Training Plan</div>
                      <div className="text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                        {trainingPlan ? `${trainingPlan.distance.toUpperCase()}` : 'Loading...'}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-xs text-text-secondary mb-1">Current Week</div>
                      <div className="text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">Week {selectedWeek} of 12</div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-xs text-text-secondary mb-1">Total Distance</div>
                      <div className="text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                        {trainingPlan?.weeklyStructure[selectedWeek - 1]?.targetKm || 0}km
                      </div>
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div className="space-y-2 pt-4 border-t border-gray-200">
                    <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wide">Quick Links</h3>
                    <a href="#" className="block text-sm text-text-secondary hover:bg-gradient-to-r hover:from-blue-600 hover:via-purple-600 hover:to-pink-500 hover:bg-clip-text hover:text-transparent transition-all">My Training Plan</a>
                    <a href="#" className="block text-sm text-text-secondary hover:bg-gradient-to-r hover:from-blue-600 hover:via-purple-600 hover:to-pink-500 hover:bg-clip-text hover:text-transparent transition-all">Progress Tracker</a>
                    <a href="#" className="block text-sm text-text-secondary hover:bg-gradient-to-r hover:from-blue-600 hover:via-purple-600 hover:to-pink-500 hover:bg-clip-text hover:text-transparent transition-all">Community</a>
                    <a href="#" className="block text-sm text-text-secondary hover:bg-gradient-to-r hover:from-blue-600 hover:via-purple-600 hover:to-pink-500 hover:bg-clip-text hover:text-transparent transition-all">Resources</a>
                  </div>

                  {/* Upgrade to Premium */}
                  <div className="pt-6 border-t border-gray-200 mt-6">
                    <div className="bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-500/10 rounded-lg p-4 border border-gray-200">
                      <div className="text-center mb-3">
                        <p className="text-xs font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent uppercase tracking-wide mb-2">
                          Black Friday Special
                        </p>
                        <p className="text-sm font-bold text-text-primary mb-2">
                          Upgrade to Premium
                        </p>
                        <p className="text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                          Just $99
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          const paymentSection = document.getElementById('payment-section');
                          if (paymentSection) {
                            paymentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }}
                        className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white font-semibold text-sm rounded-lg hover:opacity-90 transition-all duration-200 shadow-md"
                      >
                        Upgrade Now
                      </button>
                    </div>
                  </div>
                </div>
              </aside>

              {/* Main Content Area */}
              <main className="flex-1 overflow-y-auto">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  {/* Header */}
                  <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-2">
                      Your 12-Week Training Program
                    </h1>
                    <p className="text-text-secondary">
                      Built from your answers — tailored to your distance, experience, and goals.
                    </p>
                  </div>

                  {/* Interactive Insights Section */}
                  {insights.length > 0 && (
                    <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg border border-gray-200">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-text-primary mb-2">
                          🔥 Your Training Profile Summary
                        </h3>
                        <p className="text-sm text-text-secondary">
                          Click on any insight to learn more
                        </p>
                      </div>
                      <div className="space-y-3">
                        {insights.map((insight, index) => (
                          <div
                            key={index}
                            className={`rounded-lg p-4 cursor-pointer transition-all ${
                              expandedInsight === index
                                ? 'bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-500/10 border-2'
                                : 'border-2 border-gray-200 hover:bg-gradient-to-r hover:from-blue-600/5 hover:via-purple-600/5 hover:to-pink-500/5'
                            }`}
                            style={expandedInsight === index ? {
                              background: 'linear-gradient(white, white) padding-box, linear-gradient(to right, #2563eb, #9333ea, #ec4899) border-box',
                              border: '2px solid transparent'
                            } : {}}
                            onClick={() => setExpandedInsight(expandedInsight === index ? null : index)}
                          >
                            <div className="flex items-start gap-3">
                              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent text-lg font-bold mt-0.5 flex-shrink-0">✔</span>
                              <div className="flex-1">
                                <p
                                  className="text-sm text-text-primary leading-relaxed"
                                  dangerouslySetInnerHTML={{
                                    __html: insight.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                  }}
                                />
                                {expandedInsight === index && (
                                  <div className="mt-3 pt-3 border-t border-gray-200">
                                    <p className="text-xs text-text-secondary">
                                      This insight is based on your {insight.category.replace(/_/g, ' ')} responses. 
                                      Focus on this area to maximize your training effectiveness.
                                    </p>
                                  </div>
                                )}
                              </div>
                              <svg
                                className={`w-5 h-5 text-text-secondary transition-transform ${
                                  expandedInsight === index ? 'transform rotate-180' : ''
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Training Program with Week Tabs */}
                  {trainingPlan && (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-8">
                      {/* Week Tabs */}
                      <div className="border-b border-gray-200 px-6 pt-6">
                        <div className="flex flex-wrap gap-2">
                          {Array.from({ length: 12 }, (_, i) => i + 1).map((week) => (
                            <button
                              key={week}
                              onClick={() => setSelectedWeek(week)}
                              className={`px-4 py-2 rounded-t-lg font-medium text-sm transition-all ${
                                selectedWeek === week
                                  ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white'
                                  : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                              }`}
                            >
                              Week {week}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Week Content */}
                      <div className="p-6">
                        {trainingPlan.weeklyStructure[selectedWeek - 1] && (
                          <div>
                            <div className="mb-6">
                              <h3 className="text-2xl font-bold text-text-primary mb-2">
                                Week {selectedWeek} - {trainingPlan.weeklyStructure[selectedWeek - 1].focus}
                              </h3>
                              <p className="text-text-secondary">
                                Target Distance: <span className="font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                                  {trainingPlan.weeklyStructure[selectedWeek - 1].targetKm}km
                                </span>
                              </p>
                            </div>

                            {/* Sessions */}
                            <div className="space-y-4">
                              <h4 className="text-lg font-semibold text-text-primary mb-3">Training Sessions</h4>
                              {trainingPlan.weeklyStructure[selectedWeek - 1].keySessions.map((session, idx) => (
                                <div
                                  key={idx}
                                  className="border border-gray-200 rounded-lg p-4 hover:border-transparent hover:bg-gradient-to-r hover:from-blue-600/5 hover:via-purple-600/5 hover:to-pink-500/5 transition-all"
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-3 mb-2">
                                        <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">{session.day}</span>
                                        <span className="text-sm font-semibold text-text-primary">{session.type}</span>
                                        {session.durationKmOrMin && (
                                          <span className="text-sm text-text-secondary">
                                            {session.durationKmOrMin}km
                                          </span>
                                        )}
                                      </div>
                                      {session.description && (
                                        <p className="text-sm text-text-secondary">{session.description}</p>
                                      )}
                                      {session.intensityHint && (
                                        <p className="text-xs text-text-secondary mt-1 italic">
                                          {session.intensityHint}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Upgrade CTA within Training Plan Section */}
                      <div className="px-6 pb-6 pt-4 border-t border-gray-200 text-center">
                        <p className="text-sm text-text-secondary mb-3">
                          Want this exact training plan with pacing targets, nutrition guidance, strength workouts, and a full race-day strategy built in?
                        </p>
                        <div className="space-y-1.5">
                          <p className="text-xs font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent uppercase tracking-wide">
                            Black Friday Special
                          </p>
                          <p className="text-base font-semibold text-text-primary">
                            Upgrade to premium for just $99
                          </p>
                            <button
                              onClick={() => {
                                const paymentSection = document.getElementById('payment-section');
                                if (paymentSection) {
                                  paymentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }
                              }}
                              className="mt-2 px-5 py-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white font-medium text-xs rounded-lg hover:opacity-90 transition-all duration-200"
                            >
                              Upgrade Now
                            </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Download Button */}
                  <div className="text-center bg-white rounded-2xl p-8 shadow-lg border border-gray-200 mb-8">
                    <button
                      onClick={handleDownloadReport}
                      className="px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white font-bold text-base sm:text-lg rounded-lg shadow-lg hover:shadow-xl hover:opacity-90 transition-all duration-200 mb-3"
                    >
                      👉 Download My Training Plan (PDF)
                    </button>
                    <p className="text-sm text-text-secondary">
                      Get your complete 12-week program as a PDF — instantly available.
                    </p>
                  </div>

                  {/* Coach's Note Section */}
                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 mb-8">
                    <h3 className="text-2xl sm:text-3xl font-bold text-text-primary mb-6">
                      Coach's Note Based on Your Profile
                    </h3>
                    
                    <div className="space-y-6">
                      <p className="text-base sm:text-lg text-text-primary leading-relaxed">
                        You've now got a complete 12-week plan — and you're off to a great start.
                      </p>

                      <div>
                        <p className="text-base sm:text-lg font-semibold text-text-primary mb-4">
                          Based on your quiz answers, the biggest improvements for you will come from:
                        </p>
                        <ul className="space-y-3 ml-4">
                          <li className="flex items-start gap-3">
                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent text-lg font-bold mt-0.5 flex-shrink-0">✔</span>
                            <p className="text-base text-text-primary">Knowing exactly how fast to run each session</p>
                          </li>
                          {insights.length > 0 && (
                            <>
                              <li className="flex items-start gap-3">
                                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent text-lg font-bold mt-0.5 flex-shrink-0">✔</span>
                                <p 
                                  className="text-base text-text-primary"
                                  dangerouslySetInnerHTML={{
                                    __html: insights[0]?.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') || 'Insight from quiz'
                                  }}
                                />
                              </li>
                              {insights.length > 1 && (
                                <li className="flex items-start gap-3">
                                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent text-lg font-bold mt-0.5 flex-shrink-0">✔</span>
                                  <p 
                                    className="text-base text-text-primary"
                                    dangerouslySetInnerHTML={{
                                      __html: insights[1]?.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') || 'Insight from quiz'
                                    }}
                                  />
                                </li>
                              )}
                            </>
                          )}
                        </ul>
                      </div>

                      <div className="pt-6 border-t border-gray-200">
                        <p className="text-base sm:text-lg text-text-primary mb-6">
                          If you'd like to train with the kind of support most runners pay $150–$300/week for, you can unlock the full upgrade.
                        </p>
                        
                        <div className="bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-500/10 rounded-lg p-6 mb-6">
                          <p className="text-base sm:text-lg font-semibold text-text-primary mb-2">
                            As part of our Black Friday offer (normally $299), you get everything below for $97 — one time.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                          <div className="flex items-start gap-3">
                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent text-lg font-bold mt-0.5 flex-shrink-0">✔</span>
                            <p className="text-sm text-text-primary leading-relaxed">Personal pacing zones for every session</p>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent text-lg font-bold mt-0.5 flex-shrink-0">✔</span>
                            <p className="text-sm text-text-primary leading-relaxed">Strength & conditioning built specifically for runners</p>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent text-lg font-bold mt-0.5 flex-shrink-0">✔</span>
                            <p className="text-sm text-text-primary leading-relaxed">Fuelling and hydration strategy for long runs + race day</p>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent text-lg font-bold mt-0.5 flex-shrink-0">✔</span>
                            <p className="text-sm text-text-primary leading-relaxed">Running drills, warm-ups and recovery guidance</p>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent text-lg font-bold mt-0.5 flex-shrink-0">✔</span>
                            <p className="text-sm text-text-primary leading-relaxed">A complete race execution plan (when to push, when to hold)</p>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent text-lg font-bold mt-0.5 flex-shrink-0">✔</span>
                            <p className="text-sm text-text-primary leading-relaxed">Weekly accountability prompts to help you stay consistent</p>
                          </div>
                        </div>

                        <div className="text-center space-y-4 pt-4 border-t border-gray-200">
                          <p className="text-base font-semibold text-text-primary">
                            One-time payment. No subscription.
                          </p>
                          <p className="text-base text-text-secondary">
                            Just a smarter, clearer way to train — without guesswork.
                          </p>
                          <button
                            onClick={() => {
                              const paymentSection = document.getElementById('payment-section');
                              if (paymentSection) {
                                paymentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }
                            }}
                            className="px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white font-bold text-base sm:text-lg rounded-lg shadow-lg hover:shadow-xl hover:opacity-90 transition-all duration-200"
                          >
                            👉 Upgrade My Training
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Section with Premium Mockup */}
                  <div id="payment-section" className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Left: Payment Form */}
                    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-200">
                      <h3 className="text-2xl font-bold text-text-primary mb-6">Complete Your Purchase</h3>
                      
                      {/* Plan Selection */}
                      <div className="mb-8">
                        <h4 className="text-lg font-semibold text-text-primary mb-4">Your Plan</h4>
                        <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent uppercase tracking-wide">
                                  Black Friday Special
                                </span>
                                <span className="text-xs text-text-secondary">One-time payment</span>
                              </div>
                              <div className="mb-1">
                                <span className="text-lg line-through text-text-secondary mr-2">$299</span>
                                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                                  $99
                                </span>
                              </div>
                              <p className="text-sm text-text-secondary">
                                Full Training System - Pacing zones, strength workouts, nutrition, race strategy & more
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Stripe Checkout Section */}
                      {showCheckout ? (
                          <div>
                          <div className="mb-4">
                            <button
                              onClick={() => {
                                // Clean up checkout before hiding
                                if (checkoutRef.current) {
                                  try {
                                    checkoutRef.current.unmount()
                                  } catch (error) {
                                    console.error('Error unmounting checkout:', error)
                                  }
                                  checkoutRef.current = null
                                }
                                setCheckoutError(null)
                                setShowCheckout(false)
                                setCheckoutClientSecret(null)
                              }}
                              className="text-sm text-text-secondary hover:text-text-primary mb-4 flex items-center gap-2"
                            >
                              ← Back
                            </button>
                            <h4 className="text-lg font-semibold text-text-primary mb-4">Complete Your Payment</h4>
                          </div>
                          {checkoutClientSecret ? (
                            <div className="relative">
                              <div 
                                key={checkoutClientSecret} // Force re-render when client secret changes
                                id="checkout" 
                                className="min-h-[600px] w-full"
                                style={{ minHeight: '600px', position: 'relative', zIndex: 1 }}
                              ></div>
                              {!checkoutRef.current && !checkoutError && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg" style={{ zIndex: 0 }}>
                                  <div className="text-center">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                                    <p className="text-sm text-text-secondary">Loading payment form...</p>
                                    <p className="text-xs text-text-secondary mt-2">This may take a few seconds...</p>
                          </div>
                          </div>
                              )}
                              {checkoutError && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
                                  <div className="text-center max-w-md p-4">
                                    <p className="text-sm text-red-600 mb-4">{checkoutError}</p>
                                    <button
                                      onClick={() => {
                                        // Clean up before retry
                                        if (checkoutRef.current) {
                                          try {
                                            checkoutRef.current.unmount()
                                          } catch (e) {
                                            // Ignore
                                          }
                                          checkoutRef.current = null
                                        }
                                        setCheckoutError(null)
                                        setCheckoutClientSecret(null)
                                        setShowCheckout(false)
                                      }}
                                      className="px-4 py-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white rounded-lg hover:opacity-90 font-semibold"
                                    >
                                      Try Again
                                    </button>
                        </div>
                      </div>
                              )}
                        </div>
                          ) : (
                            <div className="min-h-[600px] w-full flex items-center justify-center">
                              <p className="text-text-secondary">Loading checkout...</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                            <p className="text-sm font-semibold text-text-primary">
                              Secure checkout powered by Stripe
                            </p>
                          </div>

                          {/* Stripe Checkout Info */}
                          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-5 mb-6">
                            <div className="flex items-start gap-3">
                              <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                          <div>
                                <p className="text-sm font-semibold text-blue-900 mb-1">
                                  Secure Payment Processing
                                </p>
                                <p className="text-xs text-blue-800">
                                  Enter your payment details securely below. Your card information is encrypted and never stored on our servers. Stripe supports all major cards, Google Pay, Apple Pay, and more.
                                </p>
                            </div>
                          </div>
                        </div>

                        {/* Guarantee Message */}
                          <div className="mb-6 p-4 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-500/10 rounded-lg border border-gray-200">
                          <p className="text-sm font-semibold text-text-primary text-center">
                            Try it for 6 weeks — if you don't feel fitter, faster or more confident, I'll refund you.
                          </p>
                        </div>

                        <button
                          onClick={handleCheckout}
                          disabled={isProcessingPayment}
                            className={`w-full px-6 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white font-bold text-lg rounded-lg shadow-lg transition-all duration-200 ${
                              isProcessingPayment ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90 hover:shadow-xl'
                          }`}
                        >
                            {isProcessingPayment ? 'Loading checkout...' : 'Complete Purchase - $99'}
                        </button>

                          <p className="text-xs text-text-secondary mt-4 text-center">
                            By proceeding, you agree to allow RUN MVMT to charge your card for this one-time payment in accordance with our terms.
                          </p>
                      </div>
                      )}
                    </div>

                    {/* Right: Premium Mockup (Sticky) */}
                    <div className="lg:sticky lg:top-8 h-fit">
                      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                        <div className="text-center mb-6">
                          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent mb-2">
                            Premium Training System
                          </h3>
                          <p className="text-sm text-text-secondary">
                            What you'll get with your upgrade
                          </p>
                        </div>

                        {/* Mockup Preview */}
                        <div className="bg-gradient-to-br from-blue-50 to-purple-50 to-pink-50 rounded-xl p-6 mb-6 border border-gray-200">
                          <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-sm font-semibold text-text-primary">Week {selectedWeek} Training</h4>
                              <span className="text-xs bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white px-2 py-1 rounded">Premium</span>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-xs">
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                <span className="text-text-secondary">Easy Run - 8km @ 5:30/km</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs">
                                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                <span className="text-text-secondary">Tempo - 6km @ 4:45/km</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs">
                                <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                                <span className="text-text-secondary">Long Run - 16km @ 5:15/km</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
                            <h4 className="text-sm font-semibold text-text-primary mb-2">Strength Workout</h4>
                            <ul className="text-xs text-text-secondary space-y-1">
                              <li>• Squats: 3x10</li>
                              <li>• Calf Raises: 3x15</li>
                              <li>• Core: 3x20</li>
                            </ul>
                          </div>

                          <div className="bg-white rounded-lg p-4 shadow-sm">
                            <h4 className="text-sm font-semibold text-text-primary mb-2">Race Strategy</h4>
                            <p className="text-xs text-text-secondary">
                              Complete pacing plan with when to push, when to hold, and fuelling strategy for race day.
                            </p>
                          </div>
                        </div>

                        {/* Features List */}
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent text-lg font-bold mt-0.5 flex-shrink-0">✔</span>
                            <p className="text-sm text-text-primary">Personal pacing zones for every session</p>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent text-lg font-bold mt-0.5 flex-shrink-0">✔</span>
                            <p className="text-sm text-text-primary">Strength & conditioning workouts</p>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent text-lg font-bold mt-0.5 flex-shrink-0">✔</span>
                            <p className="text-sm text-text-primary">Fuelling & hydration strategy</p>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent text-lg font-bold mt-0.5 flex-shrink-0">✔</span>
                            <p className="text-sm text-text-primary">Complete race execution plan</p>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent text-lg font-bold mt-0.5 flex-shrink-0">✔</span>
                            <p className="text-sm text-text-primary">Weekly accountability prompts</p>
                          </div>
                        </div>

                        {/* Condensed Premium Summary */}
                        <div className="mt-6 p-4 rounded-lg border border-gray-200 bg-gray-50 space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-text-secondary uppercase tracking-wide">In Premium</span>
                            <span className="text-xs text-text-secondary">Everything bundled</span>
                          </div>
                          <div className="space-y-2 text-xs text-text-primary">
                            <p><strong>🔥 Periodisation & Structure:</strong> Weekly load rules, pacing targets, taper plans.</p>
                            <p><strong>🏋️ Strength Plan:</strong> Runner-specific lifting + plyos from beginner to advanced.</p>
                            <p><strong>🥗 Nutrition Blueprint:</strong> Macros, fuelling templates & race-day hydration.</p>
                            <p><strong>💤 Recovery Framework:</strong> Sleep, load adjustment & early warning checks.</p>
                            <p><strong>🎯 Race Strategy:</strong> Pre-race checklist, warm-ups, pacing & fuelling by distance.</p>
                          </div>
                          <p className="text-xs font-semibold text-text-secondary">
                            $695 value included — yours today for $99.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RUN MVMT Premium Breakdown */}
                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 mb-12">
                    <div className="text-center mb-8">
                      <p className="text-sm font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent uppercase tracking-wide flex items-center justify-center gap-2">
                        <span>⭐</span> RUN MVMT Premium
                      </p>
                      <h3 className="text-3xl font-bold text-text-primary mt-3">
                        Everything you need to train like a real athlete — without hiring four experts.
                      </h3>
                      <p className="text-base sm:text-lg text-text-secondary mt-3">
                        One-time. Lifetime access. No subscription.
                      </p>
                    </div>

                    <h4 className="text-xl font-semibold text-text-primary mb-6 text-center">
                      What You Get Today
                    </h4>

                    <div className="space-y-8">
                      {/* Item 1 */}
                      <div className="rounded-2xl border border-gray-200 p-6">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <span className="text-2xl">🔥</span>
                          <h5 className="text-xl font-bold text-text-primary flex-1">
                            1. Advanced Periodisation & Training Structure
                          </h5>
                          <span className="text-sm font-semibold text-text-secondary">
                            Value: $149
                          </span>
                        </div>
                        <p className="text-sm text-text-secondary mb-4">
                          Smart progression that teaches you exactly how to scale volume and intensity safely — and peak at the right time.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-sm text-text-primary">
                          <li>Weekly progression framework & load-management rules</li>
                          <li>Personalised HR-zone pacing targets (scientifically calculated, not generic charts)</li>
                          <li>Session variations based on fatigue, schedule, confidence or goals</li>
                          <li>Tools for balancing aerobic work, threshold work, VO₂ max and long-run development</li>
                          <li>Distance-specific tapering and structure (5k → marathon+)</li>
                          <li>Guidance on when to adjust vs when to hold the line</li>
                        </ul>
                        <p className="text-sm text-text-secondary mt-4">
                          No more guessing — you’ll know exactly why every run exists and how it builds toward race day.
                        </p>
                      </div>

                      {/* Item 2 */}
                      <div className="rounded-2xl border border-gray-200 p-6">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <span className="text-2xl">🏋️‍♂️</span>
                          <h5 className="text-xl font-bold text-text-primary flex-1">
                            2. Strength & Conditioning for Runners + Guidebook
                          </h5>
                          <span className="text-sm font-semibold text-text-secondary">
                            Value: $199
                          </span>
                        </div>
                        <p className="text-sm text-text-secondary mb-4">
                          A complete strength program designed specifically to make runners faster, stronger and more durable — without adding junk fatigue.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-sm text-text-primary">
                          <li>Beginner → advanced pathways</li>
                          <li>Strength sessions built for runners (not bodybuilding templates)</li>
                          <li>Plyometrics, activation, mobility and stability integrations</li>
                          <li>Step-by-step structure based on your current level & race distance</li>
                        </ul>
                      </div>

                      {/* Item 3 */}
                      <div className="rounded-2xl border border-gray-200 p-6">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <span className="text-2xl">🥗</span>
                          <h5 className="text-xl font-bold text-text-primary flex-1">
                            3. Nutrition Blueprint for Runners
                          </h5>
                          <span className="text-sm font-semibold text-text-secondary">
                            Value: $149
                          </span>
                        </div>
                        <p className="text-sm text-text-secondary mb-4">
                          Fuel like an athlete — based on your bodyweight, goals and training load.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-sm text-text-primary">
                          <li>Daily calorie and macro calculator</li>
                          <li>Carb timing, race fuelling and hydration strategy</li>
                          <li>Fatigue vs performance fuelling adjustments</li>
                          <li>Examples and templates to make it SIMPLE</li>
                        </ul>
                      </div>

                      {/* Item 4 */}
                      <div className="rounded-2xl border border-gray-200 p-6">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <span className="text-2xl">💤</span>
                          <h5 className="text-xl font-bold text-text-primary flex-1">
                            4. Recovery & Adaptation Framework
                          </h5>
                          <span className="text-sm font-semibold text-text-secondary">
                            Value: $99
                          </span>
                        </div>
                        <p className="text-sm text-text-secondary mb-4">
                          Recover faster, reduce soreness, and build consistency — the real key to progress.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-sm text-text-primary">
                          <li>Sleep optimisation for training cycles</li>
                          <li>When to increase load vs when to back off</li>
                          <li>Mobility, stretching and cold exposure protocols</li>
                          <li>How to read fatigue, niggles and early warning signs</li>
                        </ul>
                      </div>

                      {/* Item 5 */}
                      <div className="rounded-2xl border border-gray-200 p-6">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <span className="text-2xl">🎯</span>
                          <h5 className="text-xl font-bold text-text-primary flex-1">
                            5. Race-Day Strategy System
                          </h5>
                          <span className="text-sm font-semibold text-text-secondary">
                            Value: $99
                          </span>
                        </div>
                        <p className="text-sm text-text-secondary">
                          What to do the week before, the morning of, the warm-up, pacing, fuelling and execution — mapped to your distance.
                        </p>
                      </div>
                    </div>

                    <div className="mt-10 text-center space-y-4">
                      <p className="text-base text-text-secondary">
                        ✔️ Total real-world value: $695+
                      </p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                        🔥 Your price today: $99 AUD
                      </p>
                      <p className="text-sm text-text-secondary">
                        One-time. Lifetime access. No subscription.
                      </p>
                      <button
                        onClick={() => {
                          const paymentSection = document.getElementById('payment-section')
                          if (paymentSection) {
                            paymentSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
                          }
                        }}
                        className="px-10 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white font-bold text-base rounded-lg shadow-lg hover:opacity-90 transition-all duration-200"
                      >
                        Upgrade Now – $99 AUD
                      </button>
                    </div>
                  </div>

                  {/* Coaching Cost Comparison */}
                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 mb-12">
                    <h3 className="text-2xl sm:text-3xl font-bold text-text-primary mb-4 text-center">
                      Normally this level of coaching would cost:
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <p className="text-sm text-text-secondary mb-1">1-on-1 Running Coach</p>
                        <p className="text-xl font-bold text-text-primary">$150–$450 / month</p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4">
                        <p className="text-sm text-text-secondary mb-1">Nutrition Consult</p>
                        <p className="text-xl font-bold text-text-primary">$120 per session</p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4">
                        <p className="text-sm text-text-secondary mb-1">Physio / Rehab Session</p>
                        <p className="text-xl font-bold text-text-primary">$80–$150 per visit</p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4">
                        <p className="text-sm text-text-secondary mb-1">Gym / Strength Program</p>
                        <p className="text-xl font-bold text-text-primary">$60–$90 per block</p>
                      </div>
                    </div>
                    <div className="text-center space-y-3">
                      <p className="text-base text-text-primary font-semibold">
                        You get it all, for less than the price of a pair of shoes.
                      </p>
                      <p className="text-sm text-text-secondary">
                        Complete system, expert knowledge, lifetime access — $99 once.
                      </p>
                      <button
                        onClick={() => {
                          const paymentSection = document.getElementById('payment-section')
                          if (paymentSection) {
                            paymentSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
                          }
                        }}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white font-semibold text-sm rounded-lg shadow-lg hover:opacity-90 transition-all duration-200"
                      >
                        Upgrade Now – $99 AUD
                      </button>
                    </div>
                  </div>

                  {/* Guarantee Section */}
                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 mb-12">
                    <div className="text-center mb-8">
                      <h3 className="text-3xl font-bold text-text-primary mb-3">
                        The “Run Further, Run Faster — Or It’s Free” Guarantee
                      </h3>
                      <p className="text-base sm:text-lg text-text-secondary">
                        I want this to feel unfairly in your favour.
                      </p>
                    </div>

                    <div className="space-y-6 text-text-primary">
                      <p>Here’s the deal:</p>
                      <p>
                        If you follow the program for the next 6 weeks — even loosely — and you don’t:
                      </p>
                      <ul className="list-disc pl-6 space-y-2 text-text-secondary">
                        <li>Feel more confident in your training</li>
                        <li>Notice improvements in pacing, fitness or consistency</li>
                        <li>Feel clearer about how to train, recover and fuel</li>
                        <li>OR you just don’t think it’s worth what you paid</li>
                      </ul>
                      <p>Then I don’t want your money.</p>
                      <p>Send me a message and I’ll refund 100% of it.</p>
                      <p>No forms. No hoops. No “prove it.” No awkward back-and-forth.</p>
                      <p>Because if this doesn’t genuinely help you run better — you shouldn’t pay for it. Simple.</p>
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 text-left">
                      <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200">
                        <Image
                          src="/images/DeonKenzie.jpg"
                          alt="Deon Kenzie"
                          fill
                          sizes="128px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-text-primary">— Deon Kenzie</p>
                        <p className="text-sm text-text-secondary">Founder, RUN MVMT</p>
                        <p className="text-sm text-text-secondary">Elite Runner & Coach</p>
                        <div className="mt-5">
                          <Image
                            src="/images/DKenzie.png"
                            alt="Deon Kenzie Signature"
                            width={360}
                            height={120}
                            className="h-24 w-auto object-contain"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* FAQ Section */}
                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 mb-8">
                    <h3 className="text-3xl font-bold text-text-primary mb-8 text-center">
                      ❓ Frequently Asked Questions
                    </h3>

                    <div className="space-y-8">
                      {/* FAQ Item 1 */}
                      <div>
                        <h4 className="text-xl font-bold text-text-primary mb-3">
                          What if I'm not fit enough yet? Should I wait before starting?
                        </h4>
                        <p className="text-base text-text-primary mb-2">
                          No — this is exactly when you should start.
                        </p>
                        <p className="text-base text-text-secondary mb-2">
                          The program adapts based on your current level, not where you "think" you should be. You don't need to be fast, experienced, or consistent yet — you just need to start.
                        </p>
                        <p className="text-base text-text-secondary">
                          Most runners wait until they feel ready.
                        </p>
                        <p className="text-base font-semibold text-text-primary">
                          The ones who improve start before they do.
                        </p>
                      </div>

                      {/* FAQ Item 2 */}
                      <div>
                        <h4 className="text-xl font-bold text-text-primary mb-3">
                          What if I miss sessions or fall behind? Will the plan still work?
                        </h4>
                        <p className="text-base font-semibold text-text-primary mb-2">
                          Yes — because it's designed for real life, not perfection.
                        </p>
                        <p className="text-base text-text-secondary">
                          If you miss a run, have a busy week, feel fatigued or get sick, the plan includes guidance on how to adjust intelligently without losing progress.
                        </p>
                        <p className="text-base font-semibold text-text-primary mt-2">
                          Consistency beats perfection — always.
                        </p>
                      </div>

                      {/* FAQ Item 3 */}
                      <div>
                        <h4 className="text-xl font-bold text-text-primary mb-3">
                          I've tried programs before and didn't stick to them. What makes this different?
                        </h4>
                        <p className="text-base text-text-secondary mb-2">
                          Most plans tell you what to do.
                        </p>
                        <p className="text-base font-semibold text-text-primary mb-2">
                          RUN MVMT teaches you why you're doing it — and that makes following it feel meaningful rather than like homework.
                        </p>
                        <p className="text-base text-text-secondary mb-2">
                          You're not just running distance.
                        </p>
                        <p className="text-base font-semibold text-text-primary">
                          You're training with purpose — and that changes everything.
                        </p>
                      </div>

                      {/* FAQ Item 4 */}
                      <div>
                        <h4 className="text-xl font-bold text-text-primary mb-3">
                          Will I get faster or is this just for general fitness?
                        </h4>
                        <p className="text-base text-text-secondary mb-2">
                          If you follow the structure, you'll get faster — it's built on periodisation, pacing progression, strength integration, and adaptation principles used by real athletes.
                        </p>
                        <p className="text-base text-text-secondary mb-2">
                          This system isn't random workouts.
                        </p>
                        <p className="text-base font-semibold text-text-primary">
                          It's structured improvement.
                        </p>
                      </div>

                      {/* FAQ Item 5 */}
                      <div>
                        <h4 className="text-xl font-bold text-text-primary mb-3">
                          Do I need a gym membership for the strength training?
                        </h4>
                        <p className="text-base font-semibold text-text-primary mb-2">
                          No — there are strength pathways for:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-base text-text-secondary ml-4">
                          <li>Gym</li>
                          <li>Home with minimal equipment</li>
                          <li>Bodyweight only</li>
                        </ul>
                        <p className="text-base text-text-secondary mt-2">
                          You'll always have a suitable option.
                        </p>
                      </div>

                      {/* FAQ Item 6 */}
                      <div>
                        <h4 className="text-xl font-bold text-text-primary mb-3">
                          What if I don't understand pacing or heart rate zones yet?
                        </h4>
                        <p className="text-base font-semibold text-text-primary mb-2">
                          Perfect — you don't need to.
                        </p>
                        <p className="text-base text-text-secondary mb-2">
                          The program includes personalised pacing and heart-rate guidance based on your quiz answers, so you'll know exactly what effort each session should feel like.
                        </p>
                        <p className="text-base font-semibold text-text-primary">
                          Clarity replaces guessing.
                        </p>
                      </div>

                      {/* FAQ Item 7 */}
                      <div>
                        <h4 className="text-xl font-bold text-text-primary mb-3">
                          Is this program suitable if I've had injuries before?
                        </h4>
                        <p className="text-base font-semibold text-text-primary mb-2">
                          Yes — as long as you're cleared to run.
                        </p>
                        <p className="text-base text-text-secondary mb-2">
                          The strength training, load progression and recovery protocols are specifically built to reduce injury risk and improve durability over time.
                        </p>
                        <p className="text-base font-semibold text-text-primary">
                          This is a "run smarter, not run more" approach.
                        </p>
                      </div>

                      {/* FAQ Item 8 */}
                      <div>
                        <h4 className="text-xl font-bold text-text-primary mb-3">
                          How long do I have access?
                        </h4>
                        <p className="text-base font-bold text-text-primary mb-2">
                          Forever.
                        </p>
                        <p className="text-base text-text-secondary mb-2">
                          One payment. No subscriptions. You get all updates and improvements permanently — including the future AI-based coach and integration features.
                        </p>
                        <p className="text-base font-semibold text-text-primary">
                          Early members lock in everything.
                        </p>
                      </div>

                      {/* FAQ Item 9 */}
                      <div>
                        <h4 className="text-xl font-bold text-text-primary mb-3">
                          What if I don't see progress or don't feel it's worth it?
                        </h4>
                        <p className="text-base font-semibold text-text-primary mb-2">
                          Then I'll refund you — no forms, no awkward conversation.
                        </p>
                        <p className="text-base text-text-secondary mb-2">
                          If it doesn't help you become a stronger, more confident runner… you shouldn't pay for it.
                        </p>
                        <p className="text-base font-semibold text-text-primary">
                          Simple.
                        </p>
                      </div>

                      {/* FAQ Item 10 */}
                      <div>
                        <h4 className="text-xl font-bold text-text-primary mb-3">
                          Can I use this if I already have a Garmin, Coros, or watch-based plan?
                        </h4>
                        <p className="text-base font-semibold text-text-primary mb-2">
                          Yes — and it will make those metrics make more sense.
                        </p>
                        <p className="text-base text-text-secondary mb-2">
                          Instead of just seeing numbers, you'll understand how to use them.
                        </p>
                        <p className="text-base text-text-secondary mb-2">
                          Most runners have data.
                        </p>
                        <p className="text-base font-semibold text-text-primary">
                          This teaches you how to train with it.
                        </p>
                      </div>

                      {/* FAQ Item 11 */}
                      <div>
                        <h4 className="text-xl font-bold text-text-primary mb-3">
                          Last question: Is this actually going to work for me?
                        </h4>
                        <p className="text-base text-text-secondary mb-2">
                          If you show up, follow the structure, and give yourself a fair shot —
                        </p>
                        <p className="text-base font-bold text-text-primary mb-2">
                          Yes.
                        </p>
                        <p className="text-base text-text-secondary mb-2">
                          Because this program isn't built on hype.
                        </p>
                        <p className="text-base font-semibold text-text-primary">
                          It's built on what works.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Testimonials Section */}
                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 mb-8">
                    <h3 className="text-3xl font-bold text-text-primary mb-8 text-center">
                      What Runners Are Saying
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Testimonial 1 */}
                      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center gap-1 mb-4">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-base text-text-primary mb-4 italic">
                          "This program completely changed how I approach training. The pacing guidance alone was worth it — I finally understand why I'm doing each run."
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                            M
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-text-primary">Mike T.</p>
                            <p className="text-xs text-text-secondary">Marathon Runner</p>
                          </div>
                        </div>
                      </div>

                      {/* Testimonial 2 */}
                      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center gap-1 mb-4">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-base text-text-primary mb-4 italic">
                          "I've tried so many plans but this is the first one that actually taught me WHY. The strength work and nutrition guidance made all the difference."
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                            J
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-text-primary">James R.</p>
                            <p className="text-xs text-text-secondary">Half Marathon PB</p>
                          </div>
                        </div>
                      </div>

                      {/* Testimonial 3 */}
                      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center gap-1 mb-4">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-base text-text-primary mb-4 italic">
                          "The race strategy section was a game-changer. I finally knew exactly when to push and when to hold back. PR'd my marathon by 12 minutes."
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                            D
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-text-primary">David K.</p>
                            <p className="text-xs text-text-secondary">Marathon Runner</p>
                          </div>
                        </div>
                      </div>

                      {/* Testimonial 4 */}
                      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center gap-1 mb-4">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-base text-text-primary mb-4 italic">
                          "As someone who's always struggled with consistency, the accountability prompts and clear structure kept me on track. Best $99 I've spent on running."
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                            S
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-text-primary">Sarah L.</p>
                            <p className="text-xs text-text-secondary">10K Runner</p>
                          </div>
                        </div>
                      </div>

                      {/* Testimonial 5 */}
                      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center gap-1 mb-4">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-base text-text-primary mb-4 italic">
                          "The recovery framework helped me finally understand when to push and when to back off. No more overtraining — just smart, consistent progress."
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                            A
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-text-primary">Alex M.</p>
                            <p className="text-xs text-text-secondary">Ultra Runner</p>
                          </div>
                        </div>
                      </div>

                      {/* Testimonial 6 */}
                      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center gap-1 mb-4">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-base text-text-primary mb-4 italic">
                          "I was skeptical at first, but the personalized pacing zones based on my actual fitness level made every run feel purposeful. Highly recommend."
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                            R
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-text-primary">Ryan P.</p>
                            <p className="text-xs text-text-secondary">5K Runner</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </main>
            </div>
          )}
        </div>
      </main>

      {/* Reviews Modal */}
      {showReviewsModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowReviewsModal(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-2xl font-bold text-text-primary">Runner Reviews</h3>
                <p className="text-sm text-text-secondary mt-1">Over 10,000 runners trained</p>
              </div>
              <button
                onClick={() => setShowReviewsModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Review Content - Slider */}
            <div className="flex-1 overflow-hidden relative">
              <div 
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentReviewIndex * 100}%)` }}
              >
                {reviews.map((review, index) => (
                  <div 
                    key={index}
                    className="min-w-full px-6 py-8 flex flex-col"
                  >
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(review.rating)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-lg text-text-primary mb-6 leading-relaxed flex-1">
                      "{review.text}"
                    </p>
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-base font-semibold text-text-primary">{review.name}</p>
                        <p className="text-sm text-text-secondary">{review.distance}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              {/* Dots Indicator */}
              <div className="flex items-center justify-center gap-2 mb-4">
                {reviews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentReviewIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentReviewIndex 
                        ? 'bg-primary w-8' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to review ${index + 1}`}
                  />
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setCurrentReviewIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1))}
                  className="px-4 py-2 text-sm font-medium text-text-primary border border-gray-300 rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={reviews.length === 0}
                >
                  ← Previous
                </button>
                <span className="text-sm text-text-secondary">
                  {currentReviewIndex + 1} of {reviews.length}
                </span>
                <button
                  onClick={() => setCurrentReviewIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1))}
                  className="px-4 py-2 text-sm font-medium text-text-primary border border-gray-300 rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={reviews.length === 0}
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

