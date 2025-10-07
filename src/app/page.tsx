import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Navigation from '@/components/Navigation'
import {
  Brain,
  MessageSquare,
  User,
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

export default function Home() {
  const features = [
    {
      icon: Brain,
      title: 'Dynamic Personality Assessment',
      description: 'AI-generated quiz questions tailored to your context and goals',
      href: '/quiz'
    },
    {
      icon: MessageSquare,
      title: 'What I Meant to Say (WIMTS)',
      description: 'Transform your messages with AI-powered communication suggestions',
      href: '/wimts'
    },
    {
      icon: User,
      title: 'Personal Profile & Insights',
      description: 'Track your personality metrics over time with AI-generated insights',
      href: '/profile'
    },
    {
      icon: Users,
      title: 'Relationship Web',
      description: 'Manage per-person contexts and relationship-specific insights',
      href: '/relationships'
    }
  ]

  const benefits = [
    'AI-powered question generation based on your context',
    'Swipe-card interface for engaging assessments',
    'Real-time personality metrics with top-trait highlighting',
    'Communication style suggestions tailored to your personality',
    'Relationship-specific insights and context management',
    'Monthly progress tracking and AI-generated insights'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      <main className="lg:ml-72 p-4 lg:p-8">
        {/* Mobile padding for fixed header */}
        <div className="pt-16 lg:pt-0">
          
          {/* Hero Section */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Personality Insights
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Discover Your True Communication Style
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Take dynamic personality assessments, get AI-powered communication suggestions, 
              and build deeper relationships with personalized insights.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/quiz">
                <Button size="lg" className="gap-2 text-lg px-8 py-6">
                  <Brain className="w-5 h-5" />
                  Take Your First Quiz
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              
              <Link href="/wimts">
                <Button variant="outline" size="lg" className="gap-2 text-lg px-8 py-6">
                  <MessageSquare className="w-5 h-5" />
                  Try WIMTS
                </Button>
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="max-w-6xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">
              Everything You Need for Self-Discovery
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <Link key={index} href={feature.href}>
                    <Card className="h-full hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer group">
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <CardTitle className="text-xl">{feature.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">{feature.description}</p>
                        <div className="flex items-center gap-2 mt-4 text-sm font-medium text-blue-600 group-hover:gap-3 transition-all">
                          Get Started
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Benefits Section */}
          <div className="max-w-4xl mx-auto mb-16">
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl mb-2">Why Choose PersonalityAI?</CardTitle>
                <p className="text-gray-600">
                  Our platform combines cutting-edge AI with proven personality science
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="max-w-2xl mx-auto text-center">
            <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">
                  Ready to Transform Your Communication?
                </h3>
                <p className="mb-6 opacity-90">
                  Join thousands of users discovering their authentic communication style
                </p>
                <Link href="/quiz">
                  <Button size="lg" variant="secondary" className="gap-2">
                    <Sparkles className="w-5 h-5" />
                    Start Your Journey
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
