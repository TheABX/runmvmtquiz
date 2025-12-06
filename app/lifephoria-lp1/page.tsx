'use client'

import { useState } from 'react'
import Image from 'next/image'

type Question = {
  id: number
  text: string
}

const QUESTIONS: Question[] = [
  { id: 1, text: "I feel confident in who I am, regardless of whether I'm dating or single." },
  { id: 2, text: "I know what I want in a relationship." },
  { id: 3, text: "I understand my emotions and why I behave the way I do in dating." },
  { id: 4, text: "I believe I attract the type of women I truly want." },
  { id: 5, text: "I show up as my best self consistently, not just when I'm trying to impress someone." },
  { id: 6, text: "I feel confident approaching someone I find attractive." },
  { id: 7, text: "I stay relaxed and grounded when I'm around someone I like." },
  { id: 8, text: "I feel secure even if a woman doesn't respond the way I hoped." },
  { id: 9, text: "I believe I am worthy of high-quality connection." },
  { id: 10, text: "I focus more on expressing myself than trying to impress." },
  { id: 11, text: "I sometimes lose interest when someone shows too much interest in me." },
  { id: 12, text: "I often make excuses or avoid dating because of fear or uncertainty." },
  { id: 13, text: "I find myself repeating similar dating cycles with different people." },
  { id: 14, text: "I sometimes chase validation instead of connection." },
  { id: 15, text: "I've stayed in situations that weren't good for me because I didn't want to be alone." },
  { id: 16, text: "I sometimes try to earn someone's approval instead of being myself." },
  { id: 17, text: "I lead conversations and decisions confidently when dating." },
  { id: 18, text: "I set clear boundaries and stick to them." },
  { id: 19, text: "I stay calm and collected when someone tests me emotionally." },
  { id: 20, text: "I can say no without guilt when something doesn't feel right." },
  { id: 21, text: "I prioritise my mission and purpose even while dating." },
  { id: 22, text: "I allow myself to be emotionally open with people I trust." },
  { id: 23, text: "I feel safe expressing how I feel without worrying I'll seem weak." },
  { id: 24, text: "I can recognise when a connection is healthy vs. toxic." },
  { id: 25, text: "I communicate honestly instead of hinting, testing, or withdrawing." },
  { id: 26, text: "I believe I deserve a relationship that feels nurturing, exciting, and peaceful." },
  { id: 27, text: "I feel ready to grow, evolve, and improve my dating life." }
]

type AnswerValue = 1 | 2 | 3 | 4 | 5

type Answer = {
  id: number
  value: AnswerValue
}

type Screen = 'intro' | 'sales' | 'question' | 'final'

const ANSWER_OPTIONS = [
  { value: 1 as AnswerValue, label: 'Strongly disagree' },
  { value: 2 as AnswerValue, label: 'Disagree' },
  { value: 3 as AnswerValue, label: 'Not sure' },
  { value: 4 as AnswerValue, label: 'Agree' },
  { value: 5 as AnswerValue, label: 'Strongly agree' },
]

export default function QuizPage() {
  const [screen, setScreen] = useState<Screen>('intro')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [logoError, setLogoError] = useState(false)
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set())
  
  const handleImageError = (index: number) => {
    setImageErrors((prev) => new Set(prev).add(index))
  }

  const currentQuestion = QUESTIONS[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / QUESTIONS.length) * 100

  const handleAnswer = (value: AnswerValue) => {
    const newAnswer: Answer = {
      id: currentQuestion.id,
      value,
    }

    setAnswers((prev) => {
      const filtered = prev.filter((a) => a.id !== currentQuestion.id)
      return [...filtered, newAnswer]
    })

    setIsTransitioning(true)
    setTimeout(() => {
      if (currentQuestionIndex < QUESTIONS.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1)
      } else {
        setScreen('final')
      }
      setIsTransitioning(false)
    }, 400)
  }

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const handleSkip = () => {
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      setScreen('final')
    }
  }

  const handleStart = () => {
    setScreen('question')
    setCurrentQuestionIndex(0)
  }

  const handleViewInsights = () => {
    console.log('Answers:', answers)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Brand Header - Always visible */}
      <header className="fixed top-0 left-0 right-0 z-20 bg-background/95 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          {logoError ? (
            <div className="font-script text-primary text-4xl sm:text-5xl font-normal leading-[0.9]">
              Lifephoria
            </div>
          ) : (
            <div className="relative h-10 sm:h-12 w-auto">
              <Image
                src="/images/Lifephoria.png"
                alt="Lifephoria"
                width={180}
                height={48}
                className="h-full w-auto object-contain"
                priority
                onError={() => setLogoError(true)}
              />
            </div>
          )}
        </div>
      </header>

      {/* Top Bar - Only shown on question screens */}
      {screen === 'question' && (
        <div className="sticky top-[73px] z-10 bg-background border-b border-gray-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-text-secondary text-xs sm:text-sm">
                Dating Self-Insight Quiz
              </div>
              <div className="text-text-secondary text-sm sm:text-base font-medium">
                {currentQuestionIndex + 1} / {QUESTIONS.length}
              </div>
            </div>
            <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={`flex-1 flex items-center justify-center py-8 sm:py-12 ${screen === 'question' ? 'pt-32 sm:pt-36' : 'pt-24 sm:pt-28'}`}>
        <div
          className={`w-full transition-opacity duration-300 ${
            isTransitioning ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {screen === 'intro' && (
            <div className="relative w-full">
              {/* Header Section */}
              <div className="relative w-full min-h-[600px] sm:min-h-[700px] pb-8">
                {/* Central Content */}
                <div className="text-center space-y-6 sm:space-y-8 relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
                {/* Headline */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-text-primary leading-tight px-4 max-w-5xl mx-auto">
                  Join thousands of men who finally understand why dating wasn't working.
              </h1>

                {/* Subheadline */}
                <p className="text-base sm:text-lg md:text-xl text-text-secondary max-w-3xl mx-auto px-4 leading-relaxed">
                  Get a science-backed breakdown of your dating patterns — and discover the exact behaviours stopping attraction, connection, and momentum.
                </p>

                {/* Social Proof */}
                <div className="space-y-3 pt-2">
                  {/* 5 Stars with Recommendation */}
                  <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className="w-5 h-5 sm:w-6 sm:h-6 text-accent"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm sm:text-base text-text-secondary">
                      94% Improvement Rating
                    </span>
                  </div>
              </div>

              {/* Start Button */}
                <div className="pt-0">
                <button
                  onClick={handleStart}
                  className="px-8 sm:px-12 py-4 sm:py-5 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary/90 hover:shadow-lg transition-all duration-200 text-base sm:text-lg"
                >
                  Start quiz
                </button>
                </div>

                {/* Trustpilot Reviews */}
                <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    {/* Review 1 */}
                    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100">
                      <div className="flex items-center gap-1 mb-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className="w-4 h-4 text-accent"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-sm sm:text-base text-text-primary mb-3 leading-relaxed">
                        "Finally understand why my dating life wasn't working. The insights were spot on."
                      </p>
                      <p className="text-xs sm:text-sm text-text-secondary font-semibold mb-2">James M.</p>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 0L14.694 8.291L23 9.236L16.5 15.209L18.388 23.5L12 19.5L5.612 23.5L7.5 15.209L1 9.236L9.306 8.291L12 0Z" fill="#00B67A"/>
                        </svg>
                        <span className="text-[10px] text-text-secondary">Trustpilot</span>
                      </div>
                    </div>

                    {/* Review 2 */}
                    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100">
                      <div className="flex items-center gap-1 mb-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className="w-4 h-4 text-accent"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-sm sm:text-base text-text-primary mb-3 leading-relaxed">
                        "Game changer. I've been applying the patterns and seeing real results."
                      </p>
                      <p className="text-xs sm:text-sm text-text-secondary font-semibold mb-2">Michael R.</p>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 0L14.694 8.291L23 9.236L16.5 15.209L18.388 23.5L12 19.5L5.612 23.5L7.5 15.209L1 9.236L9.306 8.291L12 0Z" fill="#00B67A"/>
                        </svg>
                        <span className="text-[10px] text-text-secondary">Trustpilot</span>
                      </div>
                    </div>

                    {/* Review 3 */}
                    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100">
                      <div className="flex items-center gap-1 mb-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className="w-4 h-4 text-accent"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-sm sm:text-base text-text-primary mb-3 leading-relaxed">
                        "Wish I found this sooner. The analysis was incredibly accurate and helpful."
                      </p>
                      <p className="text-xs sm:text-sm text-text-secondary font-semibold mb-2">David K.</p>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 0L14.694 8.291L23 9.236L16.5 15.209L18.388 23.5L12 19.5L5.612 23.5L7.5 15.209L1 9.236L9.306 8.291L12 0Z" fill="#00B67A"/>
                        </svg>
                        <span className="text-[10px] text-text-secondary">Trustpilot</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Research Foundation */}
                <p className="text-sm sm:text-base text-text-secondary max-w-2xl mx-auto px-4 pt-4">
                  Built on decades of research in emotional intelligence, behavioural science, and relationship psychology.
                </p>
              </div>
            </div>

            {/* Sales Letter Section */}
            <div className="w-full">
                <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 space-y-6 sm:space-y-8 text-text-primary">
                  {/* Opening */}
                  <div className="space-y-4">
                    <p className="text-xl sm:text-2xl font-semibold">Hey.</p>
                    <p className="text-xl sm:text-2xl font-semibold">Yeah — you.</p>
                  </div>

                  {/* Main Hook */}
                  <p className="text-lg sm:text-xl leading-relaxed">
                    The guy who's great at work, decent at the gym, emotionally stable most days…
                  </p>
                  <p className="text-lg sm:text-xl leading-relaxed font-semibold">
                    but for some reason still can't get a text back from a woman he actually likes.
                  </p>

                  {/* Let me guess section */}
                  <div className="space-y-4 pt-4">
                    <p className="text-lg sm:text-xl font-semibold">Let me guess:</p>
                    <ul className="space-y-3 list-none pl-0">
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span className="text-base sm:text-lg">You've matched with girls before.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span className="text-base sm:text-lg">You've even gone on dates.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span className="text-base sm:text-lg">Some have gone— pretty well.</span>
                      </li>
                    </ul>
                    <p className="text-base sm:text-lg leading-relaxed">
                      Like… well enough that you replayed the highlight reel in your head for 3 days straight…
                    </p>
                    <p className="text-base sm:text-lg leading-relaxed">
                      and maybe told one mate who barely pretended to care.
                    </p>
                    <p className="text-base sm:text-lg font-semibold pt-2">And then?</p>
                  </div>

                  {/* Problem section */}
                  <div className="space-y-3 pt-4">
                    <p className="text-lg sm:text-xl font-semibold">Boom.</p>
                    <p className="text-lg sm:text-xl font-semibold">Silence.</p>
                    <p className="text-lg sm:text-xl font-semibold">Ghosting.</p>
                    <p className="text-base sm:text-lg leading-relaxed">
                      A reply that reads like a hostage negotiation:
                    </p>
                    <p className="text-base sm:text-lg italic text-text-secondary pl-4 border-l-2 border-primary">
                      "lol yeah maybe another time :)"
                    </p>
                    <p className="text-sm sm:text-base text-text-secondary">
                      (Translation: never happening.)
                    </p>
                  </div>

                  {/* Overthinking section */}
                  <div className="space-y-3 pt-4">
                    <p className="text-base sm:text-lg leading-relaxed">
                      Suddenly you're overthinking every message like it's the Cuban Missile Crisis.
                    </p>
                    <p className="text-base sm:text-lg leading-relaxed">
                      You type something.
                    </p>
                    <p className="text-base sm:text-lg leading-relaxed">
                      Delete it.
                    </p>
                    <p className="text-base sm:text-lg leading-relaxed">
                      Rewrite it.
                    </p>
                    <p className="text-base sm:text-lg leading-relaxed">
                      Google "what to text when she's losing interest."
                    </p>
                    <p className="text-base sm:text-lg leading-relaxed">
                      Maybe you've even resorted to the Hail Mary:
                    </p>
                    <p className="text-base sm:text-lg italic text-text-secondary pl-4 border-l-2 border-primary">
                      "Hey, random question..."
                    </p>
                    <p className="text-base sm:text-lg font-semibold">Classic.</p>
                  </div>

                  {/* Honest truth */}
                  <div className="space-y-4 pt-6">
                    <p className="text-lg sm:text-xl font-semibold">Look — let's be honest for a second:</p>
                    <p className="text-base sm:text-lg leading-relaxed">
                      You're not failing because you're ugly, uninteresting, or unworthy.
                    </p>
                    <p className="text-base sm:text-lg leading-relaxed font-semibold">
                      You're failing because you're running the wrong patterns.
                    </p>
                  </div>

                  {/* What no one taught you */}
                  <div className="space-y-3 pt-4">
                    <p className="text-base sm:text-lg leading-relaxed">
                      No one taught you how attraction actually works.
                    </p>
                    <p className="text-base sm:text-lg leading-relaxed">
                      No one taught you emotional intelligence.
                    </p>
                    <p className="text-base sm:text-lg leading-relaxed">
                      No one taught you how to be confident WITHOUT pretending to be a f*cking Marvel superhero.
                    </p>
                  </div>

                  {/* The loop */}
                  <div className="space-y-4 pt-6">
                    <p className="text-base sm:text-lg leading-relaxed font-semibold">
                      So now you're stuck in this loop:
                    </p>
                    <div className="space-y-2 pl-4 border-l-2 border-primary">
                      <p className="text-base sm:text-lg">You get attention</p>
                      <p className="text-base sm:text-lg">You don't know what you're signalling</p>
                      <p className="text-base sm:text-lg">You lose momentum</p>
                      <p className="text-base sm:text-lg">You don't know why</p>
                      <p className="text-base sm:text-lg font-semibold">Repeat</p>
                    </div>
                    <p className="text-base sm:text-lg leading-relaxed pt-2">
                      It's confusing, frustrating, and honestly?
                    </p>
                    <p className="text-base sm:text-lg leading-relaxed font-semibold">
                      A little humiliating.
                    </p>
                  </div>

                  {/* Good news */}
                  <div className="space-y-4 pt-6">
                    <p className="text-lg sm:text-xl font-semibold">But here's the good news:</p>
                    <p className="text-base sm:text-lg leading-relaxed font-semibold">
                      You're not broken.
                    </p>
                    <p className="text-base sm:text-lg leading-relaxed">
                      You're just blind to your own behaviours.
                    </p>
                    <p className="text-base sm:text-lg leading-relaxed">
                      And once someone shows you what's actually happening —
                    </p>
                    <p className="text-base sm:text-lg leading-relaxed font-semibold">
                      everything changes.
                    </p>
                  </div>

                  {/* LIFEPHORIA intro */}
                  <div className="space-y-4 pt-6">
                    <p className="text-lg sm:text-xl font-semibold">That's why I built LIFEPHORIA.</p>
                    <p className="text-base sm:text-lg leading-relaxed">
                      We take modern dating psychology, emotional intelligence research, and real behavioural data from thousands of men…
                    </p>
                    <p className="text-base sm:text-lg leading-relaxed">
                      …and use it to give you a personalised dating pattern analysis so you finally understand:
                    </p>
                    <ul className="space-y-2 pl-4 border-l-2 border-primary">
                      <li className="text-base sm:text-lg">What you're doing right</li>
                      <li className="text-base sm:text-lg">Where you're losing attraction</li>
                      <li className="text-base sm:text-lg">Why messaging feels forced</li>
                      <li className="text-base sm:text-lg">Why connection doesn't progress</li>
                      <li className="text-base sm:text-lg">And how to fix it — step by step</li>
                    </ul>
                  </div>

                  {/* No tactics */}
                  <div className="space-y-3 pt-6">
                    <p className="text-base sm:text-lg leading-relaxed font-semibold">
                      No pickup tactics.
                    </p>
                    <p className="text-base sm:text-lg leading-relaxed font-semibold">
                      No weird manipulation.
                    </p>
                    <p className="text-base sm:text-lg leading-relaxed font-semibold">
                      No pretending to be someone you're not.
                    </p>
                    <p className="text-lg sm:text-xl font-semibold pt-2">Just clarity.</p>
                  </div>

                  {/* Social proof */}
                  <div className="space-y-3 pt-6">
                    <p className="text-base sm:text-lg leading-relaxed">
                      Thousands of men already used it — and felt the difference.
                    </p>
                    <ul className="space-y-2 pl-4 border-l-2 border-accent">
                      <li className="text-base sm:text-lg">Less anxiety.</li>
                      <li className="text-base sm:text-lg">More confidence.</li>
                      <li className="text-base sm:text-lg">Better dating outcomes.</li>
                    </ul>
                    <p className="text-base sm:text-lg leading-relaxed pt-2">
                      And soon, you'll be one of them.
                    </p>
                  </div>

                  {/* Decision */}
                  <div className="space-y-4 pt-6">
                    <p className="text-lg sm:text-xl font-semibold">But first — you have to make a decision:</p>
                    <p className="text-base sm:text-lg leading-relaxed">
                      Keep guessing?
                    </p>
                    <p className="text-base sm:text-lg leading-relaxed">
                      …or finally understand why things haven't been working — and fix it?
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="space-y-4 pt-8">
                    <p className="text-base sm:text-lg leading-relaxed">
                      If you're ready:
                    </p>
                    <p className="text-base sm:text-lg leading-relaxed">
                      👇 Click the button below.
                    </p>
                    <p className="text-sm sm:text-base text-text-secondary italic">
                      Your future self will be annoyingly grateful later.
                    </p>
                    
                    <div className="pt-4">
                      <button
                        onClick={handleStart}
                        className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary/90 hover:shadow-lg transition-all duration-200 text-base sm:text-lg"
                      >
                        Get My Dating Pattern Analysis
                      </button>
                    </div>

                    <p className="text-sm sm:text-base text-text-secondary italic pt-2">
                      (Yes — the button. No — don't overthink it.)
                    </p>
                  </div>

                  {/* Sign off */}
                  <div className="space-y-3 pt-8 border-t border-gray-200">
                    <p className="text-base sm:text-lg">Talk soon,</p>
                    <p className="text-base sm:text-lg font-semibold">— The LIFEPHORIA Team</p>
                  </div>

                  {/* P.S. */}
                  <div className="pt-6">
                    <p className="text-sm sm:text-base text-text-secondary italic">
                      <span className="font-semibold">P.S.</span> If you're wondering whether this actually works, ask yourself one question:
                    </p>
                    <p className="text-base sm:text-lg font-semibold pt-2">
                      How's guessing been working so far?
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {screen === 'sales' && (
            <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
              <div className="space-y-6 sm:space-y-8 text-text-primary">
                {/* Opening */}
                <div className="space-y-4">
                  <p className="text-xl sm:text-2xl font-semibold">Hey.</p>
                  <p className="text-xl sm:text-2xl font-semibold">Yeah — you.</p>
                </div>

                {/* Main Hook */}
                <p className="text-lg sm:text-xl leading-relaxed">
                  The guy who's great at work, decent at the gym, emotionally stable most days…
                </p>
                <p className="text-lg sm:text-xl leading-relaxed font-semibold">
                  but for some reason still can't get a text back from a woman he actually likes.
                </p>

                {/* Let me guess section */}
                <div className="space-y-4 pt-4">
                  <p className="text-lg sm:text-xl font-semibold">Let me guess:</p>
                  <ul className="space-y-3 list-none pl-0">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span className="text-base sm:text-lg">You've matched with girls before.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span className="text-base sm:text-lg">You've even gone on dates.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span className="text-base sm:text-lg">Some have gone— pretty well.</span>
                    </li>
                  </ul>
                  <p className="text-base sm:text-lg leading-relaxed">
                    Like… well enough that you replayed the highlight reel in your head for 3 days straight…
                  </p>
                  <p className="text-base sm:text-lg leading-relaxed">
                    and maybe told one mate who barely pretended to care.
                  </p>
                  <p className="text-base sm:text-lg font-semibold pt-2">And then?</p>
                </div>

                {/* Problem section */}
                <div className="space-y-3 pt-4">
                  <p className="text-lg sm:text-xl font-semibold">Boom.</p>
                  <p className="text-lg sm:text-xl font-semibold">Silence.</p>
                  <p className="text-lg sm:text-xl font-semibold">Ghosting.</p>
                  <p className="text-base sm:text-lg leading-relaxed">
                    A reply that reads like a hostage negotiation:
                  </p>
                  <p className="text-base sm:text-lg italic text-text-secondary pl-4 border-l-2 border-primary">
                    "lol yeah maybe another time :)"
                  </p>
                  <p className="text-sm sm:text-base text-text-secondary">
                    (Translation: never happening.)
                  </p>
                </div>

                {/* Overthinking section */}
                <div className="space-y-3 pt-4">
                  <p className="text-base sm:text-lg leading-relaxed">
                    Suddenly you're overthinking every message like it's the Cuban Missile Crisis.
                  </p>
                  <p className="text-base sm:text-lg leading-relaxed">
                    You type something.
                  </p>
                  <p className="text-base sm:text-lg leading-relaxed">
                    Delete it.
                  </p>
                  <p className="text-base sm:text-lg leading-relaxed">
                    Rewrite it.
                  </p>
                  <p className="text-base sm:text-lg leading-relaxed">
                    Google "what to text when she's losing interest."
                  </p>
                  <p className="text-base sm:text-lg leading-relaxed">
                    Maybe you've even resorted to the Hail Mary:
                  </p>
                  <p className="text-base sm:text-lg italic text-text-secondary pl-4 border-l-2 border-primary">
                    "Hey, random question..."
                  </p>
                  <p className="text-base sm:text-lg font-semibold">Classic.</p>
                </div>

                {/* Honest truth */}
                <div className="space-y-4 pt-6">
                  <p className="text-lg sm:text-xl font-semibold">Look — let's be honest for a second:</p>
                  <p className="text-base sm:text-lg leading-relaxed">
                    You're not failing because you're ugly, uninteresting, or unworthy.
                  </p>
                  <p className="text-base sm:text-lg leading-relaxed font-semibold">
                    You're failing because you're running the wrong patterns.
                  </p>
                </div>

                {/* What no one taught you */}
                <div className="space-y-3 pt-4">
                  <p className="text-base sm:text-lg leading-relaxed">
                    No one taught you how attraction actually works.
                  </p>
                  <p className="text-base sm:text-lg leading-relaxed">
                    No one taught you emotional intelligence.
                  </p>
                  <p className="text-base sm:text-lg leading-relaxed">
                    No one taught you how to be confident WITHOUT pretending to be a f*cking Marvel superhero.
                  </p>
                </div>

                {/* The loop */}
                <div className="space-y-4 pt-6">
                  <p className="text-base sm:text-lg leading-relaxed font-semibold">
                    So now you're stuck in this loop:
                  </p>
                  <div className="space-y-2 pl-4 border-l-2 border-primary">
                    <p className="text-base sm:text-lg">You get attention</p>
                    <p className="text-base sm:text-lg">You don't know what you're signalling</p>
                    <p className="text-base sm:text-lg">You lose momentum</p>
                    <p className="text-base sm:text-lg">You don't know why</p>
                    <p className="text-base sm:text-lg font-semibold">Repeat</p>
                  </div>
                  <p className="text-base sm:text-lg leading-relaxed pt-2">
                    It's confusing, frustrating, and honestly?
                  </p>
                  <p className="text-base sm:text-lg leading-relaxed font-semibold">
                    A little humiliating.
                  </p>
                </div>

                {/* Good news */}
                <div className="space-y-4 pt-6">
                  <p className="text-lg sm:text-xl font-semibold">But here's the good news:</p>
                  <p className="text-base sm:text-lg leading-relaxed font-semibold">
                    You're not broken.
                  </p>
                  <p className="text-base sm:text-lg leading-relaxed">
                    You're just blind to your own behaviours.
                  </p>
                  <p className="text-base sm:text-lg leading-relaxed">
                    And once someone shows you what's actually happening —
                  </p>
                  <p className="text-base sm:text-lg leading-relaxed font-semibold">
                    everything changes.
                  </p>
                </div>

                {/* LIFEPHORIA intro */}
                <div className="space-y-4 pt-6">
                  <p className="text-lg sm:text-xl font-semibold">That's why I built LIFEPHORIA.</p>
                  <p className="text-base sm:text-lg leading-relaxed">
                    We take modern dating psychology, emotional intelligence research, and real behavioural data from thousands of men…
                  </p>
                  <p className="text-base sm:text-lg leading-relaxed">
                    …and use it to give you a personalised dating pattern analysis so you finally understand:
                  </p>
                  <ul className="space-y-2 pl-4 border-l-2 border-primary">
                    <li className="text-base sm:text-lg">What you're doing right</li>
                    <li className="text-base sm:text-lg">Where you're losing attraction</li>
                    <li className="text-base sm:text-lg">Why messaging feels forced</li>
                    <li className="text-base sm:text-lg">Why connection doesn't progress</li>
                    <li className="text-base sm:text-lg">And how to fix it — step by step</li>
                  </ul>
                </div>

                {/* No tactics */}
                <div className="space-y-3 pt-6">
                  <p className="text-base sm:text-lg leading-relaxed font-semibold">
                    No pickup tactics.
                  </p>
                  <p className="text-base sm:text-lg leading-relaxed font-semibold">
                    No weird manipulation.
                  </p>
                  <p className="text-base sm:text-lg leading-relaxed font-semibold">
                    No pretending to be someone you're not.
                  </p>
                  <p className="text-lg sm:text-xl font-semibold pt-2">Just clarity.</p>
                </div>

                {/* Social proof */}
                <div className="space-y-3 pt-6">
                  <p className="text-base sm:text-lg leading-relaxed">
                    Thousands of men already used it — and felt the difference.
                  </p>
                  <ul className="space-y-2 pl-4 border-l-2 border-accent">
                    <li className="text-base sm:text-lg">Less anxiety.</li>
                    <li className="text-base sm:text-lg">More confidence.</li>
                    <li className="text-base sm:text-lg">Better dating outcomes.</li>
                  </ul>
                  <p className="text-base sm:text-lg leading-relaxed pt-2">
                    And soon, you'll be one of them.
                  </p>
                </div>

                {/* Decision */}
                <div className="space-y-4 pt-6">
                  <p className="text-lg sm:text-xl font-semibold">But first — you have to make a decision:</p>
                  <p className="text-base sm:text-lg leading-relaxed">
                    Keep guessing?
                  </p>
                  <p className="text-base sm:text-lg leading-relaxed">
                    …or finally understand why things haven't been working — and fix it?
                  </p>
                </div>

                {/* CTA */}
                <div className="space-y-4 pt-8">
                  <p className="text-base sm:text-lg leading-relaxed">
                    If you're ready:
                  </p>
                  <p className="text-base sm:text-lg leading-relaxed">
                    👇 Click the button below.
                  </p>
                  <p className="text-sm sm:text-base text-text-secondary italic">
                    Your future self will be annoyingly grateful later.
                  </p>
                  
                  <div className="pt-4">
                    <button
                      onClick={handleStart}
                      className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary/90 hover:shadow-lg transition-all duration-200 text-base sm:text-lg"
                    >
                      Get My Dating Pattern Analysis
                    </button>
                  </div>

                  <p className="text-sm sm:text-base text-text-secondary italic pt-2">
                    (Yes — the button. No — don't overthink it.)
                  </p>
                </div>

                {/* Sign off */}
                <div className="space-y-3 pt-8 border-t border-gray-200">
                  <p className="text-base sm:text-lg">Talk soon,</p>
                  <p className="text-base sm:text-lg font-semibold">— The LIFEPHORIA Team</p>
                </div>

                {/* P.S. */}
                <div className="pt-6">
                  <p className="text-sm sm:text-base text-text-secondary italic">
                    <span className="font-semibold">P.S.</span> If you're wondering whether this actually works, ask yourself one question:
                  </p>
                  <p className="text-base sm:text-lg font-semibold pt-2">
                    How's guessing been working so far?
                  </p>
                </div>
              </div>
            </div>
          )}

          {screen === 'question' && (
            <div className="space-y-8 sm:space-y-12 max-w-3xl mx-auto px-4 sm:px-6">
              {/* Navigation */}
              <div className="flex items-center justify-between">
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
                  <span className="text-sm sm:text-base">Back</span>
                </button>

                <button
                  onClick={handleSkip}
                  className="text-text-secondary hover:text-text-primary transition-colors text-sm sm:text-base"
                >
                  Skip
                </button>
              </div>

              {/* Question */}
              <div className="text-center space-y-4">
                <p className="text-sm sm:text-base text-text-secondary">
                  Do you agree with the following statement?
                </p>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary leading-tight max-w-2xl mx-auto">
                  {currentQuestion.text}
                </h2>
              </div>

              {/* Answer Scale */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 sm:gap-4">
                  {ANSWER_OPTIONS.map((option) => {
                    const isSelected =
                      answers.find((a) => a.id === currentQuestion.id)?.value ===
                      option.value

                    return (
                      <button
                        key={option.value}
                        onClick={() => handleAnswer(option.value)}
                        className={`
                          px-4 py-3 sm:py-4 rounded-lg border-2 transition-all duration-200 text-sm sm:text-base font-medium
                          ${
                            isSelected
                              ? 'bg-primary text-white border-primary shadow-md'
                              : 'bg-white text-text-primary border-gray-300 hover:border-primary/50 hover:shadow-sm'
                          }
                        `}
                      >
                        {option.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {screen === 'final' && (
            <div className="text-center space-y-6 sm:space-y-8 max-w-2xl mx-auto px-4 sm:px-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary leading-tight">
                Nice work. Most men never reflect this deeply.
              </h1>

              <div className="space-y-4 text-base sm:text-lg text-text-primary">
                <p>
                  Your answers give us a clearer picture of your dating patterns, strengths and blindspots. Next, we'll break this down into simple insights and practical steps so you can show up as a stronger, more grounded man in your love life.
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleViewInsights}
                  className="px-8 sm:px-12 py-4 sm:py-5 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary/90 hover:shadow-lg transition-all duration-200 text-base sm:text-lg"
                >
                  View my insights
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      {/* Footer */}
      <footer className="mt-auto bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 sm:gap-12 mb-8">
            {/* Brand Logo */}
            <div className="col-span-2 md:col-span-1">
              {logoError ? (
                <div className="font-script text-white text-3xl sm:text-4xl font-normal leading-[0.9] mb-4">
                  Lifephoria
                </div>
              ) : (
                <div className="relative h-10 sm:h-12 w-auto mb-4">
                  <Image
                    src="/images/Lifephoria.png"
                    alt="Lifephoria"
                    width={180}
                    height={48}
                    className="h-full w-auto object-contain"
                    onError={() => setLogoError(true)}
                  />
                </div>
              )}
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-semibold text-sm sm:text-base mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <a href="#" className="hover:text-white transition-colors">Blog</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">Quiz</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">Insights</a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold text-sm sm:text-base mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <a href="#" className="hover:text-white transition-colors">Help Center</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">Contact Us</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">FAQs</a>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h3 className="font-semibold text-sm sm:text-base mb-4">Connect</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <a href="#" className="hover:text-white transition-colors">Instagram</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">TikTok</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">YouTube</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">Facebook</a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold text-sm sm:text-base mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Disclaimer and Copyright */}
          <div className="border-t border-gray-800 pt-8">
            <p className="text-xs sm:text-sm text-gray-400 mb-4 max-w-2xl">
              LIFEPHORIA is not a substitute for therapy or professional mental-health support. If you're struggling, please reach out to a qualified professional.
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              © {new Date().getFullYear()} LIFEPHORIA. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

