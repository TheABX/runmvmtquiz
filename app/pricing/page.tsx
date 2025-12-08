'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function PricingPage() {
  const router = useRouter()
  const [logoError, setLogoError] = useState(false)

  const freeFeatures = [
    '12-week personalised training plan',
    'Customized to your goals and fitness level',
    'Weekly training structure',
    'Session descriptions and guidance',
    'Progress tracking dashboard',
    'Access to training plan anytime',
  ]

  const paidFeatures = [
    'Everything in Free, plus:',
    'Strength & conditioning assessment',
    'Personalized strength program',
    'Performance nutrition screening',
    'Custom nutrition plan & daily targets',
    'Psychological performance profile',
    'Mindset strategies & tools',
    'Recovery & readiness assessment',
    'Race-day strategy & pacing guide',
    'Runner\'s cookbook & fueling guide',
    'Lifetime access to all resources',
    'Priority support',
  ]

  const handleGetStarted = () => {
    router.push('/runmvmt-quiz')
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
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
              <Link href="/runmvmt-quiz" className="text-text-secondary hover:text-text-primary text-sm font-medium transition-colors">
                HOME
              </Link>
              <a href="#" className="text-text-secondary hover:text-text-primary text-sm font-medium transition-colors">ABOUT</a>
              <span className="text-primary text-sm font-medium">PRICING</span>
              <a href="#" className="text-text-secondary hover:text-text-primary text-sm font-medium transition-colors">WHY RUN MVMT?</a>
            </nav>
            <div className="hidden md:flex items-center gap-4">
              <button 
                onClick={handleGetStarted}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 rounded-lg hover:opacity-90 transition-all"
              >
                GET STARTED
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-24 sm:pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto">
              Start free. Upgrade when you're ready for the complete system.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden flex flex-col">
              <div className="px-8 py-12 text-center border-b border-gray-200">
                <h2 className="text-3xl font-bold text-text-primary mb-2">
                  Free Plan
                </h2>
                <div className="flex items-baseline justify-center gap-2 mb-4">
                  <span className="text-5xl font-bold text-text-primary">$0</span>
                </div>
                <p className="text-text-secondary">Perfect for getting started</p>
              </div>

              <div className="p-8 flex-1">
                <ul className="space-y-4 mb-8">
                  {freeFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-primary text-xl mt-0.5 flex-shrink-0">✔</span>
                      <p className="text-base text-text-primary leading-relaxed">{feature}</p>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={handleGetStarted}
                  className="w-full px-8 py-4 border-2 border-gray-300 text-text-primary font-bold text-lg rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  Get Started Free
                </button>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="bg-white rounded-2xl shadow-2xl border-2 border-primary overflow-hidden flex flex-col relative">
              {/* Popular Badge */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  MOST POPULAR
                </span>
              </div>

              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 px-8 py-12 text-center">
                <h2 className="text-3xl font-bold text-white mb-2">
                  Premium Training System
                </h2>
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className="text-5xl sm:text-6xl font-bold text-white">$99</span>
                  <span className="text-xl text-white/90">AUD</span>
                </div>
                <p className="text-white/90 text-lg">One-time payment</p>
              </div>

              <div className="p-8 flex-1">
                <ul className="space-y-4 mb-8">
                  {paidFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-primary text-xl mt-0.5 flex-shrink-0">✔</span>
                      <p className={`text-base leading-relaxed ${
                        index === 0 ? 'font-semibold text-text-primary' : 'text-text-primary'
                      }`}>
                        {feature}
                      </p>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={handleGetStarted}
                  className="w-full px-8 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl hover:opacity-90 transition-all duration-200 mb-4"
                >
                  Get Started — Create Your Plan
                </button>
                <p className="text-center text-sm text-text-secondary">
                  Free quiz • No credit card required until you're ready
                </p>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="mt-16 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-blue-500 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 border-2 border-white"></div>
              </div>
              <p className="text-sm font-medium text-text-primary">
                Over <span className="font-bold text-primary">10,000 runners</span> trained
              </p>
            </div>
            <div className="flex items-center justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-2 text-sm text-text-secondary">4.9/5 from 500+ reviews</span>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-20">
            <h3 className="text-3xl font-bold text-text-primary text-center mb-12">
              Frequently Asked Questions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-text-primary mb-2">
                  What's included in the free plan?
                </h4>
                <p className="text-text-secondary">
                  The free plan includes your complete 12-week personalized training plan, customized to your goals, fitness level, and schedule. You get full access to your training dashboard.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-text-primary mb-2">
                  Is Premium a subscription?
                </h4>
                <p className="text-text-secondary">
                  No. Premium is a one-time payment of $99 AUD. You get lifetime access to all premium features including nutrition plans, strength programs, and all assessments.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-text-primary mb-2">
                  Can I upgrade later?
                </h4>
                <p className="text-text-secondary">
                  Absolutely! Start with the free plan and upgrade to Premium anytime. Your training plan will be enhanced with all the additional assessments and resources.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-text-primary mb-2">
                  What if I'm not satisfied?
                </h4>
                <p className="text-text-secondary">
                  We're confident you'll love your plan. If you're not satisfied within 30 days of purchase, contact us for a full refund.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

