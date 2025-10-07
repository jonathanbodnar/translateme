'use client'

import React, { useState } from 'react'
import Navigation from '@/components/Navigation'
import QuizInterface from '@/components/QuizInterface'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScoringEngine, type ScoringResult } from '@/lib/scoring'
import { generateQuizQuestions } from '@/lib/ai'
import { Sparkles, Play, ArrowLeft } from 'lucide-react'

// Mock quiz data - in a real app, this would come from the database
const mockQuiz = {
  id: 'demo-quiz',
  title: 'Communication Style Assessment',
  alignmentPhraseRules: {
    'thinking-feeling': 'Consider how you typically make decisions...',
    'sensing-intuition': 'Think about how you process information...'
  },
  choiceMode: '3-choice' as const
}

const mockQuestions = [
  {
    id: 'q1',
    text: 'I prefer to make decisions based on logical analysis rather than personal values',
    meta: { category: 'thinking-feeling' },
    answerOptions: [
      {
        id: 'q1-left',
        label: 'Disagree',
        swipeMapping: 'left',
        contributionMap: ScoringEngine.createContributionMap('left', 'thinking-feeling')
      },
      {
        id: 'q1-right',
        label: 'Agree',
        swipeMapping: 'right',
        contributionMap: ScoringEngine.createContributionMap('right', 'thinking-feeling')
      },
      {
        id: 'q1-up',
        label: 'Neutral',
        swipeMapping: 'up',
        contributionMap: ScoringEngine.createContributionMap('up', 'thinking-feeling')
      }
    ]
  },
  {
    id: 'q2',
    text: 'I focus on concrete details and facts rather than abstract possibilities',
    meta: { category: 'sensing-intuition' },
    answerOptions: [
      {
        id: 'q2-left',
        label: 'Disagree',
        swipeMapping: 'left',
        contributionMap: ScoringEngine.createContributionMap('left', 'sensing-intuition')
      },
      {
        id: 'q2-right',
        label: 'Agree',
        swipeMapping: 'right',
        contributionMap: ScoringEngine.createContributionMap('right', 'sensing-intuition')
      },
      {
        id: 'q2-up',
        label: 'Neutral',
        swipeMapping: 'up',
        contributionMap: ScoringEngine.createContributionMap('up', 'sensing-intuition')
      }
    ]
  },
  {
    id: 'q3',
    text: 'I am more comfortable with established methods than trying new approaches',
    meta: { category: 'general' },
    answerOptions: [
      {
        id: 'q3-left',
        label: 'Disagree',
        swipeMapping: 'left',
        contributionMap: ScoringEngine.createContributionMap('left', 'general')
      },
      {
        id: 'q3-right',
        label: 'Agree',
        swipeMapping: 'right',
        contributionMap: ScoringEngine.createContributionMap('right', 'general')
      },
      {
        id: 'q3-up',
        label: 'Neutral',
        swipeMapping: 'up',
        contributionMap: ScoringEngine.createContributionMap('up', 'general')
      }
    ]
  },
  {
    id: 'q4',
    text: 'I consider the impact on people when making decisions',
    meta: { category: 'thinking-feeling' },
    answerOptions: [
      {
        id: 'q4-left',
        label: 'Disagree',
        swipeMapping: 'left',
        contributionMap: ScoringEngine.createContributionMap('left', 'thinking-feeling')
      },
      {
        id: 'q4-right',
        label: 'Agree',
        swipeMapping: 'right',
        contributionMap: ScoringEngine.createContributionMap('right', 'thinking-feeling')
      },
      {
        id: 'q4-up',
        label: 'Neutral',
        swipeMapping: 'up',
        contributionMap: ScoringEngine.createContributionMap('up', 'thinking-feeling')
      }
    ]
  },
  {
    id: 'q5',
    text: 'I enjoy brainstorming and exploring theoretical concepts',
    meta: { category: 'sensing-intuition' },
    answerOptions: [
      {
        id: 'q5-left',
        label: 'Disagree',
        swipeMapping: 'left',
        contributionMap: ScoringEngine.createContributionMap('left', 'sensing-intuition')
      },
      {
        id: 'q5-right',
        label: 'Agree',
        swipeMapping: 'right',
        contributionMap: ScoringEngine.createContributionMap('right', 'sensing-intuition')
      },
      {
        id: 'q5-up',
        label: 'Neutral',
        swipeMapping: 'up',
        contributionMap: ScoringEngine.createContributionMap('up', 'sensing-intuition')
      }
    ]
  }
]

export default function QuizPage() {
  const [view, setView] = useState<'setup' | 'quiz' | 'complete'>('setup')
  const [quizContext, setQuizContext] = useState({
    situationContext: '',
    goal: '',
    tonePreference: '',
    otherPersonRole: ''
  })
  const [currentQuestions, setCurrentQuestions] = useState(mockQuestions)
  const [isGenerating, setIsGenerating] = useState(false)
  const [results, setResults] = useState<{
    answers: Array<{ questionId: string; optionId: string; direction: string }>
    scores: ScoringResult[]
  } | null>(null)

  const handleGenerateCustomQuiz = async () => {
    setIsGenerating(true)
    try {
      const generatedQuestions = await generateQuizQuestions(quizContext, 5)
      
      // Convert generated questions to the expected format
      const formattedQuestions = generatedQuestions.map((text, index) => ({
        id: `generated-${index}`,
        text,
        meta: { category: 'general' },
        answerOptions: [
          {
            id: `gen-${index}-left`,
            label: 'Disagree',
            swipeMapping: 'left',
            contributionMap: ScoringEngine.createContributionMap('left', 'general')
          },
          {
            id: `gen-${index}-right`,
            label: 'Agree',
            swipeMapping: 'right',
            contributionMap: ScoringEngine.createContributionMap('right', 'general')
          },
          {
            id: `gen-${index}-up`,
            label: 'Neutral',
            swipeMapping: 'up',
            contributionMap: ScoringEngine.createContributionMap('up', 'general')
          }
        ]
      }))

      setCurrentQuestions(formattedQuestions)
      setView('quiz')
    } catch (error) {
      console.error('Error generating custom quiz:', error)
      // Fallback to default quiz
      setView('quiz')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleQuizComplete = (quizResults: {
    answers: Array<{ questionId: string; optionId: string; direction: string }>
    scores: ScoringResult[]
  }) => {
    setResults(quizResults)
    setView('complete')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      <main className="lg:ml-72 p-4 lg:p-8">
        <div className="pt-16 lg:pt-0">
          {view === 'setup' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    Personality Assessment Setup
                  </CardTitle>
                  <p className="text-gray-600">
                    Customize your quiz experience with AI-generated questions, or take our standard assessment
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="situation">Situation Context (Optional)</Label>
                    <Input
                      id="situation"
                      placeholder="e.g., Workplace communication, family discussions..."
                      value={quizContext.situationContext}
                      onChange={(e) => setQuizContext(prev => ({ ...prev, situationContext: e.target.value }))}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="goal">Assessment Goal (Optional)</Label>
                    <Input
                      id="goal"
                      placeholder="e.g., Understanding my communication style, improving relationships..."
                      value={quizContext.goal}
                      onChange={(e) => setQuizContext(prev => ({ ...prev, goal: e.target.value }))}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="tone">Tone Preference</Label>
                      <Input
                        id="tone"
                        placeholder="e.g., Professional, casual, friendly..."
                        value={quizContext.tonePreference}
                        onChange={(e) => setQuizContext(prev => ({ ...prev, tonePreference: e.target.value }))}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="role">Other Person Role</Label>
                      <Input
                        id="role"
                        placeholder="e.g., Colleague, friend, family member..."
                        value={quizContext.otherPersonRole}
                        onChange={(e) => setQuizContext(prev => ({ ...prev, otherPersonRole: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button
                      onClick={handleGenerateCustomQuiz}
                      disabled={isGenerating}
                      className="flex-1"
                    >
                      {isGenerating ? (
                        <>
                          <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                          Generating Custom Quiz...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate Custom Quiz
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => setView('quiz')}
                      className="flex-1"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Take Standard Quiz
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {view === 'quiz' && (
            <div>
              <Button
                variant="ghost"
                onClick={() => setView('setup')}
                className="mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Setup
              </Button>
              
              <QuizInterface
                quiz={mockQuiz}
                questions={currentQuestions}
                onComplete={handleQuizComplete}
              />
            </div>
          )}

          {view === 'complete' && results && (
            <div className="max-w-4xl mx-auto">
              <Button
                variant="ghost"
                onClick={() => {
                  setView('setup')
                  setResults(null)
                }}
                className="mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Take Another Quiz
              </Button>
              
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Assessment Complete!</CardTitle>
                  <p className="text-gray-600">
                    Your personality profile has been generated based on your responses
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="text-center text-gray-500">
                    <p>Results would be displayed here with detailed insights and recommendations.</p>
                    <p className="mt-2">This would include your top personality traits, communication suggestions, and next steps.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
