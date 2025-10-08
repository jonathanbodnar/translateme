'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { 
  ScoringFormula, 
  BucketType,
  DEFAULT_BUCKET_CONFIGS
} from '@/lib/quiz-types'
import { QuizScoringEngine } from '@/lib/quiz-scoring'
import { 
  Settings, 
  AlertTriangle, 
  CheckCircle,
  RotateCcw,
  BarChart3
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ScoringFormulaEditorProps {
  formula: ScoringFormula
  onUpdateFormula: (formula: ScoringFormula) => void
  className?: string
}

const ScoringFormulaEditor: React.FC<ScoringFormulaEditorProps> = ({
  formula,
  onUpdateFormula,
  className
}) => {
  const scoringEngine = new QuizScoringEngine()
  const validationErrors = scoringEngine.validateFormula(formula)

  const handleAggregationChange = (aggregation: 'sum' | 'average' | 'weighted') => {
    onUpdateFormula({
      ...formula,
      aggregation
    })
  }

  const handleNormalizationToggle = (enabled: boolean) => {
    onUpdateFormula({
      ...formula,
      normalization: {
        ...formula.normalization,
        enabled
      }
    })
  }

  const handleNormalizationScaleChange = (index: 0 | 1, value: string) => {
    const newScale: [number, number] = [...formula.normalization.scale] as [number, number]
    newScale[index] = parseFloat(value) || 0
    
    onUpdateFormula({
      ...formula,
      normalization: {
        ...formula.normalization,
        scale: newScale
      }
    })
  }

  const handleTopKMethodChange = (method: 'fixed_top_2' | 'fixed_top_3' | 'threshold') => {
    onUpdateFormula({
      ...formula,
      topKHighlight: {
        method,
        threshold: method === 'threshold' ? 70 : undefined
      }
    })
  }

  const handleThresholdChange = (threshold: number[]) => {
    onUpdateFormula({
      ...formula,
      topKHighlight: {
        ...formula.topKHighlight,
        threshold: threshold[0]
      }
    })
  }

  const handleBlurToggle = (blurNonTop: boolean) => {
    onUpdateFormula({
      ...formula,
      blurNonTop
    })
  }

  const handleTieBreakingChange = (newPriority: BucketType[]) => {
    onUpdateFormula({
      ...formula,
      tieBreaking: {
        priority: newPriority
      }
    })
  }

  const moveBucketPriority = (bucketId: BucketType, direction: 'up' | 'down') => {
    const currentPriority = [...formula.tieBreaking.priority]
    const currentIndex = currentPriority.indexOf(bucketId)
    
    if (direction === 'up' && currentIndex > 0) {
      [currentPriority[currentIndex], currentPriority[currentIndex - 1]] = 
      [currentPriority[currentIndex - 1], currentPriority[currentIndex]]
    } else if (direction === 'down' && currentIndex < currentPriority.length - 1) {
      [currentPriority[currentIndex], currentPriority[currentIndex + 1]] = 
      [currentPriority[currentIndex + 1], currentPriority[currentIndex]]
    }
    
    handleTieBreakingChange(currentPriority)
  }

  const resetToDefault = () => {
    onUpdateFormula(QuizScoringEngine.getDefaultFormula())
  }

  const testFormula = () => {
    // Create sample test data
    const sampleWeights = [
      { feeling: 7, sensing: 1, intuition: 2, thinking: 0 },
      { feeling: 2, sensing: 6, intuition: 1, thinking: 1 },
      { feeling: 3, sensing: 2, intuition: 4, thinking: 1 }
    ]
    
    const results = scoringEngine.previewScoring(sampleWeights, formula)
    console.log('Formula test results:', results)
    alert('Formula tested! Check console for results.')
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Validation Status */}
      {validationErrors.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="w-5 h-5" />
              Formula Validation Errors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-sm text-red-600">
                  • {error}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {validationErrors.length === 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Formula is valid and ready to use</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Aggregation Method */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Score Aggregation
          </CardTitle>
          <p className="text-gray-600 text-sm">
            How should answer weights be combined across questions?
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Aggregation Method</Label>
            <Select value={formula.aggregation} onValueChange={handleAggregationChange}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sum">Sum - Add all weights together</SelectItem>
                <SelectItem value="average">Average - Calculate mean weight</SelectItem>
                <SelectItem value="weighted">Weighted - Apply group weights (Deep Dive)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded">
            <strong>Current method:</strong> {formula.aggregation}
            <br />
            {formula.aggregation === 'sum' && 'All answer weights are added together for final scores.'}
            {formula.aggregation === 'average' && 'Answer weights are averaged across all questions.'}
            {formula.aggregation === 'weighted' && 'Answer weights are multiplied by their question group importance.'}
          </div>
        </CardContent>
      </Card>

      {/* Normalization */}
      <Card>
        <CardHeader>
          <CardTitle>Score Normalization</CardTitle>
          <p className="text-gray-600 text-sm">
            Convert raw scores to a standard scale for consistent comparison
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Enable Normalization</Label>
            <Switch
              checked={formula.normalization.enabled}
              onCheckedChange={handleNormalizationToggle}
            />
          </div>
          
          {formula.normalization.enabled && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Minimum Score</Label>
                <Input
                  type="number"
                  value={formula.normalization.scale[0]}
                  onChange={(e) => handleNormalizationScaleChange(0, e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Maximum Score</Label>
                <Input
                  type="number"
                  value={formula.normalization.scale[1]}
                  onChange={(e) => handleNormalizationScaleChange(1, e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          )}
          
          <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded">
            {formula.normalization.enabled 
              ? `Scores will be scaled to range ${formula.normalization.scale[0]}-${formula.normalization.scale[1]}`
              : 'Raw scores will be used without normalization'
            }
          </div>
        </CardContent>
      </Card>

      {/* Top-K Highlighting */}
      <Card>
        <CardHeader>
          <CardTitle>Top Trait Highlighting</CardTitle>
          <p className="text-gray-600 text-sm">
            Which personality buckets should be highlighted as dominant traits?
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Highlighting Method</Label>
            <Select 
              value={formula.topKHighlight.method} 
              onValueChange={handleTopKMethodChange}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed_top_2">Always Top 2 Traits</SelectItem>
                <SelectItem value="fixed_top_3">Always Top 3 Traits</SelectItem>
                <SelectItem value="threshold">Score Threshold Based</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {formula.topKHighlight.method === 'threshold' && (
            <div>
              <Label>Score Threshold: {formula.topKHighlight.threshold}</Label>
              <Slider
                value={[formula.topKHighlight.threshold || 70]}
                onValueChange={handleThresholdChange}
                min={0}
                max={100}
                step={5}
                className="mt-2"
              />
              <div className="text-xs text-gray-500 mt-1">
                Only buckets scoring above {formula.topKHighlight.threshold} will be highlighted
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <Label>Blur Non-Highlighted Traits</Label>
            <Switch
              checked={formula.blurNonTop}
              onCheckedChange={handleBlurToggle}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tie Breaking */}
      <Card>
        <CardHeader>
          <CardTitle>Tie Breaking Priority</CardTitle>
          <p className="text-gray-600 text-sm">
            When scores are equal, which traits should be prioritized?
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Priority Order (Highest to Lowest)</Label>
            <div className="space-y-2">
              {formula.tieBreaking.priority.map((bucketId, index) => {
                const bucket = DEFAULT_BUCKET_CONFIGS.find(b => b.id === bucketId)!
                return (
                  <div key={bucketId} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">#{index + 1}</Badge>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: bucket.color }}
                        />
                        <span className="font-medium">{bucket.name}</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveBucketPriority(bucketId, 'up')}
                        disabled={index === 0}
                      >
                        ↑
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveBucketPriority(bucketId, 'down')}
                        disabled={index === formula.tieBreaking.priority.length - 1}
                      >
                        ↓
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Formula Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Button onClick={testFormula} variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" />
            Test Formula
          </Button>
          <Button onClick={resetToDefault} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Default
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default ScoringFormulaEditor
