# PresenceIQ Integrated Backend - Quick Setup Script
# This script automates the setup process

Write-Host "`n═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   PRESENCEIQ INTEGRATED BACKEND - SETUP WIZARD" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════`n" -ForegroundColor Cyan

# Check if we're in the right directory
if (!(Test-Path "manage.py")) {
    Write-Host "Error: Please run this script from the backend_integrated directory" -ForegroundColor Red
    exit 1
}

# Step 1: Check Python
Write-Host "[1/8] Checking Python installation..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "  ✓ $pythonVersion" -ForegroundColor Green
}
catch {
    Write-Host "  ✗ Python not found. Please install Python 3.9+" -ForegroundColor Red
    exit 1
}

# Step 2: Check MongoDB
Write-Host "`n[2/8] Checking MongoDB..." -ForegroundColor Yellow
$mongoService = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue
if ($mongoService -and $mongoService.Status -eq "Running") {
    Write-Host "  ✓ MongoDB is running" -ForegroundColor Green
}
else {
    Write-Host "  ✗ MongoDB is not running" -ForegroundColor Red
    Write-Host "    Please start MongoDB service" -ForegroundColor Yellow
    $startMongo = Read-Host "    Do you want to try starting it? (Y/N)"
    if ($startMongo -eq "Y") {
        try {
            Start-Service -Name "MongoDB"
            Write-Host "  ✓ MongoDB started" -ForegroundColor Green
        }
        catch {
            Write-Host "  ✗ Failed to start MongoDB. Please start it manually." -ForegroundColor Red
        }
    }
}

# Step 3: Create virtual environment
Write-Host "`n[3/8] Creating virtual environment..." -ForegroundColor Yellow
if (Test-Path "venv") {
    Write-Host "  ✓ Virtual environment already exists" -ForegroundColor Green
}
else {
    python -m venv venv
    Write-Host "  ✓ Virtual environment created" -ForegroundColor Green
}

# Step 4: Activate virtual environment
Write-Host "`n[4/8] Activating virtual environment..." -ForegroundColor Yellow
& .\venv\Scripts\Activate.ps1
Write-Host "  ✓ Virtual environment activated" -ForegroundColor Green

# Step 5: Install dependencies
Write-Host "`n[5/8] Installing dependencies (this may take a while)..." -ForegroundColor Yellow
Write-Host "  Installing Django, DRF, MongoDB drivers, AI libraries..." -ForegroundColor Gray
pip install -r requirements.txt --quiet
Write-Host "  ✓ Dependencies installed" -ForegroundColor Green

# Step 6: Check .env file
Write-Host "`n[6/8] Checking environment configuration..." -ForegroundColor Yellow
if (!(Test-Path ".env")) {
    Write-Host "  Creating .env from .env.example..." -ForegroundColor Gray
    Copy-Item ".env.example" ".env"
    Write-Host "  ✓ .env file created" -ForegroundColor Green
    Write-Host "  ⚠️  Please update .env with your settings" -ForegroundColor Yellow
}
else {
    Write-Host "  ✓ .env file exists" -ForegroundColor Green
}

# Step 7: Run migrations
Write-Host "`n[7/8] Setting up database..." -ForegroundColor Yellow
Write-Host "  Creating migrations..." -ForegroundColor Gray
python manage.py makemigrations --no-input 2>&1 | Out-Null
Write-Host "  Applying migrations..." -ForegroundColor Gray
python manage.py migrate --no-input 2>&1 | Out-Null
Write-Host "  ✓ Database setup complete" -ForegroundColor Green

# Step 8: Create superuser
Write-Host "`n[8/8] Setup complete!" -ForegroundColor Yellow
Write-Host ""
$createSuperuser = Read-Host "Do you want to create a superuser now? (Y/N)"
if ($createSuperuser -eq "Y") {
    Write-Host "`nCreating superuser..." -ForegroundColor Yellow
    python manage.py createsuperuser
}

# Summary
Write-Host "`n═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   SETUP COMPLETE! 🎉" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════`n" -ForegroundColor Cyan

Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Update .env file with your settings (email, etc.)" -ForegroundColor White
Write-Host "  2. Run the development server:" -ForegroundColor White
Write-Host "     python manage.py runserver" -ForegroundColor Cyan
Write-Host "  3. Open your browser:" -ForegroundColor White
Write-Host "     http://localhost:8000/api/health/" -ForegroundColor Cyan
Write-Host "  4. Access Django admin:" -ForegroundColor White
Write-Host "     http://localhost:8000/admin/" -ForegroundColor Cyan
Write-Host ""

Write-Host "API Endpoints:" -ForegroundColor Yellow
Write-Host "  • POST /api/auth/register/      Register new user" -ForegroundColor Gray
Write-Host "  • POST /api/auth/login/         User login" -ForegroundColor Gray
Write-Host "  • GET  /api/auth/user/          Get current user" -ForegroundColor Gray
Write-Host "  • GET  /api/health/             Health check" -ForegroundColor Gray
Write-Host ""

Write-Host "Documentation:" -ForegroundColor Yellow
Write-Host "  • README.md                     Quick start guide" -ForegroundColor Gray
Write-Host "  • ../QUICK_START.md             One-page reference" -ForegroundColor Gray
Write-Host "  • ../FINAL_INTEGRATED_BACKEND.md Complete architecture" -ForegroundColor Gray
Write-Host ""

Write-Host "Happy coding! 🚀`n" -ForegroundColor Green
