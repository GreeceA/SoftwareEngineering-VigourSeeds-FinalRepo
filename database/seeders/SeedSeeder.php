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
                'growth_cycle' => '90-120 days',
                'storage_requirements' => 'Cool, dry place',
                'soil_type_preference' => 'Loam or clay loam',
                'notes' => 'Adaptable to local conditions; farmers can save seeds for future planting seasons.'
            ],

            // --- DA-Accredited Hybrids ---
            [
                'seed_variety' => 'KK168',
                'status' => 'active',
                'price_per_unit' => 2.80,
                'growth_cycle' => '100-110 days',
                'storage_requirements' => 'Cool, dry place',
                'soil_type_preference' => 'Loam',
                'notes' => 'High-yielding hybrid variety recognized by the Department of Agriculture.'
            ],
            [
                'seed_variety' => 'Teosinte 200',
                'status' => 'active',
                'price_per_unit' => 3.00,
                'growth_cycle' => '100-115 days',
                'storage_requirements' => 'Cool, dry place',
                'soil_type_preference' => 'Clay loam',
                'notes' => 'Government-approved hybrid known for strong growth performance.'
            ],

            // --- Newly Developed Hybrids ---
            [
                'seed_variety' => 'Maize D30',
                'status' => 'active',
                'price_per_unit' => 3.20,
                'growth_cycle' => '95-105 days',
                'storage_requirements' => 'Cool, dry place',
                'soil_type_preference' => 'Loam',
                'notes' => 'Advanced breeding; improved resilience and higher yield.'
            ],
            [
                'seed_variety' => 'Maiswerte',
                'status' => 'active',
                'price_per_unit' => 3.10,
                'growth_cycle' => '100-110 days',
                'storage_requirements' => 'Cool, dry place',
                'soil_type_preference' => 'Sandy loam',
                'notes' => 'Better adaptability to varying environmental conditions.'
            ],
            [
                'seed_variety' => 'Mais-tisa',
                'status' => 'active',
                'price_per_unit' => 3.15,
                'growth_cycle' => '105-115 days',
                'storage_requirements' => 'Cool, dry place',
                'soil_type_preference' => 'Loam',
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
