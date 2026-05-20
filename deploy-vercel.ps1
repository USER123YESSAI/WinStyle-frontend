# Deployment helper for Vercel
# Run from the project root: ./deploy-vercel.ps1 -ApiUrl "https://your-api.example.com/api"

param(
  [string]$ApiUrl = "http://localhost:5000/api",
  [switch]$Prod
)

if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
  Write-Error "Vercel CLI not found. Install it with: npm install -g vercel"
  exit 1
}

Write-Host "Installing dependencies..."
npm install
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Building the project..."
npm run build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

$deployMode = if ($Prod) { "--prod" } else { "--confirm" }

Write-Host "Deploying to Vercel..."
vercel $deployMode --confirm

Write-Host "Deployment finished. Remember to set NEXT_PUBLIC_API_URL in your Vercel project settings if needed."
