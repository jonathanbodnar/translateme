'use client'

import React from 'react'
import Navigation from '@/components/Navigation'
import QuizBuilderDashboard from '@/components/QuizBuilderDashboard'
import { Quiz } from '@/lib/quiz-types'

export default function AdminPage() {
  const handleSaveQuiz = (quiz: Quiz) => {
    console.log('Saving quiz:', quiz)
    
    // In a real app, this would save to the database
    // For now, just show a success message
    alert(`${quiz.name} saved successfully!`)
  }

  const handlePublishQuiz = (quizId: string) => {
    console.log('Publishing quiz:', quizId)
    
    // In a real app, this would publish the quiz
    alert('Quiz published successfully!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      <main className="lg:ml-72 p-4 lg:p-8">
        <div className="pt-16 lg:pt-0">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Quiz Builder Dashboard</h1>
            <p className="text-gray-600">
              Design and configure the Quick Onboarding and Deep Dive assessment quizzes
            </p>
          </div>
          
          <QuizBuilderDashboard
            onSaveQuiz={handleSaveQuiz}
            onPublishQuiz={handlePublishQuiz}
          />
        </div>
      </main>
    </div>
  )
}
