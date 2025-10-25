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
Note: TestUsersSeeder was renamed to BasicUsersSeeder. The seeder suite now creates only admin and employee roles (employee has no permissions).
```bash
php artisan db:seed --class=PermissionSeeder
php artisan db:seed --class=AdminUserSeeder
php artisan db:seed --class=BasicUsersSeeder
```

### 6. Start Development Servers
```bash
# Terminal 1 - Laravel server
php artisan serve

# Terminal 2 - Vite dev server (for frontend assets)
npm run dev
```

## 🔧 Conflict Resolution

### Existing Users
- No automatic backup-email renaming is performed by the seeder.
- The seeder will normalize roles so that only one admin account remains (admin@vigourseeds.com is kept as admin) and other users are assigned the employee role (no permissions). Emails are not modified.

### Existing Permissions
- `delete users` → Renamed to `deactivate users`
- `view user` → Renamed to `view users` (standardizes plural)
- Other variations automatically standardized

### Existing Roles  
- `administrator` → Renamed to `admin`
- `user` → Renamed to `employee`
- `member` → Renamed to `employee`
- `manager` / `testuser` roles are removed/converted to `employee`.

## 🔑 Test Accounts

After setup, you'll have these accounts:

### 👑 Super Admin (Full Access)
- **Email:** admin@vigourseeds.com
- **Password:** admin123
- **Can:** Do everything

### 👤 Employee (No Permissions)
- **Email:** employee@vigourseeds.com
- **Password:** employee123
- **Can:** No special permissions (employee role is intentionally empty)

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
php artisan permission:cache-reset
```

### Frontend Issues
```bash
# Rebuild frontend assets
npm run build
```

## ⚠️ Important Notes

- **Existing Data:** The setup normalizes roles but does not change user emails.
- **Backups:** Always backup your database before running migrations and seeders.
- **Test Accounts:** Delete test accounts before production deployment if needed.
- **Admin Password:** Change admin password after first login

Happy coding! 🎉
