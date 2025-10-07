'use client'

import React, { useState } from 'react'
import Navigation from '@/components/Navigation'
import AdminDashboard from '@/components/AdminDashboard'
import QuizInterface from '@/components/QuizInterface'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'

interface Quiz {
  id: string
  title: string
  status: 'draft' | 'active' | 'archived'
  choiceMode: '2-choice' | '3-choice'
  alignmentPhraseRules?: Record<string, string>
  questions: Array<{
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
  }>
}

export default function AdminPage() {
  const [view, setView] = useState<'dashboard' | 'test'>('dashboard')
  const [testQuiz, setTestQuiz] = useState<Quiz | null>(null)

  const handleSaveQuiz = (quiz: Quiz) => {
    console.log('Saving quiz:', quiz)
    
    // In a real app, this would save to the database
    // For now, just show a success message
    alert('Quiz saved successfully!')
  }

  const handleTestQuiz = (quiz: Quiz) => {
    if (quiz.questions.length === 0) {
      alert('Cannot test quiz with no questions')
      return
    }

    // Convert admin quiz format to quiz interface format
    const testQuizData = {
      id: quiz.id,
      title: quiz.title,
      alignmentPhraseRules: quiz.alignmentPhraseRules,
      choiceMode: quiz.choiceMode
    }

    const testQuestions = quiz.questions
      .filter(q => q.active)
      .sort((a, b) => a.order - b.order)
      .map(q => ({
        id: q.id,
        text: q.text,
        meta: { aiGenerated: q.aiGenerated },
        answerOptions: q.answerOptions
      }))

    setTestQuiz(testQuizData as any)
    setView('test')
  }

  const handleTestComplete = (results: any) => {
    console.log('Test quiz results:', results)
    alert('Test completed! Check console for results.')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      <main className="lg:ml-72 p-4 lg:p-8">
        <div className="pt-16 lg:pt-0">
          {view === 'dashboard' && (
            <>
              <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-gray-600">
                  Create and manage personality assessment quizzes with AI-powered question generation
                </p>
              </div>
              
              <AdminDashboard
                onSaveQuiz={handleSaveQuiz}
                onTestQuiz={handleTestQuiz}
              />
            </>
          )}

          {view === 'test' && testQuiz && (
            <div>
              <Button
                variant="ghost"
                onClick={() => setView('dashboard')}
                className="mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Testing Quiz: {testQuiz.title}</CardTitle>
                  <p className="text-gray-600">
                    This is a preview of how users will experience your quiz
                  </p>
                </CardHeader>
              </Card>
              
              <QuizInterface
                quiz={testQuiz}
                questions={testQuiz.questions as any}
                onComplete={handleTestComplete}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
