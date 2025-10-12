<?php

namespace Database\Seeders;

use App\Models\Seed;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon; 

class SeedSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('seeds')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $now = Carbon::now();

        $seeds = [
            //  OPV (Active)
            [
                'seed_variety'         => 'Open-Pollinated Varieties (OPV)',
                'status'               => 'active',
                'price_per_unit'       => 1.50,
                'growth_cycle'         => 105,
                'storage_requirements' => 'Cool, dry place',
                'soil_type'            => 'clay', 
                'notes'                => 'Adaptable to local conditions; farmers can save seeds for future planting seasons.',
                'created_at'           => $now,
                'updated_at'           => $now,
            ],

            //  DA-Accredited Hybrids Active)
            [
                'seed_variety'         => 'KK168',
                'status'               => 'active',
                'price_per_unit'       => 2.80,
                'growth_cycle'         => 110,
                'storage_requirements' => 'Cool, dry place',
                'soil_type'            => 'loam',
                'notes'                => 'High-yielding hybrid variety recognized by the Department of Agriculture.',
                'created_at'           => $now,
                'updated_at'           => $now,
            ],
            [
                'seed_variety'         => 'Teosinte 200',
                'status'               => 'active',
                'price_per_unit'       => 3.00,
                'growth_cycle'         => 115,
                'storage_requirements' => 'Cool, dry place',
                'soil_type'            => 'clay',
                'notes'                => 'Government-approved hybrid known for strong growth performance.',
                'created_at'           => $now,
                'updated_at'           => $now,
            ],

            //  Newly Developed Hybrids (Active)
            [
                'seed_variety'         => 'Maize D30',
                'status'               => 'active',
                'price_per_unit'       => 3.20,
                'growth_cycle'         => 100,
                'storage_requirements' => 'Cool, dry place',
                'soil_type'            => 'loam',
                'notes'                => 'Advanced breeding; improved resilience and higher yield.',
                'created_at'           => $now,
                'updated_at'           => $now,
            ],
            [
                'seed_variety'         => 'Maiswerte',
                'status'               => 'active',
                'price_per_unit'       => 3.10,
                'growth_cycle'         => 108,
                'storage_requirements' => 'Cool, dry place',
                'soil_type'            => 'sandy',
                'notes'                => 'Better adaptability to varying environmental conditions.',
                'created_at'           => $now,
                'updated_at'           => $now,
            ],
            [
                'seed_variety'         => 'Mais-tisa',
                'status'               => 'active',
                'price_per_unit'       => 3.15,
                'growth_cycle'         => 112,
                'storage_requirements' => 'Cool, dry place',
                'soil_type'            => 'loam',
                'notes'                => 'Unique hybrid aimed at optimizing productivity for local farmers.',
                'created_at'           => $now,
                'updated_at'           => $now,
            ],

            // Additional Active Seeds
            [
                'seed_variety'         => 'Golden Harvest 45',
                'status'               => 'active',
                'price_per_unit'       => 2.95,
                'growth_cycle'         => 95,
                'storage_requirements' => 'Cool, dry place away from direct sunlight',
                'soil_type'            => 'loam',
                'notes'                => 'Early maturing variety with excellent drought tolerance.',
                'created_at'           => $now,
                'updated_at'           => $now,
            ],
            [
                'seed_variety'         => 'Premium Yellow',
                'status'               => 'active',
                'price_per_unit'       => 3.25,
                'growth_cycle'         => 118,
                'storage_requirements' => 'Cool, dry place',
                'soil_type'            => 'clay',
                'notes'                => 'High-quality yellow corn with superior grain quality.',
                'created_at'           => $now,
                'updated_at'           => $now,
            ],
            [
                'seed_variety'         => 'Super Sweet 78',
                'status'               => 'active',
                'price_per_unit'       => 3.40,
                'growth_cycle'         => 85,
                'storage_requirements' => 'Refrigerated storage recommended',
                'soil_type'            => 'sandy',
                'notes'                => 'Sweet corn variety with high sugar content and tender kernels.',
                'created_at'           => $now,
                'updated_at'           => $now,
            ],
            [
                'seed_variety'         => 'DroughtMaster Pro',
                'status'               => 'active',
                'price_per_unit'       => 2.85,
                'growth_cycle'         => 120,
                'storage_requirements' => 'Cool, dry place',
                'soil_type'            => 'sandy',
                'notes'                => 'Specifically bred for arid regions with limited water availability.',
                'created_at'           => $now,
                'updated_at'           => $now,
            ],
            [
                'seed_variety'         => 'Tropical Giant',
                'status'               => 'active',
                'price_per_unit'       => 3.10,
                'growth_cycle'         => 125,
                'storage_requirements' => 'Cool, dry place with good ventilation',
                'soil_type'            => 'loam',
                'notes'                => 'Tall variety with large ears, suitable for tropical climates.',
                'created_at'           => $now,
                'updated_at'           => $now,
            ],
            [
                'seed_variety'         => 'QuickGrow 60',
                'status'               => 'active',
                'price_per_unit'       => 2.75,
                'growth_cycle'         => 75,
                'storage_requirements' => 'Room temperature, dry environment',
                'soil_type'            => 'silty',
                'notes'                => 'Fast-growing variety ideal for multiple cropping systems.',
                'created_at'           => $now,
                'updated_at'           => $now,
            ],
            [
                'seed_variety'         => 'Organic Heirloom',
                'status'               => 'active',
                'price_per_unit'       => 4.20,
                'growth_cycle'         => 110,
                'storage_requirements' => 'Cool, dark place in airtight containers',
                'soil_type'            => 'loam',
                'notes'                => 'Certified organic, non-GMO heirloom variety.',
                'created_at'           => $now,
                'updated_at'           => $now,
            ],
            [
                'seed_variety'         => 'High-Yield Plus',
                'status'               => 'active',
                'price_per_unit'       => 3.55,
                'growth_cycle'         => 105,
                'storage_requirements' => 'Cool, dry place',
                'soil_type'            => 'clay',
                'notes'                => 'Maximum yield potential with proper fertilization and care.',
                'created_at'           => $now,
                'updated_at'           => $now,
            ],
            [
                'seed_variety'         => 'Pioneer 33',
                'status'               => 'active',
                'price_per_unit'       => 3.30,
                'growth_cycle'         => 98,
                'storage_requirements' => 'Cool, dry place',
                'soil_type'            => 'sandy',
                'notes'                => 'Reliable performer across various soil conditions.',
                'created_at'           => $now,
                'updated_at'           => $now,
            ],

            // Archived Seeds (5 seeds)
            [
                'seed_variety'         => 'Legacy Red',
                'status'               => 'archived',
                'price_per_unit'       => 2.50,
                'growth_cycle'         => 130,
                'storage_requirements' => 'Cool, dry place',
                'soil_type'            => 'clay',
                'notes'                => 'Traditional red corn variety, phased out for newer hybrids.',
                'created_at'           => $now,
                'updated_at'           => $now,
            ],
            [
                'seed_variety'         => 'Classic White',
                'status'               => 'archived',
                'price_per_unit'       => 2.30,
                'growth_cycle'         => 140,
                'storage_requirements' => 'Cool, dry place',
                'soil_type'            => 'loam',
                'notes'                => 'Older white corn variety, replaced by higher-yielding options.',
                'created_at'           => $now,
                'updated_at'           => $now,
            ],
            [
                'seed_variety'         => 'Heritage Blue',
                'status'               => 'archived',
                'price_per_unit'       => 2.80,
                'growth_cycle'         => 135,
                'storage_requirements' => 'Cool, dry place',
                'soil_type'            => 'silty',
                'notes'                => 'Blue corn variety, archived due to low market demand.',
                'created_at'           => $now,
                'updated_at'           => $now,
            ],
            [
                'seed_variety'         => 'Traditional Mix',
                'status'               => 'archived',
                'price_per_unit'       => 2.20,
                'growth_cycle'         => 128,
                'storage_requirements' => 'Cool, dry place',
                'soil_type'            => 'sandy',
                'notes'                => 'Mixed traditional varieties, consolidated into improved lines.',
                'created_at'           => $now,
                'updated_at'           => $now,
            ],
            [
                'seed_variety'         => 'Vintage Yellow',
                'status'               => 'archived',
                'price_per_unit'       => 2.40,
                'growth_cycle'         => 145,
                'storage_requirements' => 'Cool, dry place',
                'soil_type'            => 'clay',
                'notes'                => 'Original yellow corn, superseded by modern breeding techniques.',
                'created_at'           => $now,
                'updated_at'           => $now,
            ],
        ];

        DB::table('seeds')->insert($seeds);
    }
}