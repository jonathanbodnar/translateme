'use client'

import React from 'react'
import Navigation from '@/components/Navigation'
import WimtsInterface from '@/components/WimtsInterface'
import { ScoringEngine } from '@/lib/scoring'

// Mock user metrics - in a real app, this would come from the user's profile
const mockUserMetrics = [
  {
    id: 'thinking',
    name: 'Thinking',
    value: 75,
    color: '#3B82F6',
    isTopK: true
  },
  {
    id: 'feeling',
    name: 'Feeling',
    value: 45,
    color: '#EF4444',
    isTopK: false
  },
  {
    id: 'sensing',
    name: 'Sensing',
    value: 60,
    color: '#10B981',
    isTopK: true
  },
  {
    id: 'intuition',
    name: 'Intuition',
    value: 40,
    color: '#8B5CF6',
    isTopK: false
  }
]

export default function WimtsPage() {
  const handleSaveWimts = (data: {
    rawInput: string
    situationContext?: string
    finalText: string
    otherPersonTranslate?: string
  }) => {
    console.log('Saving WIMTS entry:', data)
    
    // In a real app, this would save to the database
    // and potentially update user metrics based on the communication patterns
    
    // Show success message or redirect
    alert('Message saved successfully!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      <main className="lg:ml-72 p-4 lg:p-8">
        <div className="pt-16 lg:pt-0">
          <WimtsInterface
            userMetrics={mockUserMetrics}
            onSave={handleSaveWimts}
          />
        </div>
      </main>
    </div>
  )
}
