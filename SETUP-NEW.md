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

**Important:** Set your `APP_URL` to match your local server:
```env
# If using php artisan serve:
APP_URL=http://localhost:8000

# If using XAMPP with project in htdocs/dashboard:
APP_URL=http://localhost/dashboard/SoftwareEngineering-VigourSeeds-FinalRepo/public

# Or adjust to your specific setup
```

### 3.1. Create Storage Symlink (Required for Avatar Uploads)
```bash
php artisan storage:link
```
This creates a symbolic link from `public/storage` to `storage/app/public` for file uploads.

### 4. Handle Existing Data (if applicable)
If you have an existing database, our migration will safely handle conflicts:
```bash
# Publishes Spatie permissions and handles conflicts
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider" --tag="migrations"
php artisan migrate
```

### 5. Seed Data (Comprehensive Role Setup)
The system includes 11 roles with specific permissions and test accounts for each role.
```bash
php artisan db:seed --class=RolePermissionSeeder
php artisan db:seed --class=TestAccountsSeeder
```

**Or seed everything at once:**
```bash
php artisan migrate:fresh --seed
```

### 6. Start Development Servers
```bash
# Terminal 1 - Laravel server
php artisan serve

# Terminal 2 - Vite dev server (for frontend assets)
npm run dev
```

## 🎭 Role Structure

The system includes **11 roles** with separation of duties:

1. **admin** - Full system access
2. **contract_manager** - Full contract lifecycle + field visit + buyback
3. **contract_coordinator** - Draft & submit only
4. **partner_manager** - Full partner CRUD + view inventory
5. **partner_viewer** - Read-only partner access
6. **inventory_manager** - Full inventory/seeds/items control
7. **warehouse_staff** - Transaction recording only
8. **seed_manager** - Seed catalog specialist
9. **field_officer** - Farm inspections (no completion)
10. **field_supervisor** - Full field visit control
11. **employee** - Base role (no permissions)

**Permissions:** 41 total across user management, partners, seeds, items, contracts, inventory, and field visits.

## 🔑 Test Accounts

After setup, you'll have **11 test accounts** (one for each role). All use password: **`password123`**

### 👑 Admin - Full System Access
- **Email:** admin@vigourseeds.com
- **Can:** Everything (41 permissions)

### 📝 Contract Manager - Full Contract Control
- **Email:** contract.manager@vigourseeds.com
- **Can:** Full contract CRUD, field visit control, buyback transactions

### 📋 Contract Coordinator - Limited Contract Control
- **Email:** contract.coordinator@vigourseeds.com
- **Can:** Draft & submit contracts (no activation)

### 🤝 Partner Manager - Full Partner Management
- **Email:** partner.manager@vigourseeds.com
- **Can:** Full partner CRUD, view contracts & inventory

### 👁️ Partner Viewer - Read-Only Partner Access
- **Email:** partner.viewer@vigourseeds.com
- **Can:** View partners only

### 📦 Inventory Manager - Full Inventory Control
- **Email:** inventory.manager@vigourseeds.com
- **Can:** Full inventory, seeds, items CRUD

### 🏭 Warehouse Staff - Transaction Recording
- **Email:** warehouse.staff@vigourseeds.com
- **Can:** Record inventory transactions only

### 🌱 Seed Manager - Seed Catalog Specialist
- **Email:** seed.manager@vigourseeds.com
- **Can:** Full seed catalog management

### 🚜 Field Officer - Farm Inspections
- **Email:** field.officer@vigourseeds.com
- **Can:** Create & edit field visits (no completion)

### 👨‍🌾 Field Supervisor - Senior Field Control
- **Email:** field.supervisor@vigourseeds.com
- **Can:** Full field visit control including completion

### 👤 Employee - Base Role
- **Email:** employee@vigourseeds.com
- **Can:** No special permissions

**📄 See `TEST-ACCOUNTS.md` for complete permission details**

## 🛠️ Troubleshooting

### Database Issues
```bash
# Reset everything (WARNING: deletes all data)
php artisan migrate:fresh --seed
```

### "Unknown database" / "Tablespace already exists" / "Table already exists" loop
If `php artisan migrate:fresh --seed` fails with errors like:
- `SQLSTATE[HY000] [1049] Unknown database 'vigour_seeds_system'`
- `SQLSTATE[HY000]: General error: 1813 Tablespace for table '...' exists. Please DISCARD the tablespace before IMPORT`
- `SQLSTATE[42S01]: Base table or view already exists`

This usually means MySQL has leftover/orphaned table files that don't match its internal state (common after an interrupted migration, a manual table drop, or editing files in the MySQL `data` folder directly).

**Fix:**
1. Make sure only one MySQL server is running on port 3306:
   ```bash
   netstat -ano | findstr :3306
   ```
2. Fully drop and recreate the database (not just the tables):
   ```bash
   "C:\xampp\mysql\bin\mysql.exe" -u root -e "DROP DATABASE vigour_seeds_system; CREATE DATABASE vigour_seeds_system;"
   ```
3. Confirm it's actually empty before migrating:
   ```bash
   "C:\xampp\mysql\bin\mysql.exe" -u root -e "SHOW TABLES FROM vigour_seeds_system;"
   ```
4. Then run:
   ```bash
   php artisan migrate:fresh --seed
   ```

⚠️ **Don't** try to fix this by deleting or swapping the MySQL `data` folder, or by copying in XAMPP's `mysql/backup` folder — that folder is not guaranteed to be empty (it may contain an old snapshot of your actual databases) and can make the desync worse, not better. Dropping and recreating the specific database via SQL is the safe fix.

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

- **Test Accounts:** All accounts use password `password123` - change in production!
- **Backups:** Always backup your database before running migrations and seeders.
- **Production:** Remove test accounts before deploying to production.
- **Permission Cache:** Run `php artisan permission:cache-reset` if permissions don't update.
- **Detailed Guide:** See `TEST-ACCOUNTS.md` for complete role & permission matrix

Happy coding! 🎉