#!/bin/bash

# Railway Build Script for Personality Test Dashboard
echo "🏗️ Starting Railway build process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
npx prisma generate

# Build the Next.js application
echo "🚀 Building Next.js application..."
npm run build

echo "✅ Build completed successfully!"
