<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class BasicUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure the employee role exists and has no permissions
        $employeeRole = Role::firstOrCreate(['name' => 'employee']);
        $employeeRole->syncPermissions([]); // explicitly no permissions

        // Ensure admin role exists (keeps full permissions if you want)
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        // optionally sync admin permissions in PermissionSeeder instead

        // Create or normalize the basic employee account
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

        // Ensure the employee user has the employee role and no permissions (Spatie)
        if (method_exists($employeeUser, 'syncPermissions')) {
            $employeeUser->syncPermissions([]);
        }
        if (method_exists($employeeUser, 'syncRoles')) {
            $employeeUser->syncRoles(['employee']);
        }

        // Convert any users in roles 'manager' or 'testuser' (or extra admins) to 'employee'
        $rolesToConvert = ['manager', 'testuser'];
        $usersToConvert = User::whereHas('roles', function ($q) use ($rolesToConvert) {
            $q->whereIn('name', $rolesToConvert);
        })->get();

        foreach ($usersToConvert as $u) {
            $u->role = 'employee';
            if (method_exists($u, 'syncPermissions')) {
                $u->syncPermissions([]);
            }
            if (method_exists($u, 'syncRoles')) {
                $u->syncRoles(['employee']);
            }
            $u->save();
        }

        // Downgrade any other admins (keep admin@vigourseeds.com only)
        $adminEmail = 'admin@vigourseeds.com';
        $otherAdmins = User::whereHas('roles', function ($q) {
            $q->where('name', 'admin');
        })->where('email', '!=', $adminEmail)->get();

        foreach ($otherAdmins as $other) {
            $other->role = 'employee';
            if (method_exists($other, 'syncPermissions')) {
                $other->syncPermissions([]);
            }
            if (method_exists($other, 'syncRoles')) {
                $other->syncRoles(['employee']);
            }
            $other->save();
        }

        $this->command->info('🎯 Basic users seeded/normalized: only admin + employee roles present; employees have no permissions.');
    }
}
