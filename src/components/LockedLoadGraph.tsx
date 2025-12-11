'use client'

import React from 'react'

interface LockedLoadGraphProps {
  weeklyVolumes?: number[];
}

export function LockedLoadGraph({ weeklyVolumes = [] }: LockedLoadGraphProps) {
  // Generate sample data with realistic progression:
  // - Duration: Sharp increase early (weeks 1-6), then plateaus
  // - Intensity: Starts lower, increases more as athlete peaks (weeks 7-12)
  // - Overall Load: Duration × Intensity
  const sampleData = Array.from({ length: 12 }, (_, i) => {
    const week = i + 1
    // Duration: Sharp increase early (30min → 90min by week 6), then plateaus around 90-100min
    const duration = week <= 6 
      ? 30 + (week - 1) * 12  // Sharp increase: 30, 42, 54, 66, 78, 90
      : 90 + (week - 7) * 2   // Plateau: 90, 92, 94, 96, 98, 100
    
    // Intensity: Starts at 55%, gradual increase early, sharper increase as peaking (weeks 8-12)
    const intensity = week <= 4
      ? 55 + (week - 1) * 2    // Gradual: 55, 57, 59, 61
      : week <= 7
      ? 61 + (week - 4) * 2   // Moderate: 63, 65, 67
      : 67 + (week - 7) * 4   // Sharp increase: 71, 75, 79, 83, 87
    
    // Overall Load = Duration × Intensity (normalized to 0-100 scale)
    const rawLoad = duration * intensity
    const maxRawLoad = 100 * 87 // Max possible load
    const normalizedLoad = (rawLoad / maxRawLoad) * 100
    
    return {
      week,
      duration,
      intensity,
      overallLoad: normalizedLoad
    }
  })

  const width = 800
  const height = 350
  const padding = { top: 40, right: 40, bottom: 60, left: 80 }
  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom

  // Normalize all values to 0-100 scale for Y-axis
  const maxDuration = Math.max(...sampleData.map(d => d.duration), 100)
  const maxIntensity = Math.max(...sampleData.map(d => d.intensity), 100)
  const maxLoad = Math.max(...sampleData.map(d => d.overallLoad), 100)

  // Scale functions - X-axis is weeks (1-12), Y-axis is normalized 0-100
  const scaleX = (week: number) => padding.left + ((week - 1) / 11) * chartWidth
  const scaleY = (value: number) => padding.top + chartHeight - (value / 100) * chartHeight

  return (
    <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg border border-gray-200 relative overflow-hidden">
      {/* Lock Overlay */}
      <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-2xl">
        <div className="text-center space-y-4 px-8">
          {/* Lock Icon */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <svg 
                className="w-16 h-16 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                />
              </svg>
            </div>
          </div>
          
          {/* Premium Message */}
          <h3 className="text-xl sm:text-2xl font-bold text-text-primary">
            Unlock Your Optimal Load Graph
          </h3>
          <p className="text-sm sm:text-base text-text-secondary max-w-md mx-auto leading-relaxed">
            See the correlation between training duration, intensity, and volume across your 12-week program. Premium members get access to this advanced visualization to optimize their training load.
          </p>
          
          {/* Premium Badge */}
          <div className="pt-2">
            <span className="inline-block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-semibold">
              Premium Feature
            </span>
          </div>
        </div>
      </div>

      {/* Graph Content (Faded) */}
      <div className="opacity-30">
        <h3 className="text-xl font-bold text-text-primary mb-4">
          📊 Training Load Correlation
        </h3>
        <p className="text-sm text-text-secondary mb-4">
          Duration, Intensity, and Overall Load progression across 12 weeks
        </p>
        
        <div className="w-full overflow-x-auto">
          <svg 
            width={width} 
            height={height} 
            className="w-full" 
            viewBox={`0 0 ${width} ${height}`}
          >
            {/* Grid Lines */}
            {[0, 25, 50, 75, 100].map((val) => (
              <g key={val}>
                <line
                  x1={padding.left}
                  y1={scaleY(val)}
                  x2={width - padding.right}
                  y2={scaleY(val)}
                  stroke="#E5E7EB"
                  strokeWidth={1}
                  strokeDasharray="4 4"
                />
                <text
                  x={padding.left - 10}
                  y={scaleY(val)}
                  textAnchor="end"
                  dominantBaseline="middle"
                  style={{ fontSize: '12px', fill: '#6B7280' }}
                >
                  {val}%
                </text>
              </g>
            ))}

            {/* X-Axis Labels */}
            {sampleData.map((d) => (
              <text
                key={d.week}
                x={scaleX(d.week)}
                y={height - padding.bottom + 20}
                textAnchor="middle"
                style={{ fontSize: '12px', fill: '#6B7280' }}
              >
                W{d.week}
              </text>
            ))}

            {/* Y-Axis Label */}
            <text
              x={padding.left - 50}
              y={padding.top + chartHeight / 2}
              textAnchor="middle"
              transform={`rotate(-90 ${padding.left - 50} ${padding.top + chartHeight / 2})`}
              style={{ fontSize: '12px', fill: '#6B7280' }}
            >
              Normalized Value (%)
            </text>

            {/* Axes */}
            <line
              x1={padding.left}
              y1={padding.top}
              x2={padding.left}
              y2={height - padding.bottom}
              stroke="#D1D5DB"
              strokeWidth={2}
            />
            <line
              x1={padding.left}
              y1={height - padding.bottom}
              x2={width - padding.right}
              y2={height - padding.bottom}
              stroke="#D1D5DB"
              strokeWidth={2}
            />

            {/* Gradient Definitions */}
            <defs>
              <linearGradient id="durationGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#60A5FA" />
              </linearGradient>
              <linearGradient id="intensityGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#9333EA" />
                <stop offset="100%" stopColor="#A855F7" />
              </linearGradient>
              <linearGradient id="loadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#EC4899" />
                <stop offset="100%" stopColor="#F472B6" />
              </linearGradient>
            </defs>

            {/* Duration Line (Blue) - Normalized to 0-100 */}
            <polyline
              points={sampleData.map(d => {
                const normalizedDuration = (d.duration / maxDuration) * 100
                return `${scaleX(d.week)},${scaleY(normalizedDuration)}`
              }).join(' ')}
              fill="none"
              stroke="url(#durationGradient)"
              strokeWidth={3}
              opacity={0.8}
            />
            {sampleData.map((d) => {
              const normalizedDuration = (d.duration / maxDuration) * 100
              return (
                <circle
                  key={`duration-${d.week}`}
                  cx={scaleX(d.week)}
                  cy={scaleY(normalizedDuration)}
                  r={4}
                  fill="#3B82F6"
                  opacity={0.8}
                />
              )
            })}

            {/* Intensity Line (Purple) - Already normalized */}
            <polyline
              points={sampleData.map(d => `${scaleX(d.week)},${scaleY(d.intensity)}`).join(' ')}
              fill="none"
              stroke="url(#intensityGradient)"
              strokeWidth={3}
              opacity={0.8}
            />
            {sampleData.map((d) => (
              <circle
                key={`intensity-${d.week}`}
                cx={scaleX(d.week)}
                cy={scaleY(d.intensity)}
                r={4}
                fill="#9333EA"
                opacity={0.8}
              />
            ))}

            {/* Overall Load Line (Pink) - Already normalized */}
            <polyline
              points={sampleData.map(d => `${scaleX(d.week)},${scaleY(d.overallLoad)}`).join(' ')}
              fill="none"
              stroke="url(#loadGradient)"
              strokeWidth={3}
              opacity={0.8}
            />
            {sampleData.map((d) => (
              <circle
                key={`load-${d.week}`}
                cx={scaleX(d.week)}
                cy={scaleY(d.overallLoad)}
                r={4}
                fill="#EC4899"
                opacity={0.8}
              />
            ))}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-4 text-xs text-text-secondary">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-blue-500"></div>
            <span>Duration (normalized)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-purple-500"></div>
            <span>Intensity (%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-pink-500"></div>
            <span>Overall Load (Duration × Intensity)</span>
          </div>
        </div>
      </div>
    </div>
  )
}

