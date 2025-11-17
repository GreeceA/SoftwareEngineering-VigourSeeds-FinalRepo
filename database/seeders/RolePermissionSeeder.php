<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Creates a comprehensive role-based access control system with separation of duties
     */
    public function run(): void
    {
        // Clear cached permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // ============================================
        // DEFINE ALL PERMISSIONS
        // ============================================

        // User Management Permissions
        $userPermissions = [
            'view users',
            'create users',
            'edit users',
            'deactivate users',
        ];

        // Role & Permission Management
        $rolePermissions = [
            'view roles',
            'create roles',
            'edit roles',
            'delete roles',
            'view permissions',
        ];

        // Partner Management Permissions
        $partnerPermissions = [
            'view partners',
            'create partners',
            'edit partners',
            'archive partners',
        ];

        // Seed Management Permissions
        $seedPermissions = [
            'view seeds',
            'create seeds',
            'edit seeds',
            'archive seeds',
        ];

        // Item Management Permissions
        $itemPermissions = [
            'view items',
            'create items',
            'edit items',
            'archive items',
        ];

        // Contract Management Permissions (Granular)
        $contractPermissions = [
            'view contracts',
            'create contracts',
            'edit contracts',
            'delete contracts',
            'submit contract for review',
            'activate contract',
            'suspend contract',
            'terminate contract',
            'complete contract',
            'cancel contract',
        ];

        // Inventory Management Permissions
        $inventoryPermissions = [
            'view inventory',
            'create inventory',
            'create partner order',
            'fulfill partner order',
            'record buyback transaction',
        ];

        // Field Visit Management Permissions (Granular)
        $fieldVisitPermissions = [
            'view field visit',
            'create field visit',
            'edit field visit',
            'complete field visit',
            'cancel field visit',
        ];

        // Combine all permissions
        $allPermissions = array_merge(
            $userPermissions,
            $rolePermissions,
            $partnerPermissions,
            $seedPermissions,
            $itemPermissions,
            $contractPermissions,
            $inventoryPermissions,
            $fieldVisitPermissions
        );

        // Create all permissions
        foreach ($allPermissions as $permission) {
            Permission::firstOrCreate(
                ['name' => $permission],
                ['guard_name' => 'web']
            );
        }

        // ============================================
        // CREATE ROLES WITH SPECIFIC PERMISSIONS
        // ============================================

        // 1. ADMIN - Full System Access
        $admin = Role::firstOrCreate(['name' => 'admin']);
        $admin->syncPermissions($allPermissions);

        // 2. CONTRACT MANAGER - Full Contract Lifecycle Management
        $contractManager = Role::firstOrCreate(['name' => 'contract_manager']);
        $contractManager->syncPermissions([
            // Full contract control
            'view contracts', 'create contracts', 'edit contracts', 'delete contracts',
            'submit contract for review', 'activate contract', 'suspend contract',
            'terminate contract', 'complete contract', 'cancel contract',
            // Read-only access to related entities
            'view partners', 'view seeds', 'view items',
            // Field visit control (can complete/cancel)
            'view field visit', 'create field visit', 'complete field visit', 'cancel field visit',
            // Inventory visibility and buyback control
            'view inventory', 'record buyback transaction',
        ]);

        // 3. CONTRACT COORDINATOR - Limited Contract Control (No Activation)
        $contractCoordinator = Role::firstOrCreate(['name' => 'contract_coordinator']);
        $contractCoordinator->syncPermissions([
            // Can draft and submit contracts
            'view contracts', 'create contracts', 'edit contracts',
            'submit contract for review',
            // Read-only access
            'view partners', 'view seeds', 'view items',
            'view field visit',
        ]);

        // 4. PARTNER MANAGER - Full Partner Management
        $partnerManager = Role::firstOrCreate(['name' => 'partner_manager']);
        $partnerManager->syncPermissions([
            // Full partner control
            'view partners', 'create partners', 'edit partners', 'archive partners',
            // Read-only to see partner agreements and inventory
            'view contracts',
            'view field visit',
            'view inventory',
        ]);

        // 5. INVENTORY MANAGER - Full Inventory & Stock Control
        $inventoryManager = Role::firstOrCreate(['name' => 'inventory_manager']);
        $inventoryManager->syncPermissions([
            // Full inventory control
            'view inventory', 'create inventory',
            'create partner order', 'fulfill partner order', 'record buyback transaction',
            // Full item catalog control
            'view items', 'create items', 'edit items', 'archive items',
            // Read-only access
            'view seeds', 'view partners', 'view contracts',
        ]);

        // 6. WAREHOUSE STAFF - Execution Only (Record Transactions)
        $warehouseStaff = Role::firstOrCreate(['name' => 'warehouse_staff']);
        $warehouseStaff->syncPermissions([
            // Can record transactions only
            'view inventory', 'create inventory',
            // Read-only product catalogs
            'view items', 'view seeds',
        ]);

        // 7. SEED MANAGER - Seed Catalog Specialist
        $seedManager = Role::firstOrCreate(['name' => 'seed_manager']);
        $seedManager->syncPermissions([
            // Full seed control
            'view seeds', 'create seeds', 'edit seeds', 'archive seeds',
            // Read-only to see usage
            'view contracts', 'view inventory',
        ]);

        // 8. FIELD OFFICER - Farm Inspections & Reporting
        $fieldOfficer = Role::firstOrCreate(['name' => 'field_officer']);
        $fieldOfficer->syncPermissions([
            // Can create and edit visits/reports
            'view field visit', 'create field visit', 'edit field visit',
            // Read-only context
            'view contracts', 'view partners',
        ]);

        // 9. FIELD SUPERVISOR - Senior Field Visit Control
        $fieldSupervisor = Role::firstOrCreate(['name' => 'field_supervisor']);
        $fieldSupervisor->syncPermissions([
            // Full field visit control including completion
            'view field visit', 'create field visit', 'edit field visit',
            'complete field visit', 'cancel field visit',
            // Read-only context
            'view contracts', 'view partners',
        ]);

        // 10. EMPLOYEE - Base Role (No Permissions)
        $employee = Role::firstOrCreate(['name' => 'employee']);
        $employee->syncPermissions([]);

        // 11. PARTNER VIEWER - Read-Only Partner Access
        $partnerViewer = Role::firstOrCreate(['name' => 'partner_viewer']);
        $partnerViewer->syncPermissions([
            // Read-only partner access
            'view partners',
        ]);

        $this->command->info('✅ All roles and permissions created successfully!');
        $this->command->info('');
        $this->command->info('📋 ROLES CREATED:');
        $this->command->info('   1. admin - Full system access');
        $this->command->info('   2. contract_manager - Full contract lifecycle + field visit control + buyback');
        $this->command->info('   3. contract_coordinator - Draft/submit only (no activation)');
        $this->command->info('   4. partner_manager - Full partner management + view inventory');
        $this->command->info('   5. inventory_manager - Full inventory + items control');
        $this->command->info('   6. warehouse_staff - Transaction recording only');
        $this->command->info('   7. seed_manager - Seed catalog specialist');
        $this->command->info('   8. field_officer - Farm inspections (no completion)');
        $this->command->info('   9. field_supervisor - Full field visit control');
        $this->command->info('  10. employee - Base role (no permissions)');
        $this->command->info('  11. partner_viewer - Read-only partner access');
    }
}
