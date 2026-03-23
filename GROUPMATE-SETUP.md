# 👥 Quick Setup for Team Members

## 🚀 After Pulling/Cloning the Repo

### 1️⃣ Install Dependencies
```bash
composer install
npm install
```

### 2️⃣ Configure Environment
```bash
# Copy the environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 3️⃣ Update Your `.env` File

**Set your APP_URL** based on your local setup:

```env
# If using php artisan serve:
APP_URL=http://localhost:8000

# If using XAMPP (adjust path to match your setup):
APP_URL=http://localhost/dashboard/SoftwareEngineering-VigourSeeds-FinalRepo/public
```

**Set your database credentials:**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=vigour_seeds_system
DB_USERNAME=root
DB_PASSWORD=
```

### 4️⃣ Create the Database
Open phpMyAdmin and create a database named `vigour_seeds_system`

**OR** use command line:
```bash
# For XAMPP on Windows:
/c/xampp/mysql/bin/mysql -u root -e "CREATE DATABASE vigour_seeds_system"

# For XAMPP on Mac/Linux:
/Applications/XAMPP/bin/mysql -u root -e "CREATE DATABASE vigour_seeds_system"
```

### 5️⃣ Create Storage Symlink (IMPORTANT!)
```bash
php artisan storage:link
```
⚠️ **This is required for avatar uploads to work!**

### 6️⃣ Run Migrations and Seeders
```bash
php artisan migrate:fresh --seed
```

### 7️⃣ Start Development Servers
```bash
# Terminal 1 - Laravel backend
php artisan serve

# Terminal 2 - Vite frontend
npm run dev
```

---

## 🔑 Test Login Credentials

### Admin Account
- **Email:** admin@vigourseeds.com
- **Password:** admin123

### Employee Account
- **Email:** employee@vigourseeds.com  
- **Password:** employee123

---

## 🛠️ Common Issues & Solutions

### Issue: "Avatar not showing after upload"
**Solution:** Make sure you ran `php artisan storage:link`

### Issue: "Page is slow/laggy"
**Solution:** 
```bash
php artisan cache:clear
php artisan config:clear
```

### Issue: "Permission denied on storage folder"
**Solution (Mac/Linux):**
```bash
chmod -R 775 storage
chmod -R 775 bootstrap/cache
```

### Issue: "Vite not loading assets"
**Solution:** Make sure `npm run dev` is running in a separate terminal

### Issue: "Database connection error"
**Solution:** 
1. Make sure XAMPP MySQL is running
2. Check your `.env` database credentials
3. Verify database exists in phpMyAdmin

---

## 📝 Important Notes

1. **Always pull latest changes before starting work:**
   ```bash
   git pull origin Draft-Final-Program
   composer install
   npm install
   ```

2. **If you see permission errors after pulling:**
   ```bash
   php artisan cache:clear
   php artisan config:clear
   php artisan storage:link
   ```

3. **Don't commit your `.env` file** - it's in `.gitignore` for a reason!

4. **Each team member should run `php artisan storage:link` on their own machine**

---

## 🆘 Still Having Issues?

Check the full setup guide in `SETUP-NEW.md` or contact the team lead.
