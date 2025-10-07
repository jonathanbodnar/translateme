'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SwipeCard from '@/components/SwipeCard'
import MetricsDisplay from '@/components/MetricsDisplay'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ScoringEngine, type ScoringResult } from '@/lib/scoring'
import { CheckCircle, ArrowRight } from 'lucide-react'

interface Question {
  id: string
  text: string
  meta?: any
  answerOptions: Array<{
    id: string
    label: string
    swipeMapping: string
    contributionMap: Record<string, number>
  }>
}

interface QuizInterfaceProps {
  quiz: {
    id: string
    title: string
    alignmentPhraseRules?: any
    choiceMode: string
  }
  questions: Question[]
  onComplete: (results: {
    answers: Array<{ questionId: string; optionId: string; direction: string }>
    scores: ScoringResult[]
  }) => void
  className?: string
}

const QuizInterface: React.FC<QuizInterfaceProps> = ({
  quiz,
  questions,
  onComplete,
  className
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Array<{ 
    questionId: string
    optionId: string 
    direction: string
    contributionMap: Record<string, number>
  }>>([])
  const [isComplete, setIsComplete] = useState(false)
  const [currentScores, setCurrentScores] = useState<ScoringResult[]>([])
  
  const buckets = ScoringEngine.getDefaultBuckets()
  const scoringEngine = new ScoringEngine(buckets)
  
  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100
  const allowUp = quiz.choiceMode === '3-choice'

  const getAlignmentPhrase = () => {
    // Simple implementation - in real app, this would be more sophisticated
    if (quiz.alignmentPhraseRules && currentQuestion?.meta?.category) {
      return quiz.alignmentPhraseRules[currentQuestion.meta.category] || null
    }
    return null
  }

  const handleSwipe = (direction: 'left' | 'right' | 'up' | 'skip') => {
    if (!currentQuestion) return

    // Find the answer option that matches the swipe direction
    const option = currentQuestion.answerOptions.find(opt => 
      opt.swipeMapping === direction
    )

    if (!option && direction !== 'skip') return

    const answer = {
      questionId: currentQuestion.id,
      optionId: option?.id || 'skipped',
      direction,
      contributionMap: option?.contributionMap || {}
    }

    const newAnswers = [...answers, answer]
    setAnswers(newAnswers)

    // Calculate current scores
    const scores = scoringEngine.calculateScores(
      newAnswers.map(a => ({
        questionId: a.questionId,
        optionId: a.optionId,
        contributionMap: a.contributionMap
      })),
      {
        id: 'default',
        expr: 'sum',
        topKHighlight: 2,
        blurNonTopK: true
      }
    )
    setCurrentScores(scores)

    // Move to next question or complete
    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1)
      }, 300)
    } else {
      setTimeout(() => {
        setIsComplete(true)
        onComplete({
          answers: newAnswers.map(({ contributionMap, ...rest }) => rest),
          scores
        })
      }, 300)
    }
  }

  const metrics = currentScores.map(score => ({
    id: score.bucketId,
    name: score.bucketName,
    value: score.score,
    color: buckets.find(b => b.id === score.bucketId)?.color || '#6B7280',
    isTopK: score.isTopK
  }))

  if (isComplete) {
    return (
      <motion.div 
        className={className}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
            <p className="text-gray-600 mt-2">
              Here's your personality profile based on your responses
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <MetricsDisplay 
              metrics={metrics}
              title=""
              showValues={true}
              animated={true}
            />
            
            <div className="text-center">
              <Button className="gap-2">
                View Full Profile
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className={className}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{quiz.title}</h2>
              <span className="text-sm text-gray-500">
                {currentQuestionIndex + 1} of {questions.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quiz Card */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {currentQuestion && (
                <motion.div
                  key={currentQuestion.id}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                >
                  <SwipeCard
                    question={currentQuestion.text}
                    alignmentPhrase={getAlignmentPhrase()}
                    onSwipe={handleSwipe}
                    allowUp={allowUp}
                    allowSkip={false}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Current Metrics */}
          <div className="lg:col-span-1">
            <AnimatePresence>
              {metrics.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <MetricsDisplay 
                    metrics={metrics}
                    title="Current Profile"
                    showValues={false}
                    animated={false}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuizInterface
