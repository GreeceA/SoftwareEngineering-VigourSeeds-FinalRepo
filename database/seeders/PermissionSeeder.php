<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear cached permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // User Management Permissions (PROTECTED - cannot be deleted)
        $userPermissions = [
            'view users',
            'create users',
            'edit users',
            'deactivate users',
        ];

        // Role & Permission Management (PROTECTED - cannot be deleted)
        $rolePermissions = [
            'view roles',
            'create roles',
            'edit roles',
            'delete roles',
        ];

        $permissionPermissions = [
            'view permissions'
        ];

        // Partner Management Permissions (PROTECTED - cannot be deleted)
        $partnerPermissions = [
            'view partners',
            'create partners',
            'edit partners',
            'archive partners',
        ];

        // Seed Management Permissions (PROTECTED - cannot be deleted)
        $seedPermissions = [
            'view seeds',
            'create seeds',
            'edit seeds',
            'archive seeds',
        ];

        // Item Management Permissions (PROTECTED - cannot be deleted)
        $itemPermissions = [
            'view items',
            'create items',
            'edit items',
            'archive items',
        ];

        // Contract Management Permissions (PROTECTED - cannot be deleted)
        $contractPermissions = [
            'view contracts',
            'create contracts',
            'edit contracts',
            'delete contracts',
        ];

        // Inventory Management Permissions (PROTECTED - cannot be deleted)
        $inventoryPermissions = [
            'view inventory',
            'create inventory',
        ];

        // Field Visit Management Permissions (PROTECTED - cannot be deleted)
        $fieldVisitPermissions = [
            'view field visit',
            'create field visit',
            'edit field visit',
        ];

        // Combine all permissions
        $allPermissions = array_merge(
            $userPermissions,
            $rolePermissions,
            $permissionPermissions,
            $partnerPermissions,
            $seedPermissions,
            $itemPermissions,
            $contractPermissions,
            $inventoryPermissions,
            $fieldVisitPermissions
        );

        // Create all permissions if they don't exist
        foreach ($allPermissions as $permission) {
            Permission::firstOrCreate(
                ['name' => $permission],
                ['guard_name' => 'web']
            );
        }

        // Create core roles if they don't exist (PROTECTED - cannot be deleted)
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $employeeRole = Role::firstOrCreate(['name' => 'employee']);

        // Give admin role ALL permissions
        $adminRole->syncPermissions($allPermissions);

        // Employee role has NO permissions by default
        $employeeRole->syncPermissions([]);

        $this->command->info('✅ All permissions created successfully!');
        $this->command->info('🔒 Admin role has all permissions');
        $this->command->info('👤 Employee role has no permissions (assign as needed)');
    }
}
