<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class TestUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Remove any existing manager users (role no longer exists)
        $existingManager = User::where('email', 'manager@vigourseeds.com')->first();
        if ($existingManager) {
            $existingManager->delete();
            $this->command->info('🗑️ Removed existing manager test user (role no longer exists)');
        }

        // Create or update employee user with no permissions (dashboard only)
        $employeeUser = User::firstOrCreate(
            ['email' => 'employee@vigourseeds.com'],
            [
                'first_name' => 'Employee',
                'last_name' => 'Test',
                'email' => 'employee@vigourseeds.com',
                'password' => Hash::make('employee123'),
                'role' => 'employee',
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );

        // Always sync employee role (no permissions - dashboard only)
        $employeeRole = Role::where('name', 'employee')->first();
        if ($employeeRole) {
            $employeeUser->syncRoles([$employeeRole]);
            // Clear any direct permissions to use role-based only
            $employeeUser->permissions()->detach();
        }

        $this->command->info('🎯 Test users created successfully!');
        $this->command->info('');
        $this->command->info('� Employee Account:');
        $this->command->info('   📧 Email: employee@vigourseeds.com');
        $this->command->info('   🔑 Password: employee123');
        $this->command->info('   🔓 Access: Dashboard only (no other permissions)');
    }
}
