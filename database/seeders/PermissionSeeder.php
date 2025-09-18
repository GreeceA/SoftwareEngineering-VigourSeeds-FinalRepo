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
        // Core permissions for users (PROTECTED - cannot be deleted)
        $userPermissions = [
            'view users',
            'create users',
            'edit users',
            'deactivate users',
        ];

        // Core permissions for roles (PROTECTED - cannot be deleted)
        $rolePermissions = [
            'view roles',
            'create roles',
            'edit roles',
            'delete roles',
        ];

        // Core permissions for permissions (PROTECTED - cannot be deleted)
        $permissionPermissions = [
            'view permissions',
            'create permissions',
            'edit permissions',
            'delete permissions',
        ];

        // Combine all core permissions
        $corePermissions = array_merge($userPermissions, $rolePermissions, $permissionPermissions);

        // Create core permissions if they don't exist (marked as protected)
        foreach ($corePermissions as $permission) {
            Permission::firstOrCreate(
                ['name' => $permission],
                ['guard_name' => 'web'] // This ensures they're marked as core system permissions
            );
        }

        // Create core roles if they don't exist (PROTECTED - cannot be deleted)
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $managerRole = Role::firstOrCreate(['name' => 'manager']);
        $employeeRole = Role::firstOrCreate(['name' => 'employee']);

        // Give admin role all permissions
        $adminRole->syncPermissions($corePermissions);

        // Give manager role some permissions
        $managerRole->syncPermissions([
            'view users', 'create users', 'edit users',
            'view roles'
        ]);

        // Give employee role minimal permissions
        $employeeRole->syncPermissions(['view users']);

        $this->command->info('✅ Core permissions and roles created successfully!');
        $this->command->info('🔒 Protected from deletion: All core permissions and roles');
    }
}
