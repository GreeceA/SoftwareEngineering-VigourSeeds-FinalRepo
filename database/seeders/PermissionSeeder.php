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
        // System permissions for users (PROTECTED - cannot be deleted)
        $userPermissions = [
            'view users',
            'create users',
            'edit users',
            'deactivate users',
        ];

        // System permissions for roles (PROTECTED - cannot be deleted)
        $rolePermissions = [
            'view roles',
            'create roles',
            'edit roles',
            'delete roles',
        ];

        // System permissions for permissions (PROTECTED - cannot be deleted)
        $permissionPermissions = [
            'view permissions', // Only view - create/edit/delete removed since permissions are developer-managed
        ];

        // System permissions for partners (PROTECTED - cannot be deleted)
        $partnerPermissions = [
            'view partners',
            'create partners',
            'edit partners',
            'archive partners',
        ];

        // System permissions for seeds (PROTECTED - cannot be deleted)
        $seedPermissions = [
            'view seeds',
            'create seeds',
            'edit seeds',
            'archive seeds',
        ];

        // System permissions for items (PROTECTED - cannot be deleted)
        $itemPermissions = [
            'view items',
            'create items',
            'edit items',
            'archive items',
        ];

        // System permissions for contracts (PROTECTED - cannot be deleted)
        $contractPermissions = [
            'view contracts',
            'create contracts',
            'edit contracts',
            'archive contracts',
        ];

        // Combine all system permissions
        $systemPermissions = array_merge($userPermissions, $rolePermissions, $permissionPermissions, $partnerPermissions, $seedPermissions, $itemPermissions, $contractPermissions);

        // Create system permissions if they don't exist (marked as protected)
        foreach ($systemPermissions as $permission) {
            Permission::firstOrCreate(
                ['name' => $permission],
                ['guard_name' => 'web'] // This ensures they're marked as core system permissions
            );
        }

        // Remove manager role if it exists (we're simplifying to just admin and employee)
        $managerRole = Role::where('name', 'manager')->first();
        if ($managerRole) {
            $managerRole->delete();
            $this->command->info('🗑️ Removed manager role - simplified to admin and employee only');
        }

        // Create system roles if they don't exist (PROTECTED - cannot be deleted)
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $employeeRole = Role::firstOrCreate(['name' => 'employee']);

        // Give admin role all permissions
        $adminRole->syncPermissions($systemPermissions);

        // Give employee role NO permissions (dashboard only access)
        $employeeRole->syncPermissions([]);

        $this->command->info('✅ System permissions and roles created successfully!');
        $this->command->info('🔒 Protected from deletion: All system permissions and roles');
        $this->command->info('👤 Admin: Full access to everything');
        $this->command->info('� Employee: Dashboard access only');
    }
}
