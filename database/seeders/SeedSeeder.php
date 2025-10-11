<?php

namespace Database\Seeders;

use App\Models\Seed;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SeedSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $seeds = [
            // --- OPV ---
            [
                'seed_variety' => 'Open-Pollinated Varieties (OPV)',
                'status' => 'active',
                'price_per_unit' => 1.50,
                'growth_cycle' => 105,
                'storage_requirements' => 'Cool, dry place',
                'soil_type' => 'Clay',
                'notes' => 'Adaptable to local conditions; farmers can save seeds for future planting seasons.'
            ],

            // --- DA-Accredited Hybrids ---
            [
                'seed_variety' => 'KK168',
                'status' => 'active',
                'price_per_unit' => 2.80,
                'growth_cycle' => 110,
                'storage_requirements' => 'Cool, dry place',
                'soil_type' => 'Loam',
                'notes' => 'High-yielding hybrid variety recognized by the Department of Agriculture.'
            ],
            [
                'seed_variety' => 'Teosinte 200',
                'status' => 'active',
                'price_per_unit' => 3.00,
                'growth_cycle' => 115,
                'storage_requirements' => 'Cool, dry place',
                'soil_type' => 'Clay',
                'notes' => 'Government-approved hybrid known for strong growth performance.'
            ],

            // --- Newly Developed Hybrids ---
            [
                'seed_variety' => 'Maize D30',
                'status' => 'active',
                'price_per_unit' => 3.20,
                'growth_cycle' => 100,
                'storage_requirements' => 'Cool, dry place',
                'soil_type' => 'Loam',
                'notes' => 'Advanced breeding; improved resilience and higher yield.'
            ],
            [
                'seed_variety' => 'Maiswerte',
                'status' => 'active',
                'price_per_unit' => 3.10,
                'growth_cycle' => 108,
                'storage_requirements' => 'Cool, dry place',
                'soil_type' => 'Sandy',
                'notes' => 'Better adaptability to varying environmental conditions.'
            ],
            [
                'seed_variety' => 'Mais-tisa',
                'status' => 'active',
                'price_per_unit' => 3.15,
                'growth_cycle' => 112,
                'storage_requirements' => 'Cool, dry place',
                'soil_type' => 'Loam',
                'notes' => 'Unique hybrid aimed at optimizing productivity for local farmers.'
            ],
        ];

        foreach ($seeds as $seed) {
            Seed::firstOrCreate(
                [
                    'seed_variety' => $seed['seed_variety'],
                ],
                $seed
            );
        }
    }
}
