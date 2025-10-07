import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface QuestionGenerationContext {
  situationContext?: string
  goal?: string
  tonePreference?: string
  otherPersonRole?: string
  existingQuestions?: string[]
}

export async function generateQuizQuestions(
  context: QuestionGenerationContext,
  count: number = 5
): Promise<string[]> {
  const prompt = `Generate ${count} personality assessment questions based on the following context:
  
Situation: ${context.situationContext || 'General personality assessment'}
Goal: ${context.goal || 'Understanding personality traits'}
Tone: ${context.tonePreference || 'Professional and engaging'}
Other Person Role: ${context.otherPersonRole || 'N/A'}

The questions should be designed for a swipe-card interface where users can answer with:
- Left swipe (disagree/no)
- Right swipe (agree/yes)
- Up swipe (neutral/sometimes) - optional

Make the questions engaging, clear, and suitable for measuring personality traits like Thinking, Feeling, Sensing, and Intuition.

${context.existingQuestions?.length ? `Avoid duplicating these existing questions: ${context.existingQuestions.join(', ')}` : ''}

Return only the questions, one per line.`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    })

    const content = response.choices[0]?.message?.content || ''
    return content.split('\n').filter(q => q.trim().length > 0)
  } catch (error) {
    console.error('Error generating questions:', error)
    return []
  }
}

export interface WimtsContext {
  rawInput: string
  situationContext?: string
  personalityMetrics?: Record<string, number>
}

export async function generateWimtsCandidates(
  context: WimtsContext
): Promise<string[]> {
  const metricsContext = context.personalityMetrics 
    ? `User's personality leans toward: ${Object.entries(context.personalityMetrics)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 2)
        .map(([key, value]) => `${key} (${value.toFixed(1)})`)
        .join(', ')}`
    : ''

  const prompt = `Help rephrase this message to be more effective:

Original message: "${context.rawInput}"
Situation context: ${context.situationContext || 'General communication'}
${metricsContext}

Generate 3 different ways to say this that are:
1. More clear and direct
2. More diplomatic and considerate  
3. More engaging and personable

Consider the user's personality traits when crafting these alternatives. Each option should maintain the original intent while improving the communication style.

Return only the 3 alternatives, one per line, without numbering or labels.`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
    })

    const content = response.choices[0]?.message?.content || ''
    return content.split('\n').filter(c => c.trim().length > 0).slice(0, 3)
  } catch (error) {
    console.error('Error generating WIMTS candidates:', error)
    return [context.rawInput, context.rawInput, context.rawInput]
  }
}

export async function generatePersonalityInsight(
  metricsHistory: Array<{ metric: string; value: number; date: Date }>,
  recentWimtsEntries?: Array<{ finalText: string; situationContext?: string }>
): Promise<string> {
  const metricsData = metricsHistory
    .reduce((acc, entry) => {
      if (!acc[entry.metric]) acc[entry.metric] = []
      acc[entry.metric].push({ value: entry.value, date: entry.date })
      return acc
    }, {} as Record<string, Array<{ value: number; date: Date }>>)

  const trends = Object.entries(metricsData).map(([metric, values]) => {
    const recent = values.slice(-5)
    const avg = recent.reduce((sum, v) => sum + v.value, 0) / recent.length
    return `${metric}: ${avg.toFixed(1)} (recent trend)`
  }).join(', ')

  const wimtsContext = recentWimtsEntries?.length 
    ? `Recent communication patterns: ${recentWimtsEntries.slice(0, 3).map(e => e.situationContext || 'general').join(', ')}`
    : ''

  const prompt = `Generate a personalized insight based on this personality data:

Personality metrics: ${trends}
${wimtsContext}

Create a brief, encouraging insight (2-3 sentences) that:
1. Highlights a key strength or pattern
2. Offers a gentle suggestion for growth or awareness
3. Is positive and actionable

The insight should feel personal and valuable to the user.`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    })

    return response.choices[0]?.message?.content || 'Your personality journey is unique and valuable.'
  } catch (error) {
    console.error('Error generating insight:', error)
    return 'Your personality journey is unique and valuable.'
  }
}
