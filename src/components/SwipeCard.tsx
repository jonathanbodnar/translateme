'use client'

import React, { useState, useRef } from 'react'
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, ChevronUp, SkipForward } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SwipeCardProps {
  question: string
  alignmentPhrase?: string
  onSwipe: (direction: 'left' | 'right' | 'up' | 'skip') => void
  allowUp?: boolean
  allowSkip?: boolean
  className?: string
}

const SwipeCard: React.FC<SwipeCardProps> = ({
  question,
  alignmentPhrase,
  onSwipe,
  allowUp = false,
  allowSkip = false,
  className
}) => {
  const [exitDirection, setExitDirection] = useState<string | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const rotateX = useTransform(y, [-100, 0, 100], [15, 0, -15])
  const rotateZ = useTransform(x, [-150, 0, 150], [-10, 0, 10])
  const opacity = useTransform([x, y], ([xVal, yVal]) => {
    const distance = Math.sqrt(xVal * xVal + yVal * yVal)
    return Math.max(0.5, 1 - distance / 200)
  })

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, velocity } = info
    const swipeThreshold = 100
    const velocityThreshold = 500

    if (Math.abs(offset.x) > swipeThreshold || Math.abs(velocity.x) > velocityThreshold) {
      const direction = offset.x > 0 ? 'right' : 'left'
      setExitDirection(direction)
      setTimeout(() => onSwipe(direction), 150)
    } else if (allowUp && (offset.y < -swipeThreshold || velocity.y < -velocityThreshold)) {
      setExitDirection('up')
      setTimeout(() => onSwipe('up'), 150)
    } else {
      // Snap back to center
      x.set(0)
      y.set(0)
    }
  }

  const handleButtonClick = (direction: 'left' | 'right' | 'up' | 'skip') => {
    setExitDirection(direction)
    setTimeout(() => onSwipe(direction), 150)
  }

  const getExitAnimation = () => {
    switch (exitDirection) {
      case 'left':
        return { x: -300, opacity: 0, transition: { duration: 0.3 } }
      case 'right':
        return { x: 300, opacity: 0, transition: { duration: 0.3 } }
      case 'up':
        return { y: -300, opacity: 0, transition: { duration: 0.3 } }
      case 'skip':
        return { scale: 0, opacity: 0, transition: { duration: 0.2 } }
      default:
        return {}
    }
  }

  return (
    <div className={cn("relative w-full max-w-md mx-auto", className)}>
      {alignmentPhrase && (
        <div className="text-center mb-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
          <p className="text-sm font-medium text-blue-800">{alignmentPhrase}</p>
        </div>
      )}
      
      <motion.div
        ref={cardRef}
        className="relative cursor-grab active:cursor-grabbing"
        style={{ x, y, rotateX, rotateZ, opacity }}
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.7}
        onDragEnd={handleDragEnd}
        animate={exitDirection ? getExitAnimation() : {}}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Card className="h-80 flex flex-col justify-center bg-gradient-to-br from-white to-gray-50 border-2 shadow-xl">
          <CardContent className="p-8 text-center">
            <p className="text-lg font-medium leading-relaxed text-gray-800">
              {question}
            </p>
          </CardContent>
        </Card>

        {/* Swipe indicators */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold"
            style={{ opacity: useTransform(x, [-150, -50, 0], [1, 0.7, 0]) }}
          >
            DISAGREE
          </motion.div>
          <motion.div
            className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold"
            style={{ opacity: useTransform(x, [0, 50, 150], [0, 0.7, 1]) }}
          >
            AGREE
          </motion.div>
          {allowUp && (
            <motion.div
              className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold"
              style={{ opacity: useTransform(y, [-150, -50, 0], [1, 0.7, 0]) }}
            >
              NEUTRAL
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Action buttons */}
      <div className="flex justify-center gap-4 mt-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleButtonClick('left')}
          className="w-12 h-12 rounded-full bg-red-50 border-red-200 hover:bg-red-100"
        >
          <ChevronLeft className="h-5 w-5 text-red-600" />
        </Button>

        {allowUp && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleButtonClick('up')}
            className="w-12 h-12 rounded-full bg-blue-50 border-blue-200 hover:bg-blue-100"
          >
            <ChevronUp className="h-5 w-5 text-blue-600" />
          </Button>
        )}

        <Button
          variant="outline"
          size="icon"
          onClick={() => handleButtonClick('right')}
          className="w-12 h-12 rounded-full bg-green-50 border-green-200 hover:bg-green-100"
        >
          <ChevronRight className="h-5 w-5 text-green-600" />
        </Button>

        {allowSkip && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleButtonClick('skip')}
            className="w-12 h-12 rounded-full bg-gray-50 border-gray-200 hover:bg-gray-100"
          >
            <SkipForward className="h-5 w-5 text-gray-600" />
          </Button>
        )}
      </div>

      {/* Instructions */}
      <div className="text-center mt-4 text-sm text-gray-500">
        <p>Swipe or tap to answer</p>
        <div className="flex justify-center gap-4 mt-1">
          <span className="text-red-600">← Disagree</span>
          {allowUp && <span className="text-blue-600">↑ Neutral</span>}
          <span className="text-green-600">Agree →</span>
        </div>
      </div>
    </div>
  )
}

export default SwipeCard
