'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { generateQuizQuestions } from '@/lib/ai'
import { ScoringEngine } from '@/lib/scoring'
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  Sparkles, 
  GripVertical,
  Eye,
  EyeOff,
  Play
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Question {
  id: string
  text: string
  aiGenerated: boolean
  order: number
  active: boolean
  answerOptions: Array<{
    id: string
    label: string
    swipeMapping: string
    contributionMap: Record<string, number>
  }>
}

interface Quiz {
  id: string
  title: string
  status: 'draft' | 'active' | 'archived'
  choiceMode: '2-choice' | '3-choice'
  alignmentPhraseRules?: Record<string, string>
  questions: Question[]
}

interface AdminDashboardProps {
  onSaveQuiz: (quiz: Quiz) => void
  onTestQuiz: (quiz: Quiz) => void
  className?: string
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onSaveQuiz,
  onTestQuiz,
  className
}) => {
  const [currentQuiz, setCurrentQuiz] = useState<Quiz>({
    id: '',
    title: '',
    status: 'draft',
    choiceMode: '2-choice',
    questions: []
  })
  
  const [aiContext, setAiContext] = useState({
    situationContext: '',
    goal: '',
    tonePreference: '',
    otherPersonRole: ''
  })
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null)

  const buckets = ScoringEngine.getDefaultBuckets()

  const handleGenerateQuestions = async () => {
    setIsGenerating(true)
    try {
      const existingQuestions = currentQuiz.questions.map(q => q.text)
      const newQuestions = await generateQuizQuestions(
        {
          ...aiContext,
          existingQuestions
        },
        5
      )

      const generatedQuestions: Question[] = newQuestions.map((text, index) => ({
        id: `generated-${Date.now()}-${index}`,
        text,
        aiGenerated: true,
        order: currentQuiz.questions.length + index,
        active: true,
        answerOptions: [
          {
            id: `opt-left-${index}`,
            label: 'Disagree',
            swipeMapping: 'left',
            contributionMap: ScoringEngine.createContributionMap('left', 'general')
          },
          {
            id: `opt-right-${index}`,
            label: 'Agree',
            swipeMapping: 'right',
            contributionMap: ScoringEngine.createContributionMap('right', 'general')
          },
          ...(currentQuiz.choiceMode === '3-choice' ? [{
            id: `opt-up-${index}`,
            label: 'Neutral',
            swipeMapping: 'up',
            contributionMap: ScoringEngine.createContributionMap('up', 'general')
          }] : [])
        ]
      }))

      setCurrentQuiz(prev => ({
        ...prev,
        questions: [...prev.questions, ...generatedQuestions]
      }))
    } catch (error) {
      console.error('Error generating questions:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAddManualQuestion = () => {
    const newQuestion: Question = {
      id: `manual-${Date.now()}`,
      text: '',
      aiGenerated: false,
      order: currentQuiz.questions.length,
      active: true,
      answerOptions: [
        {
          id: `opt-left-${Date.now()}`,
          label: 'Disagree',
          swipeMapping: 'left',
          contributionMap: ScoringEngine.createContributionMap('left', 'general')
        },
        {
          id: `opt-right-${Date.now()}`,
          label: 'Agree',
          swipeMapping: 'right',
          contributionMap: ScoringEngine.createContributionMap('right', 'general')
        },
        ...(currentQuiz.choiceMode === '3-choice' ? [{
          id: `opt-up-${Date.now()}`,
          label: 'Neutral',
          swipeMapping: 'up',
          contributionMap: ScoringEngine.createContributionMap('up', 'general')
        }] : [])
      ]
    }

    setCurrentQuiz(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }))
    setEditingQuestion(newQuestion.id)
  }

  const handleUpdateQuestion = (questionId: string, updates: Partial<Question>) => {
    setCurrentQuiz(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId ? { ...q, ...updates } : q
      )
    }))
  }

  const handleDeleteQuestion = (questionId: string) => {
    setCurrentQuiz(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }))
  }

  const handleReorderQuestions = (draggedId: string, targetId: string) => {
    const questions = [...currentQuiz.questions]
    const draggedIndex = questions.findIndex(q => q.id === draggedId)
    const targetIndex = questions.findIndex(q => q.id === targetId)
    
    const [draggedQuestion] = questions.splice(draggedIndex, 1)
    questions.splice(targetIndex, 0, draggedQuestion)
    
    // Update order numbers
    const reorderedQuestions = questions.map((q, index) => ({
      ...q,
      order: index
    }))

    setCurrentQuiz(prev => ({
      ...prev,
      questions: reorderedQuestions
    }))
  }

  const handleSaveQuiz = () => {
    if (!currentQuiz.title.trim()) {
      alert('Please enter a quiz title')
      return
    }
    
    if (currentQuiz.questions.length === 0) {
      alert('Please add at least one question')
      return
    }

    onSaveQuiz(currentQuiz)
  }

  return (
    <div className={cn("max-w-6xl mx-auto space-y-6", className)}>
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Quiz Builder</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => onTestQuiz(currentQuiz)}
                disabled={currentQuiz.questions.length === 0}
              >
                <Play className="w-4 h-4 mr-2" />
                Test Quiz
              </Button>
              <Button onClick={handleSaveQuiz}>
                <Save className="w-4 h-4 mr-2" />
                Save Quiz
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quiz-title">Quiz Title</Label>
              <Input
                id="quiz-title"
                value={currentQuiz.title}
                onChange={(e) => setCurrentQuiz(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter quiz title..."
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="choice-mode">Choice Mode</Label>
              <Select 
                value={currentQuiz.choiceMode} 
                onValueChange={(value: '2-choice' | '3-choice') => 
                  setCurrentQuiz(prev => ({ ...prev, choiceMode: value }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2-choice">2-Choice (Left/Right)</SelectItem>
                  <SelectItem value="3-choice">3-Choice (Left/Right/Up)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Question Generation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            AI Question Generation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="situation">Situation Context</Label>
              <Input
                id="situation"
                value={aiContext.situationContext}
                onChange={(e) => setAiContext(prev => ({ ...prev, situationContext: e.target.value }))}
                placeholder="e.g., Workplace assessment"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="goal">Goal</Label>
              <Input
                id="goal"
                value={aiContext.goal}
                onChange={(e) => setAiContext(prev => ({ ...prev, goal: e.target.value }))}
                placeholder="e.g., Understanding communication style"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="tone">Tone Preference</Label>
              <Input
                id="tone"
                value={aiContext.tonePreference}
                onChange={(e) => setAiContext(prev => ({ ...prev, tonePreference: e.target.value }))}
                placeholder="e.g., Professional, casual, engaging"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="role">Other Person Role</Label>
              <Input
                id="role"
                value={aiContext.otherPersonRole}
                onChange={(e) => setAiContext(prev => ({ ...prev, otherPersonRole: e.target.value }))}
                placeholder="e.g., Colleague, friend, manager"
                className="mt-1"
              />
            </div>
          </div>
          
          <Button 
            onClick={handleGenerateQuestions}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                Generating Questions...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate 5 Questions
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Questions List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Questions ({currentQuiz.questions.length})</span>
            <Button variant="outline" onClick={handleAddManualQuestion}>
              <Plus className="w-4 h-4 mr-2" />
              Add Manual Question
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentQuiz.questions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No questions yet. Generate some with AI or add manually.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {currentQuiz.questions
                .sort((a, b) => a.order - b.order)
                .map((question, index) => (
                  <motion.div
                    key={question.id}
                    layout
                    className="group"
                  >
                    <Card className={cn(
                      "transition-all duration-200",
                      editingQuestion === question.id && "ring-2 ring-blue-500",
                      !question.active && "opacity-60"
                    )}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex items-center gap-2 mt-1">
                            <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                            <span className="text-sm font-medium text-gray-500 min-w-[2rem]">
                              {index + 1}.
                            </span>
                          </div>
                          
                          <div className="flex-1">
                            {editingQuestion === question.id ? (
                              <div className="space-y-3">
                                <Textarea
                                  value={question.text}
                                  onChange={(e) => handleUpdateQuestion(question.id, { text: e.target.value })}
                                  placeholder="Enter question text..."
                                  className="min-h-[60px]"
                                />
                                <div className="flex gap-2">
                                  <Button 
                                    size="sm"
                                    onClick={() => setEditingQuestion(null)}
                                  >
                                    Save
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => setEditingQuestion(null)}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <p className="text-sm">{question.text}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  {question.aiGenerated && (
                                    <Badge variant="secondary" className="text-xs">
                                      <Sparkles className="w-3 h-3 mr-1" />
                                      AI Generated
                                    </Badge>
                                  )}
                                  <Badge variant="outline" className="text-xs">
                                    {currentQuiz.choiceMode}
                                  </Badge>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleUpdateQuestion(question.id, { active: !question.active })}
                            >
                              {question.active ? (
                                <Eye className="w-4 h-4" />
                              ) : (
                                <EyeOff className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingQuestion(question.id)}
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteQuestion(question.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminDashboard
