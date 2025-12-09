'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AboutPage() {
  const router = useRouter()
  const [logoError, setLogoError] = useState(false)
  const [userFirstName, setUserFirstName] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleGetStarted = () => {
    router.push('/runmvmt-quiz')
  }

  // Check if user is logged in and fetch their first name
  useEffect(() => {
    let isMounted = true

    const checkUser = async () => {
      try {
        const { supabase } = await import('@/src/lib/supabaseClient')
        if (!supabase) return

        const { data: userData, error: userError } = await supabase.auth.getUser()
        if (userError || !userData?.user) {
          if (!isMounted) return
          setIsLoggedIn(false)
          return
        }

        if (!isMounted) return
        setIsLoggedIn(true)

        // Fetch first name from user_profiles table
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('first_name')
          .eq('user_id', userData.user.id)
          .single()

        if (!profileError && profile?.first_name) {
          setUserFirstName(profile.first_name)
        }
      } catch (err) {
        console.warn('Error fetching user profile:', err)
      }
    }

    checkUser()

    return () => {
      isMounted = false
    }
  }, [])

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
              <span className="text-primary text-sm font-medium">ABOUT</span>
              <Link href="/pricing" className="text-text-secondary hover:text-text-primary text-sm font-medium transition-colors">PRICING</Link>
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Personal Letter */}
          <div className="space-y-6 sm:space-y-8 text-text-primary">
            {/* Opening */}
            <div className="space-y-4">
              <p className="text-xl sm:text-2xl font-semibold text-text-primary">
                Dear {userFirstName || 'runner'},
              </p>
            </div>

            {/* Main Content */}
            <div className="space-y-6 text-base sm:text-lg leading-relaxed text-text-primary">
              <p>
                If you've struggled with injuries or felt stuck with your running, then this might genuinely be one of the most important things you read all year — not because it's dramatic, but because understanding a few simple principles can save you months of frustration.
              </p>

              <p>
                When I first started running, I didn't realise it, but I was basically running blind.
              </p>

              <p>
                No structure. No real understanding of training load. Just doing whatever felt right and hoping it would somehow make me better.
              </p>

              <p>
                Most runners do the same. I did too.
              </p>

              <p>
                It wasn't until I received a scholarship at the Australian Institute of Sport that things really changed.
              </p>

              <p>
                For the first time, I had a full high performance team looking at my sessions and paying attention to patterns in my training that I never would've picked up myself.
              </p>

              <p>
                And here's what surprised me:
              </p>

              <p>
                They could often recognise warning signs before I felt anything — not because they had some special futuristic tech, but because they understood how tiny changes in training add up over time.
              </p>

              <p>
                It opened my eyes to how preventable many injuries actually are.
              </p>

              <p>
                But the thing that shocked me the most?
              </p>

              <p>
                None of this was being applied to everyday runners.
              </p>

              <p>
                Most people rely on Strava, guesswork, and a bit of "run more and hope for the best."
              </p>

              <p className="font-semibold">
                That's why I started RUN MVMT.
              </p>

              <p>
                Not to pretend I have a secret formula…
              </p>

              <p>
                but to take the simple training principles that genuinely work — structure, progression, load management, recovery —
              </p>

              <p>
                and make them accessible to normal runners with real lives, real schedules, and real goals.
              </p>

              <p className="font-semibold text-lg sm:text-xl">
                RUN MVMT exists for one reason:
              </p>

              <p className="font-semibold text-lg sm:text-xl">
                When you remove the guesswork, everything improves — your consistency, your confidence, and your ability to stay injury-free.
              </p>

              <p>
                Whether you grab the free 12-week plan or join the premium program, my goal is the same:
              </p>

              <p>
                to help you train smarter, not harder, and finally feel like you're moving forward again.
              </p>

              <p className="text-lg sm:text-xl font-semibold">
                It's more than running.
              </p>

              <p className="text-lg sm:text-xl font-semibold">
                It's a movement — and we'd love to have you be part of it.
              </p>
            </div>

            {/* Face Card and Signature */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-center gap-6 text-left">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
                  <Image
                    src="/images/DeonKenzie.jpg"
                    alt="Deon Kenzie"
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
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

            {/* Call to Action */}
            <div className="mt-16 pt-12 border-t border-gray-200">
              {!isLoggedIn ? (
                <div className="text-center bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-8 sm:p-12 border-2 border-gray-200">
                  <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
                    Get Your Free 12-Week Training Program
                  </h2>
                  <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
                    Start your running journey with a personalized training plan designed specifically for your goals, fitness level, and schedule.
                  </p>
                  <button
                    onClick={handleGetStarted}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl hover:opacity-90 transition-all duration-200"
                  >
                    Get Started Free
                  </button>
                </div>
              ) : (
                <div className="text-center bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-8 sm:p-12 border-2 border-primary relative overflow-hidden">
                  {/* Popular Badge */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      LIMITED TIME OFFER
                    </span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4 mt-4">
                    Get Access to Our Premium Program
                  </h2>
                  <div className="flex items-baseline justify-center gap-3 mb-4">
                    <span className="text-5xl sm:text-6xl font-bold text-primary">$99</span>
                    <div className="flex flex-col items-start">
                      <span className="text-2xl text-text-secondary line-through">$299</span>
                      <span className="text-sm text-text-secondary">AUD</span>
                    </div>
                  </div>
                  <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
                    Unlock everything: strength training, nutrition plans, mindset strategies, recovery tools, and more. One-time payment, lifetime access.
                  </p>
                  <button
                    onClick={() => router.push('/pricing')}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl hover:opacity-90 transition-all duration-200"
                  >
                    Get Premium Access
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

