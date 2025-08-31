<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\Hash;

class TestUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a manager user with some permissions
        $managerUser = User::firstOrCreate(
            ['email' => 'manager@vigourseeds.com'],
            [
                'first_name' => 'Manager',
                'last_name' => 'Test',
                'email' => 'manager@vigourseeds.com',
                'password' => Hash::make('manager123'),
                'role' => 'manager',
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );

        // Give manager some permissions (not all)
        $managerPermissions = [
            'view users',
            'create users',
            'edit users',
            'view roles',
        ];
        $managerUser->givePermissionTo($managerPermissions);

        // Create an employee user with minimal permissions
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

        // Give employee minimal permissions
        $employeePermissions = [
            'view users',
        ];
        $employeeUser->givePermissionTo($employeePermissions);

        $this->command->info('🎯 Test users created successfully!');
        $this->command->info('');
        $this->command->info('👔 Manager Account:');
        $this->command->info('   📧 Email: manager@vigourseeds.com');
        $this->command->info('   🔑 Password: manager123');
        $this->command->info('   🔓 Permissions: view users, create users, edit users, view roles');
        $this->command->info('');
        $this->command->info('👤 Employee Account:');
        $this->command->info('   📧 Email: employee@vigourseeds.com');
        $this->command->info('   🔑 Password: employee123');
        $this->command->info('   🔓 Permissions: view users only');
    }
}
