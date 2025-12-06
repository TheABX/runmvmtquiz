'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { classifyPersona } from '@/src/lib/runmvmtPersonas'
import { generateTrainingPlan } from '@/src/lib/runmvmtPlanGenerator'
import type { QuizAnswers } from '@/src/lib/runmvmtTypes'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'error'>('loading')
  const [message, setMessage] = useState<string>('Setting up your plan...')

  useEffect(() => {
    const run = async () => {
      try {
        // Import supabase dynamically
        const { supabase } = await import('@/src/lib/supabaseClient')
        
        if (!supabase) {
          setStatus('error')
          setMessage('Supabase is not configured. Please check your environment variables.')
          return
        }

        // Get authenticated user
        const { data: userData, error: userError } = await supabase.auth.getUser()
        
        if (userError || !userData.user) {
          setStatus('error')
          setMessage('Login link invalid or expired.')
          return
        }

        const user = userData.user

        // Read quiz data from localStorage
        const stored = localStorage.getItem('runmvmt_training_quiz')
        if (!stored) {
          router.replace('/runmvmt-quiz')
          return
        }

        const { firstName, quizData } = JSON.parse(stored)

        // 1) Upsert user_profiles
        const { error: profileError } = await supabase
          .from('user_profiles')
          .upsert({
            user_id: user.id,
            first_name: firstName,
            email: user.email,
          }, {
            onConflict: 'user_id'
          })

        if (profileError) {
          console.error('Profile error:', profileError)
          console.error('Error details:', {
            message: profileError.message,
            details: profileError.details,
            hint: profileError.hint,
            code: profileError.code,
          })
          setStatus('error')
          setMessage(`Error saving profile: ${profileError.message}. Please check the browser console for details.`)
          return
        }

        // 2) Map quizData keys to training_setup columns
        // Note: Adjust these mappings based on your actual database schema
        const trainingSetupData = {
          user_id: user.id,
          goal_distance: quizData.goal_distance || null,
          primary_goal: quizData.goal_type || null,
          has_race_date: quizData.has_race_date || null,
          race_date: quizData.race_date || null,
          current_runs_per_week: quizData.current_runs_per_week || null,
          current_weekly_distance_band: quizData.current_weekly_km || null,
          current_long_run_band: quizData.longest_run || null,
          recent_race_result: quizData.recent_race_time || null,
          desired_runs_per_week: quizData.preferred_days_per_week || null,
          preferred_sessions: Array.isArray(quizData.session_preferences) 
            ? quizData.session_preferences.join(',') 
            : quizData.session_preferences || null,
          lifestyle: quizData.lifestyle || null,
          injury_status: quizData.injury_status || null,
          recovery_feel: quizData.recovery_feel || null,
          main_surface: quizData.main_surface || null,
          course_profile: quizData.course_profile || null,
          strength_training: quizData.strength_training || null,
          structure_preference: quizData.structure_preference || null,
          biggest_challenge: quizData.biggest_challenge || null,
          other_challenge_detail: quizData.other_challenge_detail || null,
          uses_hr: quizData.uses_hr || null,
          threshold_hr: quizData.threshold_hr || null,
          tracking_method: quizData.tracking_method || null,
        }

        // Insert into training_setup and return id
        const { data: setupRow, error: setupError } = await supabase
          .from('training_setup')
          .insert(trainingSetupData)
          .select('id')
          .single()

        if (setupError) {
          console.error('Setup error:', setupError)
          console.error('Error details:', {
            message: setupError.message,
            details: setupError.details,
            hint: setupError.hint,
            code: setupError.code,
          })
          setStatus('error')
          setMessage(`Error saving training setup: ${setupError.message}. Please check the browser console for details.`)
          return
        }

        const trainingSetupId = setupRow?.id as number | undefined

        // 3) Generate the 12-week training plan from quiz answers and persist it
        try {
          const answers = quizData as QuizAnswers
          const persona = classifyPersona(answers)
          const trainingPlan = generateTrainingPlan(answers, persona)

          // Insert into training_plans
          const { data: planRow, error: planError } = await supabase
            .from('training_plans')
            .insert({
              user_id: user.id,
              distance: trainingPlan.distance,
              goal: trainingPlan.goal,
              duration_weeks: trainingPlan.durationWeeks,
              persona_id: persona.id,
              persona_label: persona.label,
              persona_description: persona.description,
              notes: trainingPlan.notes ?? null,
              training_setup_id: trainingSetupId ?? null,
            })
            .select('id')
            .single()

          if (planError) {
            console.error('Plan insert error:', planError)
            console.error('Error details:', {
              message: planError.message,
              details: planError.details,
              hint: planError.hint,
              code: planError.code,
            })
            setStatus('error')
            setMessage(`Error saving training plan: ${planError.message}. Please check the browser console for details.`)
            return
          }

          const planId = planRow.id as number

          // Insert weeks + sessions
          for (const weekly of trainingPlan.weeklyStructure) {
            const { data: weekRow, error: weekError } = await supabase
              .from('training_weeks')
              .insert({
                plan_id: planId,
                week_number: weekly.week,
                target_km: weekly.targetKm,
                focus: weekly.focus,
              })
              .select('id')
              .single()

            if (weekError) {
              console.error('Week insert error:', weekError)
              console.error('Error details:', {
                message: weekError.message,
                details: weekError.details,
                hint: weekError.hint,
                code: weekError.code,
              })
              setStatus('error')
              setMessage(`Error saving training week: ${weekError.message}. Please check the browser console for details.`)
              return
            }

            const weekId = weekRow.id as number

            if (weekly.keySessions && weekly.keySessions.length > 0) {
              const sessionRows = weekly.keySessions.map((session) => ({
                user_id: user.id,
                plan_id: planId,
                week_id: weekId,
                week_number: weekly.week,
                day_label: session.day,
                session_type: session.type,
                description: session.description || null,
                duration_km_or_min: session.durationKmOrMin ?? null,
                intensity_hint: session.intensityHint || null,
              }))

              const { error: sessionsError } = await supabase
                .from('training_sessions')
                .insert(sessionRows)

              if (sessionsError) {
                console.error('Sessions insert error:', sessionsError)
                console.error('Error details:', {
                  message: sessionsError.message,
                  details: sessionsError.details,
                  hint: sessionsError.hint,
                  code: sessionsError.code,
                })
                setStatus('error')
                setMessage(`Error saving training sessions: ${sessionsError.message}. Please check the browser console for details.`)
                return
              }
            }
          }
        } catch (planErr: any) {
          console.error('Unexpected error generating/saving training plan:', planErr)
          setStatus('error')
          setMessage(planErr.message || 'Error generating training plan. Please try again.')
          return
        }

        // TODO: Generate 12-week training_days rows here based on quizData + user.id
        // This will be implemented later to create individual training day records

        // IMPORTANT: Keep quiz data so the quiz page can rebuild the plan
        // localStorage.removeItem('runmvmt_training_quiz')

        // Redirect back to the quiz final screen (training program view)
        router.replace('/runmvmt-quiz?screen=final')
      } catch (err: any) {
        console.error('Unexpected error:', err)
        setStatus('error')
        setMessage(err.message || 'Something went wrong. Please try again.')
      }
    }

    run()
  }, [router])

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-text-primary mb-4">Error</h2>
          <p className="text-text-secondary mb-6">{message}</p>
          <button
            onClick={() => router.push('/runmvmt-quiz')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white font-medium rounded-lg hover:opacity-90 transition-all"
          >
            Back to Quiz
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="text-6xl mb-4 animate-pulse">⏳</div>
        <h2 className="text-2xl font-bold text-text-primary mb-4">Setting up your plan...</h2>
        <p className="text-text-secondary">{message}</p>
        <div className="mt-6 flex justify-center gap-2">
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
    </div>
  )
}

