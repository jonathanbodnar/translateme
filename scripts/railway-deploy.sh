#!/bin/bash

# Railway Deployment Script for Personality Test Dashboard
echo "🚀 Starting Railway deployment preparation..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Check if user is logged in
if ! railway whoami &> /dev/null; then
    echo "🔐 Please log in to Railway:"
    railway login
fi

# Create new project if needed
echo "📦 Setting up Railway project..."
railway link

# Add PostgreSQL database
echo "🗄️ Adding PostgreSQL database..."
railway add --database postgresql

# Set environment variables
echo "🔧 Setting up environment variables..."
echo "Please set the following environment variables in Railway dashboard:"
echo ""
echo "Required Environment Variables:"
echo "- DATABASE_URL (automatically set by Railway PostgreSQL)"
echo "- NEXTAUTH_SECRET (generate with: openssl rand -base64 32)"
echo "- OPENAI_API_KEY (your OpenAI API key)"
echo "- NEXTAUTH_URL (will be your Railway app URL)"
echo ""

# Deploy
echo "🚀 Deploying to Railway..."
railway up --detach

echo "✅ Deployment initiated! Check Railway dashboard for status."
echo "📱 Don't forget to run database migrations after first deployment:"
echo "   railway run npm run db:push"
echo "   railway run npm run db:seed"
