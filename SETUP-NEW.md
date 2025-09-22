# 🌱 Vigour Seeds Dashboard - Setup Guide

## 🚀 Quick Setup (Conflict-Safe)

For the safest setup experience, use our automated scripts:

### Windows:
```bash
setup.bat
```

### Linux/Mac:
```bash
chmod +x setup.sh
./setup.sh
```

## 📋 Manual Setup

If you prefer manual setup or encounter issues:

### 1. Install Dependencies
```bash
composer install
npm install
```

### 2. Environment Configuration
```bash
cp .env.example .env
php artisan key:generate
```

### 3. Database Setup
Update your `.env` file with your database credentials:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### 4. Handle Existing Data (if applicable)
If you have an existing database, our migration will safely handle conflicts:
```bash
# Publishes Spatie permissions and handles conflicts
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider" --tag="migrations"
php artisan migrate
```

### 5. Seed Data (Conflict-Safe)
```bash
php artisan db:seed --class=PermissionSeeder
php artisan db:seed --class=AdminUserSeeder
php artisan db:seed --class=TestUsersSeeder
```

### 6. Start Development Servers
```bash
# Terminal 1 - Laravel server
php artisan serve

# Terminal 2 - Vite dev server (for frontend assets)
npm run dev
```

## 🔧 Conflict Resolution

### Existing Test Users
- If `admin@vigourseeds.com` exists → **Deleted** and replaced with fresh account
- If `manager@vigourseeds.com` exists → **Deleted** (manager role removed - simplified system)
- If `employee@vigourseeds.com` exists → **Deleted** and replaced with fresh account

### Existing Permissions
- `delete users` → Renamed to `deactivate users`
- `view user` → Renamed to `view users` (standardizes plural)
- Other variations automatically standardized

### Existing Roles  
- `administrator` → Renamed to `admin`
- `manager` → **Deleted** (simplified to admin/employee only)
- `user` → Renamed to `employee`
- `member` → Renamed to `employee`

## 🔑 Test Accounts

After setup, you'll have these accounts:

### 👑 Super Admin (Full Access)
- **Email:** admin@vigourseeds.com
- **Password:** admin123
- **Can:** Do everything - full access to all modules and permissions

### 👤 Employee (Dashboard Only)
- **Email:** employee@vigourseeds.com
- **Password:** employee123
- **Can:** Access dashboard only (no other permissions)

**Note:** Manager role has been removed to simplify the system to just Admin (full access) and Employee (dashboard only).

## 🛠️ Troubleshooting

### Database Issues
```bash
# Reset everything (WARNING: deletes all data)
php artisan migrate:fresh --seed
```

### Permission Caches
```bash
# Clear permission caches
php artisan cache:clear
php artisan config:clear
```

### Frontend Issues
```bash
# Rebuild frontend assets
npm run build
```

## ⚠️ Important Notes

- **Existing Test Users:** Our setup will **delete and replace** any existing test accounts (admin, manager, employee) to ensure proper Spatie permissions
- **Backups:** Always backup your database before running migrations
- **Test Accounts:** Delete test accounts before production deployment
- **Admin Password:** Change admin password after first login

Happy coding! 🎉
