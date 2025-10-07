export interface AnswerContribution {
  bucketId: string
  value: number
}

export interface ScoringResult {
  bucketId: string
  bucketName: string
  score: number
  isTopK: boolean
}

export interface ScoringFormula {
  id: string
  expr: string
  normalization?: {
    min?: number
    max?: number
    type?: 'linear' | 'percentile'
  }
  topKHighlight: number
  blurNonTopK: boolean
}

export class ScoringEngine {
  private buckets: Map<string, { id: string; name: string; color?: string }>

  constructor(buckets: Array<{ id: string; name: string; color?: string }>) {
    this.buckets = new Map(buckets.map(b => [b.id, b]))
  }

  /**
   * Calculate scores from quiz answers
   */
  calculateScores(
    answers: Array<{
      questionId: string
      optionId: string
      contributionMap: Record<string, number>
    }>,
    formula?: ScoringFormula
  ): ScoringResult[] {
    // Accumulate contributions by bucket
    const bucketTotals = new Map<string, number>()
    
    for (const answer of answers) {
      for (const [bucketId, contribution] of Object.entries(answer.contributionMap)) {
        const current = bucketTotals.get(bucketId) || 0
        bucketTotals.set(bucketId, current + contribution)
      }
    }

    // Apply formula if provided
    let scores = Array.from(bucketTotals.entries()).map(([bucketId, total]) => {
      const bucket = this.buckets.get(bucketId)
      return {
        bucketId,
        bucketName: bucket?.name || bucketId,
        score: total,
        isTopK: false
      }
    })

    // Apply normalization
    if (formula?.normalization) {
      scores = this.normalizeScores(scores, formula.normalization)
    }

    // Sort by score and mark top K
    scores.sort((a, b) => b.score - a.score)
    const topK = formula?.topKHighlight || 2
    
    for (let i = 0; i < Math.min(topK, scores.length); i++) {
      scores[i].isTopK = true
    }

    return scores
  }

  /**
   * Normalize scores based on the normalization settings
   */
  private normalizeScores(
    scores: ScoringResult[],
    normalization: NonNullable<ScoringFormula['normalization']>
  ): ScoringResult[] {
    if (normalization.type === 'percentile') {
      return this.normalizeToPercentile(scores)
    }

    // Linear normalization
    const values = scores.map(s => s.score)
    const min = normalization.min ?? Math.min(...values)
    const max = normalization.max ?? Math.max(...values)
    const range = max - min

    if (range === 0) return scores

    return scores.map(score => ({
      ...score,
      score: ((score.score - min) / range) * 100
    }))
  }

  /**
   * Convert scores to percentile rankings
   */
  private normalizeToPercentile(scores: ScoringResult[]): ScoringResult[] {
    const sorted = [...scores].sort((a, b) => a.score - b.score)
    
    return scores.map(score => {
      const rank = sorted.findIndex(s => s.bucketId === score.bucketId)
      const percentile = (rank / (sorted.length - 1)) * 100
      
      return {
        ...score,
        score: percentile
      }
    })
  }

  /**
   * Get default personality buckets
   */
  static getDefaultBuckets() {
    return [
      { id: 'thinking', name: 'Thinking', color: '#3B82F6' },
      { id: 'feeling', name: 'Feeling', color: '#EF4444' },
      { id: 'sensing', name: 'Sensing', color: '#10B981' },
      { id: 'intuition', name: 'Intuition', color: '#8B5CF6' }
    ]
  }

  /**
   * Create contribution map for answer options
   */
  static createContributionMap(
    swipeMapping: string,
    questionType: 'thinking-feeling' | 'sensing-intuition' | 'general'
  ): Record<string, number> {
    const contributions: Record<string, number> = {}

    switch (questionType) {
      case 'thinking-feeling':
        if (swipeMapping === 'left') {
          contributions.thinking = 2
          contributions.feeling = -1
        } else if (swipeMapping === 'right') {
          contributions.feeling = 2
          contributions.thinking = -1
        } else if (swipeMapping === 'up') {
          contributions.thinking = 0.5
          contributions.feeling = 0.5
        }
        break

      case 'sensing-intuition':
        if (swipeMapping === 'left') {
          contributions.sensing = 2
          contributions.intuition = -1
        } else if (swipeMapping === 'right') {
          contributions.intuition = 2
          contributions.sensing = -1
        } else if (swipeMapping === 'up') {
          contributions.sensing = 0.5
          contributions.intuition = 0.5
        }
        break

      case 'general':
      default:
        // Distribute across all buckets based on swipe direction
        if (swipeMapping === 'left') {
          contributions.thinking = 1
          contributions.sensing = 1
        } else if (swipeMapping === 'right') {
          contributions.feeling = 1
          contributions.intuition = 1
        } else if (swipeMapping === 'up') {
          contributions.thinking = 0.5
          contributions.feeling = 0.5
          contributions.sensing = 0.5
          contributions.intuition = 0.5
        }
        break
    }

    return contributions
  }
}
