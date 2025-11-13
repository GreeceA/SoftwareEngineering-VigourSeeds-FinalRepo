# 🔐 Roles & Permissions Guide
**Vigour Seeds Agricultural ERP System**

## 📊 System Overview

- **Total Roles**: 10
- **Total Permissions**: 41
- **Architecture**: Role-Based Access Control (RBAC) with Separation of Duties

---

## 🎭 Role Definitions

### 1. 👑 **ADMIN** (Super Administrator)
**Permission Count**: 41 (ALL)

**Purpose**: System administrators and business owners with complete control

**Access**:
- ✅ Full access to all system features
- ✅ User management (create, edit, deactivate)
- ✅ Role and permission management
- ✅ All business modules (partners, contracts, inventory, field visits)
- ✅ Complete contract lifecycle control
- ✅ Full inventory operations

**Use Cases**:
- System configuration and maintenance
- Emergency access and recovery
- High-level business decisions
- Security and compliance management

---

### 2. 📋 **CONTRACT MANAGER** (Senior Contract Control)
**Permission Count**: 16

**Purpose**: Senior staff managing complete contract lifecycle

**Permissions**:

**Contracts (Full Control)**:
- ✅ view contracts
- ✅ create contracts
- ✅ edit contracts
- ✅ delete contracts
- ✅ submit contract for review
- ✅ activate contract ⭐
- ✅ suspend contract
- ✅ terminate contract
- ✅ complete contract
- ✅ cancel contract

**Read-Only Access**:
- ✅ view partners (see partner info for contracts)
- ✅ view seeds (access seed catalog for commitments)
- ✅ view items (check available products)
- ✅ view inventory (monitor stock levels)

**Field Visits**:
- ✅ view field visit (monitor farm activities)
- ✅ create field visit (schedule inspections)

**Key Capabilities**:
- Can draft, submit, activate, and complete contracts
- Cannot modify partner/seed data (read-only to prevent conflicts)
- Can schedule field visits for contract monitoring
- Full authority over contract status changes

**Separation of Duties**: Cannot edit partners or seeds to ensure data integrity and prevent self-dealing

---

### 3. 📝 **CONTRACT COORDINATOR** (Junior Contract Control)
**Permission Count**: 8

**Purpose**: Junior staff preparing contracts for senior approval

**Permissions**:

**Contracts (Limited)**:
- ✅ view contracts
- ✅ create contracts
- ✅ edit contracts (drafts only)
- ✅ submit contract for review ⭐
- ❌ Cannot activate/suspend/terminate/complete

**Read-Only Access**:
- ✅ view partners
- ✅ view seeds
- ✅ view items
- ✅ view field visit

**Key Capabilities**:
- Prepares contract drafts
- Submits for senior manager review
- Cannot execute binding agreements
- Perfect for training new contract staff

**Workflow**: Draft → Submit → (Senior Manager Activates)

---

### 4. 🤝 **PARTNER MANAGER** (Full Partner Control)
**Permission Count**: 6

**Purpose**: Relationship managers handling partner accounts

**Permissions**:

**Partners (Full Control)**:
- ✅ view partners
- ✅ create partners
- ✅ edit partners
- ✅ archive partners

**Read-Only Access**:
- ✅ view contracts (see partner agreements)
- ✅ view field visit (monitor partner farm activities)

**Key Capabilities**:
- Manages partner profiles, contacts, and farms
- Updates partner information
- Archives inactive partnerships
- Can view but not modify contracts

**Separation of Duties**: Cannot create/edit contracts to prevent conflicts of interest in partner relationships

---

### 5. 📦 **INVENTORY MANAGER** (Full Inventory Control)
**Permission Count**: 12

**Purpose**: Stock management and fulfillment operations

**Permissions**:

**Inventory (Full Control)**:
- ✅ view inventory
- ✅ create inventory (inbound/outbound/adjustments)
- ✅ create partner order ⭐
- ✅ fulfill partner order
- ✅ record buyback transaction

**Items (Full Control)**:
- ✅ view items
- ✅ create items
- ✅ edit items
- ✅ archive items

**Read-Only Access**:
- ✅ view seeds (track seed inventory)
- ✅ view partners (for partner orders)
- ✅ view contracts (for buyback fulfillment)

**Key Capabilities**:
- Records all inventory transactions
- Manages product catalog
- Creates and fulfills partner orders manually
- Tracks buyback deliveries from partners
- Handles stock adjustments and audits

---

### 6. 🏭 **WAREHOUSE STAFF** (Transaction Recording Only)
**Permission Count**: 4

**Purpose**: Frontline staff recording daily transactions

**Permissions**:

**Inventory (Recording Only)**:
- ✅ view inventory
- ✅ create inventory (log transactions)

**Read-Only Access**:
- ✅ view items
- ✅ view seeds

**Key Capabilities**:
- Records inbound/outbound transactions
- Logs stock receipts and shipments
- Cannot modify product catalogs
- Cannot see business-sensitive partner orders

**Use Cases**: Warehouse workers, receiving clerks, shipping staff

---

### 7. 🌱 **SEED MANAGER** (Seed Catalog Specialist)
**Permission Count**: 6

**Purpose**: Agricultural specialist managing seed products

**Permissions**:

**Seeds (Full Control)**:
- ✅ view seeds
- ✅ create seeds
- ✅ edit seeds (pricing, growth cycle, soil type)
- ✅ archive seeds

**Read-Only Access**:
- ✅ view contracts (see seed usage in agreements)
- ✅ view inventory (check seed stock levels)

**Key Capabilities**:
- Manages seed catalog and specifications
- Sets seed pricing and availability
- Defines growth cycles and soil compatibility
- Monitors seed demand through contracts

**Specialization**: Separate from general inventory for agricultural expertise

---

### 8. 🚜 **FIELD OFFICER** (Farm Inspections)
**Permission Count**: 5

**Purpose**: Field workers conducting farm visits and reporting

**Permissions**:

**Field Visits**:
- ✅ view field visit
- ✅ create field visit
- ✅ edit field visit
- ❌ Cannot complete field visit (supervisor only)

**Read-Only Access**:
- ✅ view contracts (see visit context)
- ✅ view partners (access farm locations)

**Key Capabilities**:
- Creates growth reports during visits
- Documents damage reports (pest/disease)
- Updates visit progress and observations
- Cannot finalize visits (requires supervisor approval)

**Workflow**: Create Visit → Add Reports → (Supervisor Completes)

---

### 9. 👨‍🌾 **FIELD SUPERVISOR** (Senior Field Control)
**Permission Count**: 7

**Purpose**: Senior field staff with completion authority

**Permissions**:

**Field Visits (Full Control)**:
- ✅ view field visit
- ✅ create field visit
- ✅ edit field visit
- ✅ complete field visit ⭐
- ✅ cancel field visit

**Read-Only Access**:
- ✅ view contracts
- ✅ view partners

**Key Capabilities**:
- Reviews field officer reports
- Finalizes and locks completed visits
- Cancels visits when necessary
- Ensures quality control before completion
- Approves field officer work

**Quality Control**: Prevents premature visit completion, ensures accurate reporting

---

### 10. 👤 **EMPLOYEE** (Base Role)
**Permission Count**: 0

**Purpose**: Default role for new users and custom assignments

**Permissions**: NONE (by default)

**Key Capabilities**:
- Access to dashboard
- Can view and edit own profile
- Can change own password
- Can update own avatar

**Use Cases**:
- New hires awaiting role assignment
- Temporary staff
- Custom permission assignments by admin
- Safe default with no system access

---

## 🔒 Separation of Duties Matrix

| **Action** | Admin | Contract Mgr | Contract Coord | Partner Mgr | Inventory Mgr | Field Supervisor |
|------------|-------|--------------|----------------|-------------|---------------|------------------|
| Create Contract | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Submit for Review | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Activate Contract** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Edit Partner | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| View Partner | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create Inbound | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Edit Seeds | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Complete Field Visit** | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Create Partner Order | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |

---

## 🎯 Best Practices Implemented

### 1. **Least Privilege Principle**
Each role has only the minimum permissions needed for their job function.

### 2. **Separation of Duties**
- Contract creators ≠ Contract approvers
- Partner managers cannot create contracts
- Field officers cannot complete visits
- Warehouse staff cannot modify catalogs

### 3. **Read-Only Cross-Department Access**
Roles can VIEW related data without EDIT permissions:
- Contract Manager can view partners but not edit
- Inventory Manager can view contracts but not modify
- Seed Manager can view contracts to understand demand

### 4. **Approval Workflows**
- Junior roles prepare → Senior roles approve
- Contract Coordinator → Contract Manager
- Field Officer → Field Supervisor

### 5. **Specialization**
- Dedicated roles for specific domains (seeds, inventory, field work)
- Agricultural expertise separated from general inventory
- Partner relationship management isolated from contract execution

### 6. **Audit Trail**
Different roles = clear responsibility tracking
- Who created the contract?
- Who activated it?
- Who completed the field visit?

---

## 📝 Role Assignment Guidelines

### For New Employees:
1. Start with `employee` role (no permissions)
2. Assess job function and responsibilities
3. Assign appropriate role based on duties
4. Monitor and adjust as needed

### For Existing Staff:
1. Review current responsibilities
2. Match to role descriptions above
3. Consider promotion paths:
   - `contract_coordinator` → `contract_manager`
   - `field_officer` → `field_supervisor`
   - `warehouse_staff` → `inventory_manager`

### For Contractors/Temporary Staff:
1. Use `employee` role
2. Add specific permissions individually
3. Remove permissions when contract ends

---

## 🔄 Permission Updates

To add new permissions:
1. Update `PermissionSeeder.php`
2. Run: `php artisan db:seed --class=PermissionSeeder`
3. Update `RolePermissionSeeder.php` to assign to roles
4. Run: `php artisan db:seed --class=RolePermissionSeeder`
5. Clear permission cache: `php artisan permission:cache-reset`

---

## 🚀 Quick Commands

```bash
# Seed all roles and permissions
php artisan db:seed --class=RolePermissionSeeder

# View all roles
php artisan tinker --execute="Spatie\Permission\Models\Role::all()->pluck('name')"

# View permissions for a specific role
php artisan tinker --execute="Spatie\Permission\Models\Role::findByName('contract_manager')->permissions->pluck('name')"

# Assign role to user
php artisan tinker --execute="App\Models\User::find(1)->assignRole('contract_manager')"

# Clear permission cache
php artisan permission:cache-reset
```

---

## ⚠️ Security Notes

1. **Admin Role**: Protect admin accounts with strong passwords and 2FA
2. **Regular Audits**: Review role assignments quarterly
3. **Least Privilege**: When in doubt, start with fewer permissions
4. **Separation of Duties**: Never combine conflicting roles on one user
5. **Documentation**: Keep this guide updated as system evolves

---

**Last Updated**: November 13, 2025  
**System Version**: Vigour Seeds ERP v1.0  
**Seeder**: `database/seeders/RolePermissionSeeder.php`
