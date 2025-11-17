<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class TestAccountsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Creates test accounts for each role in the system
     */
    public function run(): void
    {
        $this->command->info('🔧 Creating test accounts for all roles...');

        // Test password for all accounts
        $password = Hash::make('password123');

        // 1. ADMIN - Full System Access
        $admin = User::firstOrCreate(
            ['email' => 'admin@vigourseeds.com'],
            [
                'first_name' => 'System',
                'last_name' => 'Administrator',
                'password' => $password,
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );
        $admin->syncRoles(['admin']);
        $this->command->info('✅ Admin account created: admin@vigourseeds.com');

        // 2. CONTRACT MANAGER - Full Contract Lifecycle + Field Visit + Buyback
        $contractManager = User::firstOrCreate(
            ['email' => 'contract.manager@vigourseeds.com'],
            [
                'first_name' => 'Marcus',
                'last_name' => 'Williams',
                'password' => $password,
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );
        $contractManager->syncRoles(['contract_manager']);
        $this->command->info('✅ Contract Manager account created: contract.manager@vigourseeds.com');

        // 3. CONTRACT COORDINATOR - Limited Contract Control
        $contractCoordinator = User::firstOrCreate(
            ['email' => 'contract.coordinator@vigourseeds.com'],
            [
                'first_name' => 'Sarah',
                'last_name' => 'Martinez',
                'password' => $password,
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );
        $contractCoordinator->syncRoles(['contract_coordinator']);
        $this->command->info('✅ Contract Coordinator account created: contract.coordinator@vigourseeds.com');

        // 4. PARTNER MANAGER - Full Partner Management + View Inventory
        $partnerManager = User::firstOrCreate(
            ['email' => 'partner.manager@vigourseeds.com'],
            [
                'first_name' => 'Michael',
                'last_name' => 'Anderson',
                'password' => $password,
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );
        $partnerManager->syncRoles(['partner_manager']);
        $this->command->info('✅ Partner Manager account created: partner.manager@vigourseeds.com');

        // 5. PARTNER VIEWER - Read-Only Partner Access
        $partnerViewer = User::firstOrCreate(
            ['email' => 'partner.viewer@vigourseeds.com'],
            [
                'first_name' => 'Lisa',
                'last_name' => 'Thompson',
                'password' => $password,
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );
        $partnerViewer->syncRoles(['partner_viewer']);
        $this->command->info('✅ Partner Viewer account created: partner.viewer@vigourseeds.com');

        // 6. INVENTORY MANAGER - Full Inventory Control
        $inventoryManager = User::firstOrCreate(
            ['email' => 'inventory.manager@vigourseeds.com'],
            [
                'first_name' => 'David',
                'last_name' => 'Chen',
                'password' => $password,
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );
        $inventoryManager->syncRoles(['inventory_manager']);
        $this->command->info('✅ Inventory Manager account created: inventory.manager@vigourseeds.com');

        // 7. WAREHOUSE STAFF - Transaction Recording Only
        $warehouseStaff = User::firstOrCreate(
            ['email' => 'warehouse.staff@vigourseeds.com'],
            [
                'first_name' => 'Carlos',
                'last_name' => 'Rodriguez',
                'password' => $password,
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );
        $warehouseStaff->syncRoles(['warehouse_staff']);
        $this->command->info('✅ Warehouse Staff account created: warehouse.staff@vigourseeds.com');

        // 8. SEED MANAGER - Seed Catalog Specialist
        $seedManager = User::firstOrCreate(
            ['email' => 'seed.manager@vigourseeds.com'],
            [
                'first_name' => 'Maria',
                'last_name' => 'Santos',
                'password' => $password,
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );
        $seedManager->syncRoles(['seed_manager']);
        $this->command->info('✅ Seed Manager account created: seed.manager@vigourseeds.com');

        // 9. FIELD OFFICER - Farm Inspections
        $fieldOfficer = User::firstOrCreate(
            ['email' => 'field.officer@vigourseeds.com'],
            [
                'first_name' => 'Robert',
                'last_name' => 'Taylor',
                'password' => $password,
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );
        $fieldOfficer->syncRoles(['field_officer']);
        $this->command->info('✅ Field Officer account created: field.officer@vigourseeds.com');

        // 10. FIELD SUPERVISOR - Senior Field Control
        $fieldSupervisor = User::firstOrCreate(
            ['email' => 'field.supervisor@vigourseeds.com'],
            [
                'first_name' => 'Jennifer',
                'last_name' => 'Brown',
                'password' => $password,
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );
        $fieldSupervisor->syncRoles(['field_supervisor']);
        $this->command->info('✅ Field Supervisor account created: field.supervisor@vigourseeds.com');

        // 11. EMPLOYEE - Base Role (No Permissions)
        $employee = User::firstOrCreate(
            ['email' => 'employee@vigourseeds.com'],
            [
                'first_name' => 'Alex',
                'last_name' => 'Johnson',
                'password' => $password,
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );
        $employee->syncRoles(['employee']);
        $this->command->info('✅ Employee account created: employee@vigourseeds.com');

        $this->command->info('');
        $this->command->info('🎉 All test accounts created successfully!');
        $this->command->info('');
        $this->command->info('📋 LOGIN CREDENTIALS (All passwords: password123):');
        $this->command->info('');
        $this->command->info('1️⃣  ADMIN (Full Access)');
        $this->command->info('    Email: admin@vigourseeds.com');
        $this->command->info('    Can: Everything');
        $this->command->info('');
        $this->command->info('2️⃣  CONTRACT MANAGER');
        $this->command->info('    Email: contract.manager@vigourseeds.com');
        $this->command->info('    Can: Full contract CRUD, field visit control, buyback transactions');
        $this->command->info('');
        $this->command->info('3️⃣  CONTRACT COORDINATOR');
        $this->command->info('    Email: contract.coordinator@vigourseeds.com');
        $this->command->info('    Can: Draft & submit contracts (no activation)');
        $this->command->info('');
        $this->command->info('4️⃣  PARTNER MANAGER');
        $this->command->info('    Email: partner.manager@vigourseeds.com');
        $this->command->info('    Can: Full partner CRUD, view contracts & inventory');
        $this->command->info('');
        $this->command->info('5️⃣  PARTNER VIEWER');
        $this->command->info('    Email: partner.viewer@vigourseeds.com');
        $this->command->info('    Can: View partners only (read-only)');
        $this->command->info('');
        $this->command->info('6️⃣  INVENTORY MANAGER');
        $this->command->info('    Email: inventory.manager@vigourseeds.com');
        $this->command->info('    Can: Full inventory, seeds, items CRUD');
        $this->command->info('');
        $this->command->info('7️⃣  WAREHOUSE STAFF');
        $this->command->info('    Email: warehouse.staff@vigourseeds.com');
        $this->command->info('    Can: Record inventory transactions only');
        $this->command->info('');
        $this->command->info('8️⃣  SEED MANAGER');
        $this->command->info('    Email: seed.manager@vigourseeds.com');
        $this->command->info('    Can: Full seed catalog management');
        $this->command->info('');
        $this->command->info('9️⃣  FIELD OFFICER');
        $this->command->info('    Email: field.officer@vigourseeds.com');
        $this->command->info('    Can: Create & edit field visits (no completion)');
        $this->command->info('');
        $this->command->info('🔟 FIELD SUPERVISOR');
        $this->command->info('    Email: field.supervisor@vigourseeds.com');
        $this->command->info('    Can: Full field visit control including completion');
        $this->command->info('');
        $this->command->info('1️⃣1️⃣  EMPLOYEE (Base Role)');
        $this->command->info('    Email: employee@vigourseeds.com');
        $this->command->info('    Can: No special permissions');
    }
}
