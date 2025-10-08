'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { 
  QuizQuestion, 
  AnswerChoice, 
  BucketWeights, 
  BucketType,
  validateBucketWeights,
  normalizeBucketWeights,
  DEFAULT_BUCKET_CONFIGS
} from '@/lib/quiz-types'
import { 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle,
  Eye,
  EyeOff 
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface BucketWeightEditorProps {
  questions: QuizQuestion[]
  onUpdateWeights: (questionId: string, answerId: string, weights: BucketWeights) => void
  className?: string
}

const BucketWeightEditor: React.FC<BucketWeightEditorProps> = ({
  questions,
  onUpdateWeights,
  className
}) => {
  const [selectedQuestion, setSelectedQuestion] = useState<string>(questions[0]?.id || '')
  const [showAllAnswers, setShowAllAnswers] = useState(true)

  const currentQuestion = questions.find(q => q.id === selectedQuestion)

  const handleWeightChange = (
    answerId: string,
    bucketType: BucketType,
    newValue: number[]
  ) => {
    const answer = currentQuestion?.answerChoices.find(a => a.id === answerId)
    if (!answer || !currentQuestion) return

    const newWeights: BucketWeights = {
      ...answer.bucketWeights,
      [bucketType]: newValue[0]
    }

    // Validate total doesn't exceed 10
    const total = Object.values(newWeights).reduce((sum, val) => sum + val, 0)
    if (total <= 10) {
      onUpdateWeights(currentQuestion.id, answerId, newWeights)
    }
  }

  const handleNormalizeWeights = (answerId: string) => {
    const answer = currentQuestion?.answerChoices.find(a => a.id === answerId)
    if (!answer || !currentQuestion) return

    const normalized = normalizeBucketWeights(answer.bucketWeights)
    onUpdateWeights(currentQuestion.id, answerId, normalized)
  }

  const handleResetWeights = (answerId: string) => {
    if (!currentQuestion) return
    
    const resetWeights: BucketWeights = {
      feeling: 0,
      sensing: 0,
      intuition: 0,
      thinking: 0
    }
    
    onUpdateWeights(currentQuestion.id, answerId, resetWeights)
  }

  const getWeightTotal = (weights: BucketWeights): number => {
    return Object.values(weights).reduce((sum, val) => sum + val, 0)
  }

  const getWeightValidation = (weights: BucketWeights) => {
    const total = getWeightTotal(weights)
    const isValid = validateBucketWeights(weights)
    
    return {
      total,
      isValid,
      message: total > 10 ? `Total exceeds 10 (${total.toFixed(1)})` : 
               total === 0 ? 'No weights assigned' :
               `Total: ${total.toFixed(1)}/10`
    }
  }

  if (!currentQuestion) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center text-gray-500">
          No questions available to configure weights.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Question Selector */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              🎯 Bucket Weight Configuration
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAllAnswers(!showAllAnswers)}
            >
              {showAllAnswers ? (
                <>
                  <EyeOff className="w-4 h-4 mr-2" />
                  Hide Details
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Show All
                </>
              )}
            </Button>
          </div>
          <p className="text-gray-600">
            Configure how each answer choice contributes to the 4 personality buckets. 
            Total weight per answer must not exceed 10 points.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Select Question to Configure</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {questions.map((question) => (
                <Button
                  key={question.id}
                  variant={selectedQuestion === question.id ? "default" : "outline"}
                  className="justify-start text-left h-auto p-3"
                  onClick={() => setSelectedQuestion(question.id)}
                >
                  <div>
                    <div className="font-medium text-sm">
                      Q{question.order}: {question.text.substring(0, 50)}...
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {question.answerChoices.length} answer choices
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bucket Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Personality Buckets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {DEFAULT_BUCKET_CONFIGS.map((bucket) => (
              <div key={bucket.id} className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: bucket.color }}
                />
                <div>
                  <div className="font-medium text-sm">{bucket.name}</div>
                  <div className="text-xs text-gray-500">{bucket.icon}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p><strong>Feeling:</strong> Emotional resonance, empathy, values-based decisions</p>
            <p><strong>Sensing:</strong> Concrete details, facts, practical focus</p>
            <p><strong>Intuition:</strong> Abstract patterns, big picture, possibilities</p>
            <p><strong>Thinking:</strong> Logic, structure, analytical reasoning</p>
          </div>
        </CardContent>
      </Card>

      {/* Weight Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>
            Configure Weights: {currentQuestion.text}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentQuestion.answerChoices.map((answer, index) => {
            const validation = getWeightValidation(answer.bucketWeights)
            
            return (
              <motion.div
                key={answer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "p-4 border rounded-lg space-y-4",
                  validation.isValid ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                )}
              >
                {/* Answer Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">
                      {answer.swipeDirection === 'left' ? '← Left' : 
                       answer.swipeDirection === 'right' ? 'Right →' : 
                       answer.swipeDirection === 'up' ? '↑ Up' : 'Choice'}
                    </Badge>
                    <span className="font-medium">{answer.text}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {validation.isValid ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      )}
                      <span className={cn(
                        "text-sm font-medium",
                        validation.isValid ? "text-green-700" : "text-red-700"
                      )}>
                        {validation.message}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleNormalizeWeights(answer.id)}
                      disabled={validation.total === 0}
                    >
                      <RotateCcw className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {/* Weight Sliders */}
                {showAllAnswers && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {DEFAULT_BUCKET_CONFIGS.map((bucket) => {
                      const currentValue = answer.bucketWeights[bucket.id]
                      return (
                        <div key={bucket.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: bucket.color }}
                              />
                              {bucket.name}
                            </Label>
                            <span className="text-sm font-medium">
                              {currentValue.toFixed(1)}
                            </span>
                          </div>
                          <Slider
                            value={[currentValue]}
                            onValueChange={(value) => 
                              handleWeightChange(answer.id, bucket.id, value)
                            }
                            min={0}
                            max={10}
                            step={0.5}
                            className="w-full"
                          />
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Quick Actions */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleResetWeights(answer.id)}
                    >
                      Reset to 0
                    </Button>
                  </div>
                  <div className="text-xs text-gray-500">
                    Swipe {answer.swipeDirection} • Total: {validation.total.toFixed(1)}/10
                  </div>
                </div>
              </motion.div>
            )
          })}
        </CardContent>
      </Card>

      {/* Weight Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Question Weight Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentQuestion.answerChoices.map((answer) => {
              const validation = getWeightValidation(answer.bucketWeights)
              return (
                <div key={answer.id} className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">{answer.text.substring(0, 40)}...</span>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {DEFAULT_BUCKET_CONFIGS.map((bucket) => (
                        <div
                          key={bucket.id}
                          className="w-2 h-4 rounded-sm"
                          style={{ 
                            backgroundColor: bucket.color,
                            opacity: answer.bucketWeights[bucket.id] / 10
                          }}
                          title={`${bucket.name}: ${answer.bucketWeights[bucket.id]}`}
                        />
                      ))}
                    </div>
                    <Badge variant={validation.isValid ? "default" : "destructive"}>
                      {validation.total.toFixed(1)}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default BucketWeightEditor
