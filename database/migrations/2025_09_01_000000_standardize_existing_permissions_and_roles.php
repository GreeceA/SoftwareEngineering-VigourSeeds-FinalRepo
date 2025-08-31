<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Models\User;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First, ensure Spatie permission tables exist
        if (!Schema::hasTable('permissions')) {
            // This will be handled by Spatie's own migrations
            $this->command->warn('Spatie permission tables not found. Please run: php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"');
            return;
        }

        // Handle existing permission name conflicts
        $this->handlePermissionConflicts();
        
        // Handle existing role conflicts
        $this->handleRoleConflicts();
        
        // Handle user conflicts
        $this->handleUserConflicts();
    }

    /**
     * Handle existing permission naming conflicts
     */
    private function handlePermissionConflicts()
    {
        // Rename old permission names to new standardized names
        $permissionMapping = [
            'delete users' => 'deactivate users',
            'remove users' => 'deactivate users',
            'view user' => 'view users',
            'create user' => 'create users',
            'edit user' => 'edit users',
            'view role' => 'view roles',
            'create role' => 'create roles',
            'edit role' => 'edit roles',
            'delete role' => 'delete roles',
            'view permission' => 'view permissions',
            'create permission' => 'create permissions',
            'edit permission' => 'edit permissions',
            'delete permission' => 'delete permissions',
        ];

        foreach ($permissionMapping as $oldName => $newName) {
            $oldPermission = Permission::where('name', $oldName)->first();
            $newPermission = Permission::where('name', $newName)->first();

            if ($oldPermission && !$newPermission) {
                $oldPermission->update(['name' => $newName]);
                $this->command->info("Renamed permission: '{$oldName}' → '{$newName}'");
            } elseif ($oldPermission && $newPermission) {
                // Merge permissions: move all relationships from old to new
                $oldPermission->roles()->detach();
                $oldPermission->users()->detach();
                $oldPermission->delete();
                $this->command->info("Removed duplicate permission: '{$oldName}'");
            }
        }
    }

    /**
     * Handle existing role conflicts
     */
    private function handleRoleConflicts()
    {
        // Rename common role variations to standard names
        $roleMapping = [
            'administrator' => 'admin',
            'super_admin' => 'admin',
            'superadmin' => 'admin',
            'user' => 'employee',
            'member' => 'employee',
            'staff' => 'employee',
        ];

        foreach ($roleMapping as $oldName => $newName) {
            $oldRole = Role::where('name', $oldName)->first();
            $newRole = Role::where('name', $newName)->first();

            if ($oldRole && !$newRole) {
                $oldRole->update(['name' => $newName]);
                $this->command->info("Renamed role: '{$oldName}' → '{$newName}'");
            } elseif ($oldRole && $newRole) {
                // Merge roles: move all users from old to new
                foreach ($oldRole->users as $user) {
                    $user->removeRole($oldRole);
                    $user->assignRole($newRole);
                }
                $oldRole->delete();
                $this->command->info("Merged role: '{$oldName}' into '{$newName}'");
            }
        }
    }

    /**
     * Handle existing user conflicts
     */
    private function handleUserConflicts()
    {
        $testEmails = [
            'admin@vigourseeds.com',
            'manager@vigourseeds.com', 
            'employee@vigourseeds.com'
        ];

        foreach ($testEmails as $email) {
            $existingUser = User::where('email', $email)->first();
            if ($existingUser) {
                $backupEmail = str_replace('@', '_backup@', $email);
                $existingUser->update(['email' => $backupEmail]);
                $this->command->info("Backed up existing user: '{$email}' → '{$backupEmail}'");
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // This migration doesn't need to be reversed
        // as it only standardizes existing data
    }
};
