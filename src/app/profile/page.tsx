'use client'

import React from 'react'
import Navigation from '@/components/Navigation'
import MetricsDisplay from '@/components/MetricsDisplay'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  TrendingUp, 
  Calendar, 
  Share2, 
  Settings,
  Brain,
  MessageSquare,
  Heart
} from 'lucide-react'

// Mock user data - in a real app, this would come from the database
const mockUserData = {
  name: 'Alex Johnson',
  email: 'alex@example.com',
  joinDate: '2024-01-15',
  totalQuizzes: 12,
  totalWimtsEntries: 45,
  currentMetrics: [
    { id: 'thinking', name: 'Thinking', value: 75, color: '#3B82F6', isTopK: true },
    { id: 'feeling', name: 'Feeling', value: 45, color: '#EF4444', isTopK: false },
    { id: 'sensing', name: 'Sensing', value: 60, color: '#10B981', isTopK: true },
    { id: 'intuition', name: 'Intuition', value: 40, color: '#8B5CF6', isTopK: false }
  ],
  recentInsights: [
    {
      id: 1,
      text: "Your communication style has become more balanced over the past month, showing growth in both analytical and empathetic responses.",
      date: '2024-01-20',
      source: 'AI Analysis'
    },
    {
      id: 2,
      text: "You tend to use more direct communication in professional contexts compared to personal relationships.",
      date: '2024-01-18',
      source: 'WIMTS Pattern Analysis'
    }
  ]
}

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      <main className="lg:ml-72 p-4 lg:p-8">
        <div className="pt-16 lg:pt-0 max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
              <p className="text-gray-600">
                Track your personality journey and communication growth
              </p>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <Button variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Share Profile
              </Button>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            
            {/* Left Column - User Info & Stats */}
            <div className="space-y-6">
              
              {/* User Info Card */}
              <Card>
                <CardHeader className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle>{mockUserData.name}</CardTitle>
                  <p className="text-gray-600">{mockUserData.email}</p>
                  <Badge variant="secondary">
                    Member since {new Date(mockUserData.joinDate).toLocaleDateString()}
                  </Badge>
                </CardHeader>
              </Card>

              {/* Stats Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Activity Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">Quizzes Taken</span>
                    </div>
                    <span className="font-semibold">{mockUserData.totalQuizzes}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-green-500" />
                      <span className="text-sm">WIMTS Entries</span>
                    </div>
                    <span className="font-semibold">{mockUserData.totalWimtsEntries}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span className="text-sm">Relationships</span>
                    </div>
                    <span className="font-semibold">8</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Middle Column - Current Metrics */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Current Personality Profile */}
              <MetricsDisplay
                metrics={mockUserData.currentMetrics}
                title="Current Personality Profile"
                showValues={true}
                animated={true}
              />

              {/* Recent Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Recent Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockUserData.recentInsights.map((insight) => (
                    <div key={insight.id} className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm mb-2">{insight.text}</p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>{insight.source}</span>
                        <span>{new Date(insight.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Placeholder for Charts */}
              <Card>
                <CardHeader>
                  <CardTitle>Personality Trends</CardTitle>
                  <p className="text-gray-600">Track how your personality metrics change over time</p>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Interactive charts would be displayed here</p>
                      <p className="text-sm mt-1">Showing personality metric trends over time</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Daily Share Card Preview */}
              <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="w-5 h-5" />
                    Today's Shareable Card
                  </CardTitle>
                  <p className="text-gray-600">AI-generated content for your social media</p>
                </CardHeader>
                <CardContent>
                  <div className="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="text-center text-gray-500">
                      <p>"Today I'm feeling more analytical and detail-oriented."</p>
                      <p className="text-sm mt-2">- Generated based on your recent quiz responses</p>
                    </div>
                  </div>
                  <Button className="w-full mt-4">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share to Social Media
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
