# Personality Test Dashboard

A comprehensive AI-powered personality assessment and communication insights platform built with Next.js, TypeScript, and modern UI components.

## 🌟 Features

### Core Components
- **Dynamic Personality Assessment** - AI-generated quiz questions with swipe-card interface
- **WIMTS (What I Meant to Say)** - AI-powered communication suggestions and message refinement
- **Personal Profile & Insights** - Dynamic metrics tracking with AI-generated insights
- **Relationship Web** - Per-person context management and relationship-specific insights
- **Admin Dashboard** - Quiz creation and management with AI question generation

### Key Capabilities
- ✅ Swipe-card quiz interface with 2-choice and 3-choice modes
- ✅ Real-time personality metrics with top-trait highlighting
- ✅ AI-powered question generation based on context
- ✅ Communication style suggestions tailored to personality
- ✅ Relationship dynamics tracking with sliders
- ✅ Per-person communication insights
- ✅ Responsive design with mobile and desktop support

## 🏗️ Architecture

### Technology Stack
- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Animations**: Framer Motion
- **Database**: Prisma ORM with PostgreSQL
- **AI Integration**: OpenAI API
- **Authentication**: NextAuth.js (ready for implementation)

### Project Structure
```
src/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Home page
│   ├── quiz/              # Quiz interface
│   ├── wimts/             # WIMTS pages
│   ├── profile/           # User profile
│   ├── relationships/     # Relationship web
│   └── admin/             # Admin dashboard
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── SwipeCard.tsx     # Swipe card interface
│   ├── MetricsDisplay.tsx # Personality metrics
│   ├── QuizInterface.tsx  # Complete quiz flow
│   ├── WimtsInterface.tsx # WIMTS functionality
│   ├── AdminDashboard.tsx # Admin tools
│   └── Navigation.tsx     # App navigation
├── lib/                   # Utility libraries
│   ├── ai.ts             # AI integration
│   ├── scoring.ts        # Scoring engine
│   ├── prisma.ts         # Database client
│   └── utils.ts          # Helper functions
└── prisma/               # Database schema
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- OpenAI API key

### Installation

1. **Clone and install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   Create a `.env.local` file:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/personality_test_db"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-here"
   OPENAI_API_KEY="your-openai-api-key"
   ```

3. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Data Model

### Core Entities
- **Quiz** - Assessment definitions with AI generation rules
- **Question** - Individual quiz questions with answer options
- **IntakeSession** - User quiz responses and calculated scores
- **WimtsEntry** - Communication refinement entries
- **Profile** - User personality data and preferences
- **Relationship** - Per-person context and dynamics
- **MetricsTimeSeries** - Historical personality data

### Scoring System
The platform uses a flexible scoring engine that:
- Accumulates answer contributions to personality buckets
- Applies normalization and formulas
- Highlights top-K traits while blurring others
- Supports custom scoring rules per quiz

## 🎯 Usage Examples

### Taking a Quiz
1. Visit `/quiz` to start an assessment
2. Optionally customize with AI-generated questions
3. Swipe through questions (left=disagree, right=agree, up=neutral)
4. View real-time personality metrics
5. Get comprehensive results with insights

### Using WIMTS
1. Go to `/wimts` to refine communication
2. Enter your raw message and context
3. Get 3 AI-generated alternatives
4. Select and edit your preferred version
5. Save with optional translation for others

### Managing Relationships
1. Access `/relationships` to build your web
2. Add people with context and tags
3. Set relationship dynamics with sliders
4. Get personalized communication insights
5. Track interaction patterns over time

### Admin Features
1. Visit `/admin` to create quizzes
2. Use AI to generate contextual questions
3. Configure scoring formulas and buckets
4. Test quizzes before publishing
5. Manage question ordering and visibility

## 🔧 Configuration

### AI Question Generation
Customize question generation by providing:
- **Situation Context** - Assessment environment
- **Goal** - What you want to measure
- **Tone Preference** - Communication style
- **Other Person Role** - Relationship context

### Personality Buckets
Default traits (customizable):
- **Thinking** - Analytical, logical decision-making
- **Feeling** - Empathetic, value-based choices
- **Sensing** - Detail-oriented, practical approach
- **Intuition** - Big-picture, possibility-focused

### Scoring Formulas
Configure how answers contribute to personality metrics:
- Contribution mapping per answer option
- Normalization rules (linear, percentile)
- Top-K highlighting (default: top 2 traits)
- Blur settings for non-primary traits

## 🎨 UI/UX Features

### Responsive Design
- Mobile-first responsive layout
- Touch-friendly swipe gestures
- Adaptive navigation (sidebar on desktop, overlay on mobile)
- Optimized for various screen sizes

### Interactive Elements
- Smooth swipe animations with Framer Motion
- Real-time metric updates
- Contextual hover states and transitions
- Visual feedback for user actions

### Accessibility
- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly
- High contrast color schemes

## 🚀 Deployment

### Production Setup
1. Set up PostgreSQL database
2. Configure environment variables
3. Run database migrations
4. Build the application:
   ```bash
   npm run build
   ```
5. Deploy to your preferred platform (Vercel, Netlify, etc.)

### Environment Variables
Required for production:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Authentication secret
- `OPENAI_API_KEY` - AI integration
- `NEXTAUTH_URL` - Your domain URL

## 🔮 Future Enhancements

### Planned Features
- [ ] User authentication and sessions
- [ ] Monthly usage limits and gating
- [ ] Advanced analytics and reporting
- [ ] Social sharing capabilities
- [ ] Mobile app version
- [ ] Multi-language support
- [ ] Advanced AI models integration

### Extensibility
- Pluggable scoring algorithms
- Custom personality frameworks
- Third-party AI providers
- Webhook integrations
- API for external tools

## 📝 License

This project is built as a demonstration of modern web development practices and AI integration. Feel free to use as inspiration for your own projects.

## 🤝 Contributing

This is a showcase project demonstrating:
- Modern React/Next.js patterns
- AI integration best practices
- Complex UI interactions
- Database design for personality data
- Responsive design principles

---

**Built with ❤️ using Next.js, TypeScript, and AI**