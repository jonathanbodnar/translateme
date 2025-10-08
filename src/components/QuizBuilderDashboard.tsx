'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Quiz, 
  QuizType, 
  QuizQuestion, 
  AnswerChoice, 
  BucketWeights, 
  BucketType, 
  ScoringFormula,
  PhrasingVariant,
  ToneVariant,
  validateBucketWeights,
  DEFAULT_BUCKET_CONFIGS
} from '@/lib/quiz-types'
import { QuizScoringEngine } from '@/lib/quiz-scoring'
import BucketWeightEditor from '@/components/BucketWeightEditor'
import ScoringFormulaEditor from '@/components/ScoringFormulaEditor'
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  Eye,
  EyeOff,
  Play,
  RotateCcw,
  Sparkles,
  Settings,
  BarChart3,
  Copy,
  Archive
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuizBuilderDashboardProps {
  onSaveQuiz: (quiz: Quiz) => void
  onPublishQuiz: (quizId: string) => void
  className?: string
}

const QuizBuilderDashboard: React.FC<QuizBuilderDashboardProps> = ({
  onSaveQuiz,
  onPublishQuiz,
  className
}) => {
  const [selectedQuizType, setSelectedQuizType] = useState<QuizType>('quick_onboarding')
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null)
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState(false)
  const [activeTab, setActiveTab] = useState('questions')

  const scoringEngine = new QuizScoringEngine()

  // Initialize default quizzes
  React.useEffect(() => {
    if (!currentQuiz) {
      setCurrentQuiz(getDefaultQuiz(selectedQuizType))
    }
  }, [selectedQuizType, currentQuiz])

  const getDefaultQuiz = (type: QuizType): Quiz => {
    const baseQuiz = {
      id: type,
      type,
      maxQuestions: type === 'quick_onboarding' ? 4 : 100,
      createdAt: new Date(),
      updatedAt: new Date(),
      versions: []
    }

    if (type === 'quick_onboarding') {
      return {
        ...baseQuiz,
        name: 'Quick Onboarding Quiz',
        description: 'Lightweight personality fingerprint in 4 cards max',
        currentVersion: {
          id: 'v1',
          version: '1.0.0',
          createdAt: new Date(),
          createdBy: 'admin',
          questions: getDefaultQuickQuestions(),
          scoringFormula: QuizScoringEngine.getDefaultFormula(),
          status: 'draft',
          changeLog: 'Initial version'
        }
      }
    } else {
      return {
        ...baseQuiz,
        name: 'Deep Dive Quiz',
        description: 'Rich profiling for context layer engine',
        currentVersion: {
          id: 'v1',
          version: '1.0.0',
          createdAt: new Date(),
          createdBy: 'admin',
          questions: getDefaultDeepQuestions(),
          groups: getDefaultQuestionGroups(),
          scoringFormula: QuizScoringEngine.getDefaultFormula(),
          status: 'draft',
          changeLog: 'Initial version'
        }
      }
    }
  }

  const getDefaultQuickQuestions = (): QuizQuestion[] => [
    {
      id: 'quick-1',
      text: 'When someone cancels plans last minute, what hits you first?',
      phrasings: [
        { id: 'p1', text: 'When someone cancels plans last minute, what hits you first?', tone: 'casual', isDefault: true },
        { id: 'p2', text: 'When someone bails on dinner unexpectedly, your first thought is...', tone: 'blunt', isDefault: false },
        { id: 'p3', text: 'When plans dissolve at the last moment, what stirs within you?', tone: 'poetic', isDefault: false }
      ],
      answerFormat: 'swipe',
      answerChoices: [
        {
          id: 'a1',
          text: 'I\'m hurt, like I didn\'t matter',
          swipeDirection: 'left',
          bucketWeights: { feeling: 7, sensing: 0, intuition: 2, thinking: 1 },
          phrasings: [
            { id: 'ap1', text: 'I\'m hurt, like I didn\'t matter', tone: 'tender', isDefault: true },
            { id: 'ap2', text: 'Ouch. That stings.', tone: 'blunt', isDefault: false }
          ]
        },
        {
          id: 'a2', 
          text: 'I get annoyed. That\'s rude.',
          swipeDirection: 'right',
          bucketWeights: { feeling: 1, sensing: 3, intuition: 0, thinking: 6 },
          phrasings: [
            { id: 'ap3', text: 'I get annoyed. That\'s rude.', tone: 'blunt', isDefault: true },
            { id: 'ap4', text: 'Frustrating. Basic courtesy matters.', tone: 'practical', isDefault: false }
          ]
        },
        {
          id: 'a3',
          text: 'Maybe something came up. No biggie.',
          swipeDirection: 'up',
          bucketWeights: { feeling: 3, sensing: 2, intuition: 5, thinking: 0 },
          phrasings: [
            { id: 'ap5', text: 'Maybe something came up. No biggie.', tone: 'casual', isDefault: true }
          ]
        }
      ],
      order: 1,
      isActive: true
    }
    // Add 3 more default questions...
  ]

  const getDefaultDeepQuestions = (): QuizQuestion[] => [
    // Fear detection questions
    {
      id: 'deep-fear-1',
      groupId: 'fears',
      text: 'Sometimes I feel like I\'m not enough.',
      phrasings: [
        { id: 'df1', text: 'Sometimes I feel like I\'m not enough.', tone: 'tender', isDefault: true },
        { id: 'df2', text: 'I\'ll never measure up.', tone: 'blunt', isDefault: false },
        { id: 'df3', text: 'Others are better than me.', tone: 'casual', isDefault: false }
      ],
      answerFormat: 'swipe',
      answerChoices: [
        {
          id: 'dfa1',
          text: 'Yes, this resonates strongly',
          swipeDirection: 'up',
          bucketWeights: { feeling: 8, sensing: 0, intuition: 2, thinking: 0 },
          phrasings: [{ id: 'dfap1', text: 'Yes, this resonates strongly', tone: 'tender', isDefault: true }]
        },
        {
          id: 'dfa2',
          text: 'Sometimes, but not always',
          swipeDirection: 'right', 
          bucketWeights: { feeling: 4, sensing: 2, intuition: 3, thinking: 1 },
          phrasings: [{ id: 'dfap2', text: 'Sometimes, but not always', tone: 'casual', isDefault: true }]
        },
        {
          id: 'dfa3',
          text: 'No, this doesn\'t feel true for me',
          swipeDirection: 'left',
          bucketWeights: { feeling: 0, sensing: 3, intuition: 1, thinking: 6 },
          phrasings: [{ id: 'dfap3', text: 'No, this doesn\'t feel true for me', tone: 'practical', isDefault: true }]
        }
      ],
      order: 1,
      isActive: true
    }
    // Add more deep dive questions...
  ]

  const getDefaultQuestionGroups = () => [
    {
      id: 'fears',
      name: 'Core Fears',
      description: 'Uncover underlying fears and wounds',
      weight: 0.3,
      questions: []
    },
    {
      id: 'coping',
      name: 'Coping Mechanisms', 
      description: 'How you handle stress and conflict',
      weight: 0.2,
      questions: []
    },
    {
      id: 'processing',
      name: 'Processing Style',
      description: 'Your cognitive lens and decision-making patterns',
      weight: 0.3,
      questions: []
    },
    {
      id: 'tone',
      name: 'Communication Tone',
      description: 'Preferred communication and feedback style',
      weight: 0.2,
      questions: []
    }
  ]

  const handleUpdateQuestion = (questionId: string, updates: Partial<QuizQuestion>) => {
    if (!currentQuiz) return

    const updatedQuestions = currentQuiz.currentVersion.questions.map(q =>
      q.id === questionId ? { ...q, ...updates } : q
    )

    setCurrentQuiz({
      ...currentQuiz,
      currentVersion: {
        ...currentQuiz.currentVersion,
        questions: updatedQuestions
      },
      updatedAt: new Date()
    })
  }

  const handleUpdateAnswerWeights = (
    questionId: string, 
    answerId: string, 
    newWeights: BucketWeights
  ) => {
    if (!validateBucketWeights(newWeights)) return

    const updatedQuestions = currentQuiz?.currentVersion.questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          answerChoices: q.answerChoices.map(a =>
            a.id === answerId ? { ...a, bucketWeights: newWeights } : a
          )
        }
      }
      return q
    })

    if (updatedQuestions && currentQuiz) {
      setCurrentQuiz({
        ...currentQuiz,
        currentVersion: {
          ...currentQuiz.currentVersion,
          questions: updatedQuestions
        }
      })
    }
  }

  const handlePreviewScoring = () => {
    if (!currentQuiz) return

    // Create sample answers for preview
    const sampleAnswers = currentQuiz.currentVersion.questions.slice(0, 3).map(q => ({
      questionId: q.id,
      answerId: q.answerChoices[0].id,
      bucketWeights: q.answerChoices[0].bucketWeights
    }))

    const results = scoringEngine.calculateScores(sampleAnswers, currentQuiz.currentVersion.scoringFormula)
    console.log('Preview Results:', results)
  }

  if (!currentQuiz) return <div>Loading...</div>

  return (
    <div className={cn("max-w-7xl mx-auto space-y-6", className)}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Quiz Builder Dashboard
              </CardTitle>
              <p className="text-gray-600 mt-1">
                Design and configure the two core assessment quizzes
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Select value={selectedQuizType} onValueChange={(value: QuizType) => {
                setSelectedQuizType(value)
                setCurrentQuiz(getDefaultQuiz(value))
              }}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quick_onboarding">Quick Onboarding</SelectItem>
                  <SelectItem value="deep_dive">Deep Dive</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={handlePreviewScoring}>
                <BarChart3 className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button onClick={() => onSaveQuiz(currentQuiz)}>
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Quiz Info */}
      <Card>
        <CardHeader>
          <CardTitle>{currentQuiz.name}</CardTitle>
          <p className="text-gray-600">{currentQuiz.description}</p>
          <div className="flex items-center gap-4 text-sm">
            <Badge variant="outline">
              Max Questions: {currentQuiz.maxQuestions === 100 ? 'Unlimited' : currentQuiz.maxQuestions}
            </Badge>
            <Badge variant={currentQuiz.currentVersion.status === 'published' ? 'default' : 'secondary'}>
              {currentQuiz.currentVersion.status}
            </Badge>
            <span className="text-gray-500">
              Version {currentQuiz.currentVersion.version}
            </span>
          </div>
        </CardHeader>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="weights">Bucket Weights</TabsTrigger>
          <TabsTrigger value="formulas">Scoring Formula</TabsTrigger>
          <TabsTrigger value="preview">Preview & Test</TabsTrigger>
        </TabsList>

        <TabsContent value="questions" className="space-y-4">
          <QuestionEditor
            questions={currentQuiz.currentVersion.questions}
            maxQuestions={currentQuiz.maxQuestions}
            onUpdateQuestion={handleUpdateQuestion}
            editingQuestion={editingQuestion}
            setEditingQuestion={setEditingQuestion}
          />
        </TabsContent>

        <TabsContent value="weights" className="space-y-4">
          <BucketWeightEditor
            questions={currentQuiz.currentVersion.questions}
            onUpdateWeights={handleUpdateAnswerWeights}
          />
        </TabsContent>

        <TabsContent value="formulas" className="space-y-4">
          <ScoringFormulaEditor
            formula={currentQuiz.currentVersion.scoringFormula}
            onUpdateFormula={(formula) => {
              setCurrentQuiz({
                ...currentQuiz,
                currentVersion: {
                  ...currentQuiz.currentVersion,
                  scoringFormula: formula
                }
              })
            }}
          />
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <QuizPreview
            quiz={currentQuiz}
            scoringEngine={scoringEngine}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Question Editor Component
const QuestionEditor: React.FC<{
  questions: QuizQuestion[]
  maxQuestions: number
  onUpdateQuestion: (questionId: string, updates: Partial<QuizQuestion>) => void
  editingQuestion: string | null
  setEditingQuestion: (id: string | null) => void
}> = ({ questions, maxQuestions, onUpdateQuestion, editingQuestion, setEditingQuestion }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Questions ({questions.length}/{maxQuestions === 100 ? '∞' : maxQuestions})</CardTitle>
        <p className="text-gray-600 text-sm">
          Edit question text, answer choices, and phrasing variations
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {questions.map((question, index) => (
            <Card key={question.id} className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <Badge variant="outline">Q{question.order}</Badge>
                    <h4 className="font-medium mt-1">{question.text}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={question.isActive ? "default" : "secondary"}>
                      {question.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingQuestion(
                        editingQuestion === question.id ? null : question.id
                      )}
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">
                  <p><strong>Answer Format:</strong> {question.answerFormat}</p>
                  <p><strong>Answer Choices:</strong> {question.answerChoices.length}</p>
                  <p><strong>Phrasing Variants:</strong> {question.phrasings.length}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Quiz Preview Component
const QuizPreview: React.FC<{
  quiz: Quiz
  scoringEngine: QuizScoringEngine
}> = ({ quiz, scoringEngine }) => {
  const [previewResults, setPreviewResults] = React.useState<any>(null)
  
  const runPreview = () => {
    // Create sample answers
    const sampleAnswers = quiz.currentVersion.questions.slice(0, 3).map(q => ({
      questionId: q.id,
      answerId: q.answerChoices[0].id,
      bucketWeights: q.answerChoices[0].bucketWeights
    }))
    
    const results = scoringEngine.calculateScores(sampleAnswers, quiz.currentVersion.scoringFormula)
    setPreviewResults(results)
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quiz Preview & Testing</CardTitle>
        <p className="text-gray-600 text-sm">
          Test your quiz configuration with sample data
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={runPreview} className="w-full">
          <Play className="w-4 h-4 mr-2" />
          Run Sample Test
        </Button>
        
        {previewResults && (
          <div className="space-y-3">
            <h4 className="font-medium">Sample Results:</h4>
            {previewResults.map((result: any) => (
              <div key={result.bucketId} className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: result.color }}
                  />
                  <span>{result.bucketName}</span>
                  {result.isTopK && <Badge variant="default">Top</Badge>}
                </div>
                <div className="text-sm">
                  Score: {result.normalizedScore.toFixed(1)} (Rank #{result.rank})
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default QuizBuilderDashboard
