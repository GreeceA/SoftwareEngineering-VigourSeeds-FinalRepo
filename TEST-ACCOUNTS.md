# 🔐 Test Accounts - Vigour Seeds ERP

## 📋 Quick Reference

All test accounts use the same password: **`password123`**

---

## 👥 Available Test Accounts

### 1️⃣ **ADMIN** (Super Administrator)
- **Email:** `admin@vigourseeds.com`
- **Password:** `password123`
- **Permissions:** ALL (41 permissions)
- **Can Do:**
  - ✅ Everything in the system
  - ✅ User management
  - ✅ Role & permission management
  - ✅ All business operations

---

### 2️⃣ **CONTRACT MANAGER** (Senior Contract Control)
- **Email:** `contract.manager@vigourseeds.com`
- **Password:** `password123`
- **Permissions:** 18
- **Can Do:**
  - ✅ Full contract CRUD (create, edit, delete)
  - ✅ All contract status changes (submit, activate, suspend, terminate, complete, cancel)
  - ✅ Field visit control (view, create, complete, cancel)
  - ✅ Record buyback transactions
  - ✅ View partners, seeds, items, inventory (read-only)

---

### 3️⃣ **CONTRACT COORDINATOR** (Junior Contract Control)
- **Email:** `contract.coordinator@vigourseeds.com`
- **Password:** `password123`
- **Permissions:** 8
- **Can Do:**
  - ✅ Create & edit contracts (draft only)
  - ✅ Submit contracts for review
  - ❌ Cannot activate/suspend/terminate contracts
  - ✅ View partners, seeds, items, field visits (read-only)

---

### 4️⃣ **PARTNER MANAGER** (Full Partner Control)
- **Email:** `partner.manager@vigourseeds.com`
- **Password:** `password123`
- **Permissions:** 7
- **Can Do:**
  - ✅ Full partner CRUD (create, edit, archive)
  - ✅ Add/edit contact persons
  - ✅ Add/edit farm locations
  - ✅ View contracts (read-only)
  - ✅ View field visits (read-only)
  - ✅ View inventory (read-only)
  - ❌ Cannot create contracts

---

### 5️⃣ **PARTNER VIEWER** (Read-Only Partner Access)
- **Email:** `partner.viewer@vigourseeds.com`
- **Password:** `password123`
- **Permissions:** 1
- **Can Do:**
  - ✅ View partners only (read-only)
  - ❌ No editing capabilities

---

### 6️⃣ **INVENTORY MANAGER** (Full Inventory Control)
- **Email:** `inventory.manager@vigourseeds.com`
- **Password:** `password123`
- **Permissions:** 16
- **Can Do:**
  - ✅ Full inventory control (inbound, outbound, adjustments)
  - ✅ Full item CRUD (create, edit, archive items)
  - ✅ Create & fulfill partner orders
  - ✅ Record buyback transactions
  - ✅ View seeds (read-only)
  - ✅ View partners & contracts (read-only)

---

### 7️⃣ **WAREHOUSE STAFF** (Transaction Recording Only)
- **Email:** `warehouse.staff@vigourseeds.com`
- **Password:** `password123`
- **Permissions:** 4
- **Can Do:**
  - ✅ View inventory
  - ✅ Record inventory transactions (inbound/outbound)
  - ✅ View items & seeds (read-only)
  - ❌ Cannot modify product catalogs
  - ❌ Cannot see partner orders

---

### 8️⃣ **SEED MANAGER** (Seed Catalog Specialist)
- **Email:** `seed.manager@vigourseeds.com`
- **Password:** `password123`
- **Permissions:** 6
- **Can Do:**
  - ✅ Full seed CRUD (create, edit, archive)
  - ✅ Set seed pricing
  - ✅ Define growth cycles & soil compatibility
  - ✅ View contracts & inventory (read-only)

---

### 9️⃣ **FIELD OFFICER** (Farm Inspections)
- **Email:** `field.officer@vigourseeds.com`
- **Password:** `password123`
- **Permissions:** 5
- **Can Do:**
  - ✅ Create & edit field visits
  - ✅ Add growth & damage reports
  - ❌ Cannot complete field visits (requires supervisor)
  - ✅ View contracts & partners (read-only)

---

### 🔟 **FIELD SUPERVISOR** (Senior Field Control)
- **Email:** `field.supervisor@vigourseeds.com`
- **Password:** `password123`
- **Permissions:** 7
- **Can Do:**
  - ✅ All field officer permissions
  - ✅ Complete field visits (approval authority)
  - ✅ Cancel field visits
  - ✅ View contracts & partners (read-only)

---

### 1️⃣1️⃣ **EMPLOYEE** (Base Role)
- **Email:** `employee@vigourseeds.com`
- **Password:** `password123`
- **Permissions:** 0
- **Can Do:**
  - ✅ View & edit own profile
  - ✅ Change own password
  - ✅ Update own avatar
  - ❌ No special system permissions

---

## 🚀 How to Use

### Seed the Database:
```bash
# Fresh database with all test accounts
php artisan migrate:fresh --seed

# Or seed test accounts only (if roles already exist)
php artisan db:seed --class=TestAccountsSeeder
```

### Login:
1. Visit your application URL
2. Use any email from above
3. Password: `password123`
4. Test the permissions specific to that role

---

## 🔒 Permission Matrix

| **Action** | Admin | Contract Mgr | Partner Mgr | Partner Viewer | Inventory Mgr | Warehouse | Field Supervisor |
|------------|-------|--------------|-------------|----------------|---------------|-----------|------------------|
| Create Contract | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Activate Contract | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Edit Partner | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| View Partner | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Create Inbound | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ |
| Create Partner Order | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Complete Field Visit | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Record Buyback | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| View Inventory | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |

---

## ⚠️ Important Notes

1. **Password Security**: Change these passwords in production!
2. **Email Verification**: All test accounts are pre-verified
3. **Role Assignment**: Each account has exactly ONE role
4. **Separation of Duties**: Partner managers cannot create contracts by design
5. **Approval Workflow**: 
   - Contract Coordinator drafts → Contract Manager activates
   - Field Officer reports → Field Supervisor completes

---

## 🛠️ Troubleshooting

### "Permission denied" errors:
```bash
php artisan permission:cache-reset
php artisan cache:clear
```

### User can't see expected features:
1. Verify user role: Check in Users management
2. Check role permissions: Roles & Permissions page
3. Logout and login again to refresh permissions

### Need to reset accounts:
```bash
php artisan migrate:fresh --seed
```

---

**Last Updated:** November 18, 2025  
**System Version:** Vigour Seeds ERP v1.0
