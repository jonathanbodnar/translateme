'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import SwipeCard from '@/components/SwipeCard'
import MetricsDisplay from '@/components/MetricsDisplay'
import { generateWimtsCandidates } from '@/lib/ai'
import { Loader2, Sparkles, Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WimtsInterfaceProps {
  userMetrics?: Array<{
    id: string
    name: string
    value: number
    color: string
    isTopK: boolean
  }>
  onSave: (data: {
    rawInput: string
    situationContext?: string
    finalText: string
    otherPersonTranslate?: string
  }) => void
  className?: string
}

const WimtsInterface: React.FC<WimtsInterfaceProps> = ({
  userMetrics,
  onSave,
  className
}) => {
  const [step, setStep] = useState<'input' | 'candidates' | 'final'>('input')
  const [rawInput, setRawInput] = useState('')
  const [situationContext, setSituationContext] = useState('')
  const [candidates, setCandidates] = useState<string[]>([])
  const [selectedCandidate, setSelectedCandidate] = useState<string>('')
  const [finalText, setFinalText] = useState('')
  const [otherPersonTranslate, setOtherPersonTranslate] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleGenerateCandidates = async () => {
    if (!rawInput.trim()) return

    setIsLoading(true)
    try {
      const metricsMap = userMetrics?.reduce((acc, metric) => {
        acc[metric.name.toLowerCase()] = metric.value
        return acc
      }, {} as Record<string, number>)

      const generatedCandidates = await generateWimtsCandidates({
        rawInput,
        situationContext,
        personalityMetrics: metricsMap
      })

      setCandidates(generatedCandidates)
      setStep('candidates')
    } catch (error) {
      console.error('Error generating candidates:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCandidateSelect = (direction: 'left' | 'right' | 'up' | 'skip') => {
    let selectedIndex = 0
    if (direction === 'right') selectedIndex = 1
    if (direction === 'up') selectedIndex = 2

    const selected = candidates[selectedIndex] || rawInput
    setSelectedCandidate(selected)
    setFinalText(selected)
    setStep('final')
  }

  const handleSave = () => {
    onSave({
      rawInput,
      situationContext: situationContext || undefined,
      finalText,
      otherPersonTranslate: otherPersonTranslate || undefined
    })
  }

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (error) {
      console.error('Failed to copy text:', error)
    }
  }

  return (
    <div className={cn("max-w-4xl mx-auto space-y-6", className)}>
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            What I Meant to Say
          </CardTitle>
          <p className="text-gray-600">
            Transform your message with AI-powered suggestions tailored to your personality
          </p>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Interface */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {step === 'input' && (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <Label htmlFor="raw-input">What do you want to say?</Label>
                      <Textarea
                        id="raw-input"
                        placeholder="Type your message here..."
                        value={rawInput}
                        onChange={(e) => setRawInput(e.target.value)}
                        className="min-h-24 mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="situation">Situation Context (Optional)</Label>
                      <Input
                        id="situation"
                        placeholder="e.g., Work meeting, family discussion, friend chat..."
                        value={situationContext}
                        onChange={(e) => setSituationContext(e.target.value)}
                        className="mt-2"
                      />
                    </div>

                    <Button
                      onClick={handleGenerateCandidates}
                      disabled={!rawInput.trim() || isLoading}
                      className="w-full"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating suggestions...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Get AI Suggestions
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === 'candidates' && candidates.length > 0 && (
              <motion.div
                key="candidates"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-sm text-gray-600 mb-2">Original:</div>
                      <div className="p-3 bg-gray-50 rounded-lg text-sm">
                        {rawInput}
                      </div>
                    </CardContent>
                  </Card>

                  <SwipeCard
                    question={candidates[0] || 'No suggestions available'}
                    alignmentPhrase="Swipe to choose your preferred style"
                    onSwipe={handleCandidateSelect}
                    allowUp={true}
                    className="mb-4"
                  />

                  <div className="grid gap-3">
                    {candidates.map((candidate, index) => (
                      <Card key={index} className="relative">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start gap-3">
                            <div className="flex-1">
                              <div className="text-xs text-gray-500 mb-1">
                                Option {index + 1}
                                {index === 0 && ' (Left)'}
                                {index === 1 && ' (Right)'}
                                {index === 2 && ' (Up)'}
                              </div>
                              <p className="text-sm">{candidate}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(candidate, index)}
                            >
                              {copiedIndex === index ? (
                                <Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 'final' && (
              <motion.div
                key="final"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <Label htmlFor="final-text">Final Message</Label>
                      <Textarea
                        id="final-text"
                        value={finalText}
                        onChange={(e) => setFinalText(e.target.value)}
                        className="min-h-24 mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="other-person">
                        Translation for Other Person (Optional)
                      </Label>
                      <Textarea
                        id="other-person"
                        placeholder="How would you explain this to the other person in simpler terms?"
                        value={otherPersonTranslate}
                        onChange={(e) => setOtherPersonTranslate(e.target.value)}
                        className="min-h-16 mt-2"
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setStep('candidates')}
                      >
                        Back to Options
                      </Button>
                      <Button
                        onClick={handleSave}
                        className="flex-1"
                      >
                        Save Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar - User Metrics */}
        <div className="lg:col-span-1">
          {userMetrics && userMetrics.length > 0 && (
            <MetricsDisplay
              metrics={userMetrics}
              title="Your Communication Style"
              showValues={false}
              animated={false}
            />
          )}

          <Card className="mt-6">
            <CardContent className="p-4">
              <h4 className="font-medium mb-2">How it works</h4>
              <div className="text-sm text-gray-600 space-y-2">
                <p>1. Enter your raw message</p>
                <p>2. AI generates 3 style options</p>
                <p>3. Swipe or tap to select</p>
                <p>4. Edit and save your final message</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default WimtsInterface
