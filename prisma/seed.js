const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create default personality buckets
  const buckets = await Promise.all([
    prisma.bucket.upsert({
      where: { name: 'Thinking' },
      update: {},
      create: {
        name: 'Thinking',
        description: 'Analytical, logical decision-making approach',
        color: '#3B82F6',
        isPrimaryMetric: true,
        visibilityRules: {}
      }
    }),
    prisma.bucket.upsert({
      where: { name: 'Feeling' },
      update: {},
      create: {
        name: 'Feeling',
        description: 'Empathetic, value-based decision-making',
        color: '#EF4444',
        isPrimaryMetric: true,
        visibilityRules: {}
      }
    }),
    prisma.bucket.upsert({
      where: { name: 'Sensing' },
      update: {},
      create: {
        name: 'Sensing',
        description: 'Detail-oriented, practical approach',
        color: '#10B981',
        isPrimaryMetric: true,
        visibilityRules: {}
      }
    }),
    prisma.bucket.upsert({
      where: { name: 'Intuition' },
      update: {},
      create: {
        name: 'Intuition',
        description: 'Big-picture, possibility-focused thinking',
        color: '#8B5CF6',
        isPrimaryMetric: true,
        visibilityRules: {}
      }
    })
  ])

  console.log('✅ Created personality buckets:', buckets.length)

  // Create default settings
  const settings = await Promise.all([
    prisma.settings.upsert({
      where: { key: 'monthly_quiz_limit' },
      update: {},
      create: {
        key: 'monthly_quiz_limit',
        value: { general: 10, personalized: 50 }
      }
    }),
    prisma.settings.upsert({
      where: { key: 'ai_models' },
      update: {},
      create: {
        key: 'ai_models',
        value: { 
          question_generation: 'gpt-4',
          wimts_suggestions: 'gpt-4',
          insights: 'gpt-4'
        }
      }
    })
  ])

  console.log('✅ Created default settings:', settings.length)

  console.log('🎉 Database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
