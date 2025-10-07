'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface Metric {
  id: string
  name: string
  value: number
  color: string
  isTopK: boolean
}

interface MetricsDisplayProps {
  metrics: Metric[]
  title?: string
  className?: string
  showValues?: boolean
  animated?: boolean
}

const MetricsDisplay: React.FC<MetricsDisplayProps> = ({
  metrics,
  title = "Your Personality Profile",
  className,
  showValues = true,
  animated = true
}) => {
  const maxValue = Math.max(...metrics.map(m => m.value))
  const normalizedMetrics = metrics.map(metric => ({
    ...metric,
    percentage: maxValue > 0 ? (metric.value / maxValue) * 100 : 0
  }))

  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="p-6">
        {title && (
          <h3 className="text-lg font-semibold text-center mb-6">{title}</h3>
        )}
        
        <div className="space-y-4">
          {normalizedMetrics.map((metric, index) => (
            <div key={metric.id} className="relative">
              <div className="flex justify-between items-center mb-2">
                <span 
                  className={cn(
                    "font-medium transition-all duration-300",
                    metric.isTopK 
                      ? "text-gray-900 text-base" 
                      : "text-gray-400 text-sm blur-[1px]"
                  )}
                >
                  {metric.name}
                </span>
                {showValues && (
                  <span 
                    className={cn(
                      "text-sm font-medium transition-all duration-300",
                      metric.isTopK 
                        ? "text-gray-700" 
                        : "text-gray-300 blur-[1px]"
                    )}
                  >
                    {metric.value.toFixed(1)}
                  </span>
                )}
              </div>
              
              <div 
                className={cn(
                  "h-3 bg-gray-100 rounded-full overflow-hidden transition-all duration-300",
                  !metric.isTopK && "blur-[1px] opacity-50"
                )}
              >
                <motion.div
                  className="h-full rounded-full transition-colors duration-300"
                  style={{ backgroundColor: metric.color }}
                  initial={animated ? { width: 0 } : { width: `${metric.percentage}%` }}
                  animate={{ width: `${metric.percentage}%` }}
                  transition={{ 
                    duration: animated ? 1 : 0, 
                    delay: animated ? index * 0.1 : 0,
                    ease: "easeOut" 
                  }}
                />
              </div>
              
              {metric.isTopK && (
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white shadow-sm"
                  initial={animated ? { scale: 0 } : { scale: 1 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: animated ? 0.5 + index * 0.1 : 0 
                  }}
                />
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Top traits are highlighted • Others are softly blurred</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default MetricsDisplay
