// Core quiz system types for the focused admin dashboard

export type BucketType = 'feeling' | 'sensing' | 'intuition' | 'thinking'

export type QuizType = 'quick_onboarding' | 'deep_dive'

export type AnswerFormat = 'swipe' | 'multi_choice' | 'slider'

export type ToneVariant = 'poetic' | 'blunt' | 'tender' | 'casual' | 'practical'

export interface BucketWeights {
  feeling: number    // 0-10
  sensing: number    // 0-10  
  intuition: number  // 0-10
  thinking: number   // 0-10
}

export interface PhrasingVariant {
  id: string
  text: string
  tone: ToneVariant
  isDefault: boolean
}

export interface AnswerChoice {
  id: string
  text: string
  swipeDirection?: 'left' | 'right' | 'up'
  bucketWeights: BucketWeights
  phrasings: PhrasingVariant[]
}

export interface QuizQuestion {
  id: string
  groupId?: string // For deep dive grouping (fears, coping, etc)
  text: string
  phrasings: PhrasingVariant[]
  answerFormat: AnswerFormat
  answerChoices: AnswerChoice[]
  order: number
  isActive: boolean
  // Branching logic
  skipConditions?: {
    ifAnswerId: string
    skipToQuestionId?: string
  }[]
  // Progressive narrowing
  followUpTriggers?: {
    triggeredByAnswerId: string
    followUpQuestionId: string
  }[]
}

export interface QuestionGroup {
  id: string
  name: string
  description: string
  weight: number // How much this group contributes to overall bucket scores
  questions: QuizQuestion[]
}

export interface ScoringFormula {
  id: string
  aggregation: 'sum' | 'average' | 'weighted'
  normalization: {
    enabled: boolean
    scale: [number, number] // e.g., [0, 100]
  }
  topKHighlight: {
    method: 'fixed_top_2' | 'fixed_top_3' | 'threshold'
    threshold?: number // if method is 'threshold'
  }
  blurNonTop: boolean
  tieBreaking: {
    priority: BucketType[] // Order of preference for ties
  }
}

export interface QuizVersion {
  id: string
  version: string
  createdAt: Date
  createdBy: string
  questions: QuizQuestion[]
  groups?: QuestionGroup[] // Only for deep dive
  scoringFormula: ScoringFormula
  status: 'draft' | 'published' | 'archived'
  changeLog: string
}

export interface Quiz {
  id: string
  type: QuizType
  name: string
  description: string
  maxQuestions: number // 4 for quick, unlimited for deep
  currentVersion: QuizVersion
  versions: QuizVersion[]
  createdAt: Date
  updatedAt: Date
}

// Admin preview/testing
export interface QuizSession {
  id: string
  quizId: string
  answers: Array<{
    questionId: string
    answerId: string
    bucketWeights: BucketWeights
  }>
  finalScores: {
    raw: BucketWeights
    normalized: BucketWeights
    topBuckets: BucketType[]
  }
  completedAt?: Date
}

// Bucket configuration
export interface BucketConfig {
  id: BucketType
  name: string
  description: string
  color: string
  icon?: string
}

export const DEFAULT_BUCKET_CONFIGS: BucketConfig[] = [
  {
    id: 'feeling',
    name: 'Feeling',
    description: 'Emotional resonance, empathy, values-based decisions',
    color: '#EF4444',
    icon: '❤️'
  },
  {
    id: 'sensing', 
    name: 'Sensing',
    description: 'Concrete details, facts, practical focus',
    color: '#10B981',
    icon: '👁️'
  },
  {
    id: 'intuition',
    name: 'Intuition', 
    description: 'Abstract patterns, big picture, possibilities',
    color: '#8B5CF6',
    icon: '🔮'
  },
  {
    id: 'thinking',
    name: 'Thinking',
    description: 'Logic, structure, analytical reasoning',
    color: '#3B82F6',
    icon: '🧠'
  }
]

// Validation helpers
export const validateBucketWeights = (weights: BucketWeights): boolean => {
  const total = weights.feeling + weights.sensing + weights.intuition + weights.thinking
  return total <= 10 && total >= 0
}

export const normalizeBucketWeights = (weights: BucketWeights): BucketWeights => {
  const total = weights.feeling + weights.sensing + weights.intuition + weights.thinking
  if (total === 0) return weights
  
  const factor = 10 / total
  return {
    feeling: Math.round(weights.feeling * factor * 10) / 10,
    sensing: Math.round(weights.sensing * factor * 10) / 10,
    intuition: Math.round(weights.intuition * factor * 10) / 10,
    thinking: Math.round(weights.thinking * factor * 10) / 10,
  }
}
