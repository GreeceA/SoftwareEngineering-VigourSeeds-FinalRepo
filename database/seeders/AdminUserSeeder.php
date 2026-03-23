<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if admin user already exists (avoid conflicts)
        $existingAdmin = User::where('email', 'admin@vigourseeds.com')->first();
        
        if ($existingAdmin) {
            $this->command->info('⚠️  Admin user already exists: admin@vigourseeds.com');
            $this->command->info('   Updating existing admin with all permissions...');
            
            // Update existing admin with all permissions
            $adminRole = Role::where('name', 'admin')->first();
            if ($adminRole) {
                // Sync admin role with all permissions (including partner permissions)
                $allPermissions = Permission::all();
                $adminRole->syncPermissions($allPermissions);
                
                // Assign admin role to user
                $existingAdmin->syncRoles([$adminRole]);
                $this->command->info('✅ Existing admin assigned to admin role with all permissions');
            } else {
                // If no admin role exists, give all permissions directly
                $allPermissions = Permission::all();
                $existingAdmin->syncPermissions($allPermissions);
                $this->command->info('✅ Existing admin given all permissions directly');
            }
            
            // Clear permission cache
            app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
            
            $this->command->info('✅ Existing admin user updated successfully!');
            return;
        }

        // Create new admin user
        $adminUser = User::create([
            'first_name' => 'Admin',
            'last_name' => 'User',
            'email' => 'admin@vigourseeds.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'status' => 'active',
            'email_verified_at' => now(),
        ]);

        // Get the admin role (created by PermissionSeeder)
        $adminRole = Role::where('name', 'admin')->first();
        
        if ($adminRole) {
            // Ensure admin role has all permissions (including partner permissions)
            $allPermissions = Permission::all();
            $adminRole->syncPermissions($allPermissions);
            
            // Assign admin role to user
            $adminUser->assignRole($adminRole);
            $this->command->info('✅ Admin user assigned to admin role with all permissions');
        } else {
            // If no admin role exists, give all permissions directly
            $allPermissions = Permission::all();
            $adminUser->givePermissionTo($allPermissions);
            $this->command->info('✅ Admin user given all permissions directly');
        }

        // Clear permission cache
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $this->command->info('🎉 Admin account created successfully!');
        $this->command->info('📧 Email: admin@vigourseeds.com');
        $this->command->info('🔑 Password: admin123');
        $this->command->info('⚠️  Please change the password after first login!');
    }
}
