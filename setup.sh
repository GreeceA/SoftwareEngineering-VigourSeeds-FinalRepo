#!/bin/bash

# Vigour Seeds Dashboard - Safe Setup Script
# This script handles existing database conflicts gracefully

echo "🌱 Vigour Seeds Dashboard - Safe Setup"
echo "======================================"
echo ""

# Check if we're in the right directory
if [ ! -f "artisan" ]; then
    echo "❌ Error: Please run this script from your Laravel project root directory"
    exit 1
fi

echo "📋 Step 1: Installing dependencies..."
composer install --no-interaction
npm install

echo ""
echo "🔧 Step 2: Environment setup..."
if [ ! -f ".env" ]; then
    echo "   Creating .env file from .env.example..."
    cp .env.example .env
    php artisan key:generate
else
    echo "   ✅ .env file already exists"
fi

echo ""
echo "🗃️  Step 3: Database setup (safe mode)..."
echo "   This will handle any existing conflicts automatically..."

# First, publish Spatie permissions if needed
echo "   📦 Publishing Spatie Permission package..."
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider" --tag="migrations" --force

# Run migrations (including our conflict resolution migration)
echo "   🚀 Running migrations..."
php artisan migrate

# Clear all caches
echo "   🧹 Clearing caches..."
php artisan config:clear
php artisan cache:clear
php artisan route:clear

echo ""
echo "🔗 Step 4: Creating storage symlink (for file uploads)..."
php artisan storage:link

# Run seeders safely
echo ""
echo "🌱 Step 5: Running seeders (conflict-safe)..."
php artisan db:seed --class=PermissionSeeder
php artisan db:seed --class=AdminUserSeeder
php artisan db:seed --class=BasicUsersSeeder

echo ""
echo "✅ Setup completed successfully!"
echo ""
echo "🔑 Test Accounts Available:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "👑 Super Admin:"
echo "   📧 admin@vigourseeds.com"
echo "   🔑 admin123"
echo ""
echo "👔 Manager:"
echo "   📧 manager@vigourseeds.com" 
echo "   🔑 manager123"
echo ""
echo "👤 Employee:"
echo "   📧 employee@vigourseeds.com"
echo "   🔑 employee123"
echo ""
echo "🚀 Ready to start development servers:"
echo "   Terminal 1: php artisan serve"
echo "   Terminal 2: npm run dev"
echo ""
echo "⚠️  Remember to:"
echo "   • Update your .env database credentials"
echo "   • Change admin password after first login"
echo "   • Delete test accounts before production"
