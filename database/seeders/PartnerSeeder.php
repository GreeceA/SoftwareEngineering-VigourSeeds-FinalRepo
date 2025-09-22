<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PartnerSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('partners')->insert([
            [
                'partner_type' => 'individual',
                'name' => 'Juan Dela Cruz',
                'contact_person' => 'Juan Dela Cruz',
                'email' => 'juan@example.com',
                'phone' => '09171234567',
                'address' => 'Davao City',
                'registration_number' => null,
                'tax_id' => null,
                'notes' => 'Farmer partner',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'partner_type' => 'organization',
                'name' => 'AgriGrow Cooperative',
                'contact_person' => 'Maria Santos',
                'email' => 'agrigrow@example.com',
                'phone' => '09987654321',
                'address' => 'Tagum City',
                'registration_number' => 'REG-2025-001',
                'tax_id' => 'TIN-123456789',
                'notes' => 'Supplier of seeds and fertilizers',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'partner_type' => 'organization',
                'name' => 'GreenFields Inc.',
                'contact_person' => 'Pedro Lopez',
                'email' => 'greenfields@example.com',
                'phone' => '09281231234',
                'address' => 'Panabo City',
                'registration_number' => 'REG-2025-002',
                'tax_id' => 'TIN-987654321',
                'notes' => 'Distributor of pesticides',
                'status' => 'inactive',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
