# 🚀 Quick Deploy Script to Vercel (Windows PowerShell)
# This script will deploy your API documentation to Vercel

Write-Host "🚀 Starting Vercel Deployment..." -ForegroundColor Green
Write-Host ""

# Check if Vercel CLI is installed
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelInstalled) {
    Write-Host "📦 Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g vercel
    Write-Host "✅ Vercel CLI installed!" -ForegroundColor Green
    Write-Host ""
}

# Check if logged in
Write-Host "🔐 Checking Vercel authentication..." -ForegroundColor Cyan
$whoami = vercel whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Please login to Vercel:" -ForegroundColor Yellow
    vercel login
}

Write-Host ""
Write-Host "✅ Logged in to Vercel!" -ForegroundColor Green
Write-Host ""

# Build the project
Write-Host "🔨 Building project..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed! Please fix errors and try again." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build successful!" -ForegroundColor Green
Write-Host ""

# Deploy to production
Write-Host "🚀 Deploying to production..." -ForegroundColor Cyan
vercel --prod

Write-Host ""
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📚 Your API documentation is now live!" -ForegroundColor Cyan
Write-Host "🔗 Access your Swagger UI at: [URL]/docs" -ForegroundColor Yellow
Write-Host ""
Write-Host "💡 Next steps:" -ForegroundColor Cyan
Write-Host "  1. Visit your deployment URL"
Write-Host "  2. Add custom domain (optional): vercel domains add yourdomain.com"
Write-Host "  3. Setup environment variables: vercel env add DATABASE_URL"
Write-Host ""
