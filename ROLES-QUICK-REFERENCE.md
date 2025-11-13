# Quick Role Reference Table

## 🎭 All Roles at a Glance

| Role | Permission Count | Primary Function | Key Feature |
|------|------------------|------------------|-------------|
| 👑 **admin** | 41 | System Administrator | Full access to everything |
| 📋 **contract_manager** | 16 | Senior Contract Control | Can activate contracts ⭐ |
| 📝 **contract_coordinator** | 8 | Junior Contract Control | Submit only (no activation) |
| 🤝 **partner_manager** | 6 | Partner Relationships | Full partner CRUD |
| 📦 **inventory_manager** | 12 | Stock Management | Create partner orders ⭐ |
| 🏭 **warehouse_staff** | 4 | Transaction Recording | Log transactions only |
| 🌱 **seed_manager** | 6 | Seed Catalog | Manage seed specifications |
| 🚜 **field_officer** | 5 | Farm Inspections | Create reports (no completion) |
| 👨‍🌾 **field_supervisor** | 7 | Senior Field Control | Complete field visits ⭐ |
| 👤 **employee** | 0 | Base Role | No permissions (safe default) |

---

## 📊 Permission Distribution by Module

### User Management (4 permissions)
- ✅ admin

### Role & Permission Management (5 permissions)
- ✅ admin

### Partners (4 permissions)
| Permission | Admin | Partner Mgr | Contract Mgr | Contract Coord | Inventory Mgr |
|------------|-------|-------------|--------------|----------------|---------------|
| view partners | ✅ | ✅ | ✅ | ✅ | ✅ |
| create partners | ✅ | ✅ | ❌ | ❌ | ❌ |
| edit partners | ✅ | ✅ | ❌ | ❌ | ❌ |
| archive partners | ✅ | ✅ | ❌ | ❌ | ❌ |

### Seeds (4 permissions)
| Permission | Admin | Seed Mgr | Contract Mgr | Contract Coord | Inventory Mgr | Warehouse Staff |
|------------|-------|----------|--------------|----------------|---------------|-----------------|
| view seeds | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| create seeds | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| edit seeds | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| archive seeds | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

### Items (4 permissions)
| Permission | Admin | Inventory Mgr | Contract Mgr | Contract Coord | Warehouse Staff |
|------------|-------|---------------|--------------|----------------|-----------------|
| view items | ✅ | ✅ | ✅ | ✅ | ✅ |
| create items | ✅ | ✅ | ❌ | ❌ | ❌ |
| edit items | ✅ | ✅ | ❌ | ❌ | ❌ |
| archive items | ✅ | ✅ | ❌ | ❌ | ❌ |

### Contracts (10 permissions)
| Permission | Admin | Contract Mgr | Contract Coord |
|------------|-------|--------------|----------------|
| view contracts | ✅ | ✅ | ✅ |
| create contracts | ✅ | ✅ | ✅ |
| edit contracts | ✅ | ✅ | ✅ |
| delete contracts | ✅ | ✅ | ❌ |
| submit contract for review | ✅ | ✅ | ✅ |
| **activate contract** | ✅ | ✅ | ❌ |
| suspend contract | ✅ | ✅ | ❌ |
| terminate contract | ✅ | ✅ | ❌ |
| complete contract | ✅ | ✅ | ❌ |
| cancel contract | ✅ | ✅ | ❌ |

### Inventory (5 permissions)
| Permission | Admin | Inventory Mgr | Warehouse Staff |
|------------|-------|---------------|-----------------|
| view inventory | ✅ | ✅ | ✅ |
| create inventory | ✅ | ✅ | ✅ |
| create partner order | ✅ | ✅ | ❌ |
| fulfill partner order | ✅ | ✅ | ❌ |
| record buyback transaction | ✅ | ✅ | ❌ |

### Field Visits (5 permissions)
| Permission | Admin | Field Supervisor | Field Officer | Contract Mgr |
|------------|-------|------------------|---------------|--------------|
| view field visit | ✅ | ✅ | ✅ | ✅ |
| create field visit | ✅ | ✅ | ✅ | ✅ |
| edit field visit | ✅ | ✅ | ✅ | ❌ |
| **complete field visit** | ✅ | ✅ | ❌ | ❌ |
| cancel field visit | ✅ | ✅ | ❌ | ❌ |

---

## 🔄 Approval Workflows

### Contract Workflow
```
Contract Coordinator creates draft
        ↓
Submit for Review
        ↓
Contract Manager activates ⭐
        ↓
Contract becomes binding
```

### Field Visit Workflow
```
Field Officer creates visit & reports
        ↓
Add growth/damage reports
        ↓
Field Supervisor reviews & completes ⭐
        ↓
Visit becomes permanent record
```

### Inventory Workflow
```
Warehouse Staff logs transactions
        ↓
Inventory Manager reviews stock
        ↓
Creates partner orders
        ↓
Fulfills orders
```

---

## 🎯 Common Role Combinations (Don't Do This!)

❌ **Never combine these roles on one user**:
- Contract Manager + Partner Manager (conflict of interest)
- Contract Coordinator + Contract Manager (defeats approval workflow)
- Field Officer + Field Supervisor (defeats quality control)
- Warehouse Staff + Inventory Manager (no separation of duties)

✅ **Safe combinations**:
- Seed Manager + Field Supervisor (agricultural expertise)
- Partner Manager + Field Supervisor (relationship + oversight)
- Contract Coordinator + Field Officer (junior roles)

---

## 📞 Role Assignment Decision Tree

```
NEW EMPLOYEE
    │
    ├─ Administrative? → admin
    │
    ├─ Contract Work?
    │   ├─ Senior? → contract_manager
    │   └─ Junior? → contract_coordinator
    │
    ├─ Partner Relations? → partner_manager
    │
    ├─ Inventory Work?
    │   ├─ Manager? → inventory_manager
    │   └─ Worker? → warehouse_staff
    │
    ├─ Seed Specialist? → seed_manager
    │
    ├─ Field Work?
    │   ├─ Supervisor? → field_supervisor
    │   └─ Officer? → field_officer
    │
    └─ Unsure? → employee (assign permissions later)
```

---

**Generated**: November 13, 2025  
**Total Permissions**: 41  
**Total Roles**: 10
