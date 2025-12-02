#!/bin/bash

# 🚀 Quick Deploy Script to Vercel
# This script will deploy your API documentation to Vercel

echo "🚀 Starting Vercel Deployment..."
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "📦 Vercel CLI not found. Installing..."
    npm install -g vercel
    echo "✅ Vercel CLI installed!"
    echo ""
fi

# Check if logged in
echo "🔐 Checking Vercel authentication..."
vercel whoami &> /dev/null
if [ $? -ne 0 ]; then
    echo "Please login to Vercel:"
    vercel login
fi

echo ""
echo "✅ Logged in to Vercel!"
echo ""

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix errors and try again."
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Deploy to production
echo "🚀 Deploying to production..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📚 Your API documentation is now live!"
echo "🔗 Access your Swagger UI at: [URL]/docs"
echo ""
echo "💡 Next steps:"
echo "  1. Visit your deployment URL"
echo "  2. Add custom domain (optional): vercel domains add yourdomain.com"
echo "  3. Setup environment variables: vercel env add DATABASE_URL"
echo ""
