import { 
  BucketWeights, 
  BucketType, 
  ScoringFormula, 
  QuizSession,
  validateBucketWeights,
  DEFAULT_BUCKET_CONFIGS 
} from './quiz-types'

export interface ScoringResult {
  bucketId: BucketType
  bucketName: string
  rawScore: number
  normalizedScore: number
  isTopK: boolean
  rank: number
  color: string
}

export class QuizScoringEngine {
  private bucketConfigs = DEFAULT_BUCKET_CONFIGS

  /**
   * Calculate final scores from quiz session answers
   */
  calculateScores(
    answers: Array<{
      questionId: string
      answerId: string
      bucketWeights: BucketWeights
      groupWeight?: number // For deep dive group weighting
    }>,
    formula: ScoringFormula
  ): ScoringResult[] {
    // Step 1: Aggregate raw scores
    const rawTotals = this.aggregateRawScores(answers, formula)
    
    // Step 2: Apply normalization if enabled
    const normalizedScores = formula.normalization.enabled 
      ? this.normalizeScores(rawTotals, formula.normalization.scale)
      : rawTotals

    // Step 3: Rank and determine top-K
    const rankedResults = this.rankAndHighlight(normalizedScores, formula.topKHighlight)

    // Step 4: Apply tie-breaking rules
    const finalResults = this.applyTieBreaking(rankedResults, formula.tieBreaking.priority)

    return finalResults
  }

  private aggregateRawScores(
    answers: Array<{
      questionId: string
      answerId: string  
      bucketWeights: BucketWeights
      groupWeight?: number
    }>,
    formula: ScoringFormula
  ): BucketWeights {
    const totals: BucketWeights = {
      feeling: 0,
      sensing: 0, 
      intuition: 0,
      thinking: 0
    }

    for (const answer of answers) {
      const weight = answer.groupWeight || 1
      
      switch (formula.aggregation) {
        case 'sum':
          totals.feeling += answer.bucketWeights.feeling * weight
          totals.sensing += answer.bucketWeights.sensing * weight
          totals.intuition += answer.bucketWeights.intuition * weight
          totals.thinking += answer.bucketWeights.thinking * weight
          break
          
        case 'weighted':
          // Weighted by group importance
          totals.feeling += answer.bucketWeights.feeling * weight
          totals.sensing += answer.bucketWeights.sensing * weight
          totals.intuition += answer.bucketWeights.intuition * weight
          totals.thinking += answer.bucketWeights.thinking * weight
          break
          
        case 'average':
          // Will be divided by answer count later
          totals.feeling += answer.bucketWeights.feeling
          totals.sensing += answer.bucketWeights.sensing
          totals.intuition += answer.bucketWeights.intuition
          totals.thinking += answer.bucketWeights.thinking
          break
      }
    }

    // Apply average if needed
    if (formula.aggregation === 'average' && answers.length > 0) {
      const count = answers.length
      totals.feeling /= count
      totals.sensing /= count
      totals.intuition /= count
      totals.thinking /= count
    }

    return totals
  }

  private normalizeScores(
    rawScores: BucketWeights,
    scale: [number, number]
  ): BucketWeights {
    const [min, max] = scale
    const values = Object.values(rawScores)
    const rawMin = Math.min(...values)
    const rawMax = Math.max(...values)
    const range = rawMax - rawMin

    if (range === 0) {
      // All scores equal, distribute evenly
      const midpoint = (min + max) / 2
      return {
        feeling: midpoint,
        sensing: midpoint,
        intuition: midpoint,
        thinking: midpoint
      }
    }

    return {
      feeling: min + ((rawScores.feeling - rawMin) / range) * (max - min),
      sensing: min + ((rawScores.sensing - rawMin) / range) * (max - min),
      intuition: min + ((rawScores.intuition - rawMin) / range) * (max - min),
      thinking: min + ((rawScores.thinking - rawMin) / range) * (max - min),
    }
  }

  private rankAndHighlight(
    scores: BucketWeights,
    topKConfig: ScoringFormula['topKHighlight']
  ): ScoringResult[] {
    const results: ScoringResult[] = Object.entries(scores).map(([bucketId, score]) => {
      const config = this.bucketConfigs.find(c => c.id === bucketId)!
      return {
        bucketId: bucketId as BucketType,
        bucketName: config.name,
        rawScore: score,
        normalizedScore: score,
        isTopK: false,
        rank: 0,
        color: config.color
      }
    })

    // Sort by score (descending)
    results.sort((a, b) => b.normalizedScore - a.normalizedScore)
    
    // Assign ranks
    results.forEach((result, index) => {
      result.rank = index + 1
    })

    // Determine top-K
    switch (topKConfig.method) {
      case 'fixed_top_2':
        results.slice(0, 2).forEach(r => r.isTopK = true)
        break
      case 'fixed_top_3':
        results.slice(0, 3).forEach(r => r.isTopK = true)
        break
      case 'threshold':
        if (topKConfig.threshold !== undefined) {
          results.forEach(r => {
            if (r.normalizedScore >= topKConfig.threshold!) {
              r.isTopK = true
            }
          })
        }
        break
    }

    return results
  }

  private applyTieBreaking(
    results: ScoringResult[],
    priority: BucketType[]
  ): ScoringResult[] {
    // Group by score to find ties
    const scoreGroups = new Map<number, ScoringResult[]>()
    
    results.forEach(result => {
      const score = Math.round(result.normalizedScore * 1000) / 1000 // Handle floating point
      if (!scoreGroups.has(score)) {
        scoreGroups.set(score, [])
      }
      scoreGroups.get(score)!.push(result)
    })

    // Apply tie-breaking within each score group
    const finalResults: ScoringResult[] = []
    
    Array.from(scoreGroups.entries())
      .sort(([a], [b]) => b - a) // Sort by score descending
      .forEach(([score, tiedResults]) => {
        if (tiedResults.length === 1) {
          finalResults.push(...tiedResults)
        } else {
          // Apply priority-based tie breaking
          const sorted = tiedResults.sort((a, b) => {
            const aPriority = priority.indexOf(a.bucketId)
            const bPriority = priority.indexOf(b.bucketId)
            
            // Lower index = higher priority
            if (aPriority === -1) return 1
            if (bPriority === -1) return -1
            return aPriority - bPriority
          })
          
          finalResults.push(...sorted)
        }
      })

    // Reassign ranks after tie-breaking
    finalResults.forEach((result, index) => {
      result.rank = index + 1
    })

    return finalResults
  }

  /**
   * Preview scoring for admin testing
   */
  previewScoring(
    testAnswers: BucketWeights[],
    formula: ScoringFormula
  ): ScoringResult[] {
    const mockAnswers = testAnswers.map((weights, index) => ({
      questionId: `test-q${index}`,
      answerId: `test-a${index}`,
      bucketWeights: weights
    }))

    return this.calculateScores(mockAnswers, formula)
  }

  /**
   * Validate scoring formula configuration
   */
  validateFormula(formula: ScoringFormula): string[] {
    const errors: string[] = []

    if (formula.normalization.enabled) {
      const [min, max] = formula.normalization.scale
      if (min >= max) {
        errors.push('Normalization scale minimum must be less than maximum')
      }
    }

    if (formula.topKHighlight.method === 'threshold' && formula.topKHighlight.threshold === undefined) {
      errors.push('Threshold method requires a threshold value')
    }

    if (formula.tieBreaking.priority.length !== 4) {
      errors.push('Tie-breaking priority must include all 4 buckets')
    }

    const uniqueBuckets = new Set(formula.tieBreaking.priority)
    if (uniqueBuckets.size !== 4) {
      errors.push('Tie-breaking priority must not have duplicate buckets')
    }

    return errors
  }

  /**
   * Get default scoring formula
   */
  static getDefaultFormula(): ScoringFormula {
    return {
      id: 'default',
      aggregation: 'sum',
      normalization: {
        enabled: true,
        scale: [0, 100]
      },
      topKHighlight: {
        method: 'fixed_top_2'
      },
      blurNonTop: true,
      tieBreaking: {
        priority: ['feeling', 'intuition', 'thinking', 'sensing']
      }
    }
  }
}
