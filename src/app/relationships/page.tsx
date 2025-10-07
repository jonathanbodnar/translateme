'use client'

import React, { useState } from 'react'
import Navigation from '@/components/Navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { 
  Users, 
  Plus, 
  Heart, 
  Smile, 
  Zap,
  MessageSquare,
  Settings,
  User,
  Calendar,
  TrendingUp
} from 'lucide-react'

// Mock relationships data
const mockRelationships = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'Colleague',
    tags: ['work', 'project-partner', 'mentor'],
    sliders: {
      closeness: 75,
      affection: 60,
      humor: 85
    },
    ongoingContext: 'Working together on the Q4 marketing campaign. She prefers direct communication.',
    lastInteraction: '2024-01-20',
    insights: [
      'You tend to use more formal language when communicating with Sarah',
      'Your messages become more detailed when discussing project timelines'
    ]
  },
  {
    id: '2',
    name: 'Mom',
    role: 'Family',
    tags: ['family', 'supportive', 'caring'],
    sliders: {
      closeness: 95,
      affection: 100,
      humor: 70
    },
    ongoingContext: 'Always checks in about work and health. Prefers phone calls over texts.',
    lastInteraction: '2024-01-19',
    insights: [
      'You use more emotional language when communicating with family',
      'Your messages are typically longer and more personal'
    ]
  },
  {
    id: '3',
    name: 'Jake Rodriguez',
    role: 'Friend',
    tags: ['friend', 'gaming-buddy', 'funny'],
    sliders: {
      closeness: 80,
      affection: 65,
      humor: 95
    },
    ongoingContext: 'College roommate, now gaming buddy. Loves memes and casual banter.',
    lastInteraction: '2024-01-21',
    insights: [
      'You use significantly more humor and casual language with Jake',
      'Your communication style becomes more playful and spontaneous'
    ]
  }
]

export default function RelationshipsPage() {
  const [selectedRelationship, setSelectedRelationship] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newRelationship, setNewRelationship] = useState({
    name: '',
    role: '',
    tags: '',
    ongoingContext: '',
    closeness: [50],
    affection: [50],
    humor: [50]
  })

  const handleAddRelationship = () => {
    console.log('Adding relationship:', newRelationship)
    // In a real app, this would save to the database
    setShowAddForm(false)
    setNewRelationship({
      name: '',
      role: '',
      tags: '',
      ongoingContext: '',
      closeness: [50],
      affection: [50],
      humor: [50]
    })
  }

  const selectedRel = mockRelationships.find(r => r.id === selectedRelationship)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      <main className="lg:ml-72 p-4 lg:p-8">
        <div className="pt-16 lg:pt-0 max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Relationship Web</h1>
              <p className="text-gray-600">
                Manage your relationships and get personalized communication insights
              </p>
            </div>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Relationship
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            
            {/* Left Column - Relationships List */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Your Relationships ({mockRelationships.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockRelationships.map((relationship) => (
                    <div
                      key={relationship.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedRelationship === relationship.id
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-white hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedRelationship(relationship.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{relationship.name}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {relationship.role}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-2">
                        {relationship.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {relationship.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{relationship.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {relationship.sliders.closeness}%
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(relationship.lastInteraction).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Middle & Right Columns - Relationship Details */}
            <div className="lg:col-span-2">
              {!selectedRel && !showAddForm && (
                <Card className="h-96 flex items-center justify-center">
                  <CardContent className="text-center text-gray-500">
                    <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">Select a Relationship</h3>
                    <p>Choose a relationship from the list to view details and insights</p>
                  </CardContent>
                </Card>
              )}

              {showAddForm && (
                <Card>
                  <CardHeader>
                    <CardTitle>Add New Relationship</CardTitle>
                    <p className="text-gray-600">
                      Add someone to your relationship web to get personalized insights
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={newRelationship.name}
                          onChange={(e) => setNewRelationship(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter their name..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="role">Role/Relationship</Label>
                        <Input
                          id="role"
                          value={newRelationship.role}
                          onChange={(e) => setNewRelationship(prev => ({ ...prev, role: e.target.value }))}
                          placeholder="e.g., Friend, Colleague, Family..."
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input
                        id="tags"
                        value={newRelationship.tags}
                        onChange={(e) => setNewRelationship(prev => ({ ...prev, tags: e.target.value }))}
                        placeholder="e.g., work, funny, supportive..."
                      />
                    </div>

                    <div>
                      <Label htmlFor="context">Ongoing Context</Label>
                      <Textarea
                        id="context"
                        value={newRelationship.ongoingContext}
                        onChange={(e) => setNewRelationship(prev => ({ ...prev, ongoingContext: e.target.value }))}
                        placeholder="Notes about this relationship, communication preferences, current situations..."
                        className="min-h-20"
                      />
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Relationship Dynamics</h4>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label className="flex items-center gap-2">
                              <Heart className="w-4 h-4 text-red-500" />
                              Closeness
                            </Label>
                            <span className="text-sm text-gray-500">{newRelationship.closeness[0]}%</span>
                          </div>
                          <Slider
                            value={newRelationship.closeness}
                            onValueChange={(value) => setNewRelationship(prev => ({ ...prev, closeness: value }))}
                            max={100}
                            step={1}
                            className="w-full"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label className="flex items-center gap-2">
                              <Smile className="w-4 h-4 text-yellow-500" />
                              Affection
                            </Label>
                            <span className="text-sm text-gray-500">{newRelationship.affection[0]}%</span>
                          </div>
                          <Slider
                            value={newRelationship.affection}
                            onValueChange={(value) => setNewRelationship(prev => ({ ...prev, affection: value }))}
                            max={100}
                            step={1}
                            className="w-full"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label className="flex items-center gap-2">
                              <Zap className="w-4 h-4 text-purple-500" />
                              Humor
                            </Label>
                            <span className="text-sm text-gray-500">{newRelationship.humor[0]}%</span>
                          </div>
                          <Slider
                            value={newRelationship.humor}
                            onValueChange={(value) => setNewRelationship(prev => ({ ...prev, humor: value }))}
                            max={100}
                            step={1}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button onClick={handleAddRelationship} className="flex-1">
                        Add Relationship
                      </Button>
                      <Button variant="outline" onClick={() => setShowAddForm(false)} className="flex-1">
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {selectedRel && !showAddForm && (
                <div className="space-y-6">
                  {/* Relationship Overview */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <CardTitle>{selectedRel.name}</CardTitle>
                            <Badge variant="secondary">{selectedRel.role}</Badge>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Tags</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedRel.tags.map((tag) => (
                              <Badge key={tag} variant="outline">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Ongoing Context</h4>
                          <p className="text-gray-600 text-sm">{selectedRel.ongoingContext}</p>
                        </div>

                        <div>
                          <h4 className="font-medium mb-3">Relationship Dynamics</h4>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                              <Heart className="w-6 h-6 text-red-500 mx-auto mb-1" />
                              <div className="text-sm text-gray-600">Closeness</div>
                              <div className="font-semibold">{selectedRel.sliders.closeness}%</div>
                            </div>
                            <div className="text-center">
                              <Smile className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
                              <div className="text-sm text-gray-600">Affection</div>
                              <div className="font-semibold">{selectedRel.sliders.affection}%</div>
                            </div>
                            <div className="text-center">
                              <Zap className="w-6 h-6 text-purple-500 mx-auto mb-1" />
                              <div className="text-sm text-gray-600">Humor</div>
                              <div className="font-semibold">{selectedRel.sliders.humor}%</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Insights */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Communication Insights
                      </CardTitle>
                      <p className="text-gray-600">
                        AI-generated insights based on your communication patterns
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {selectedRel.insights.map((insight, index) => (
                        <div key={index} className="p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm">{insight}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="flex gap-3">
                      <Button variant="outline" className="flex-1">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Use WIMTS for {selectedRel.name}
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Calendar className="w-4 h-4 mr-2" />
                        View History
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
