<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Seed;
use App\Models\Item;
use Carbon\Carbon;

class InventoryTransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Disable foreign key checks temporarily and clear the table
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('inventory_transactions')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $now = Carbon::now();
        $transactions = [];
        $creator_id = 1; // Assuming a user with ID 1 exists
        
        // --- Date Tracking ---
        // Start date for the oldest transaction (3 months ago)
        $baseDate = $now->copy()->subMonths(3); 
        $transactionCounter = 0; 
        
        // --- 1. SEEDS (18 Active Total | 17 with Transaction, 1 Skipped) ---
        $seedTransactions = [];
        $activeSeeds = Seed::active()->get(['id', 'seed_variety'])->pluck('id', 'seed_variety')->toArray();
        $skipSeedName = 'Open-Pollinated Varieties (OPV)'; // ID 1
        
        // --- A. Define Stock Levels for Seeds (3 Critical, 6 Low, 8 Good = 17 Total) ---
        
        // CRITICAL Stock (< 200 kg) (3)
        $seedTransactions['Super Sweet 78'] = ['qty' => 150.00, 'unit' => 'kg']; 
        $seedTransactions['QuickGrow 60'] = ['qty' => 180.00, 'unit' => 'kg']; 
        $seedTransactions['Pioneer 33'] = ['qty' => 195.00, 'unit' => 'kg']; 

        // LOW Stock (200 kg <= Stock < 700 kg) (6)
        $seedTransactions['Maize D30'] = ['qty' => 350.00, 'unit' => 'kg']; 
        $seedTransactions['Maiswerte'] = ['qty' => 450.00, 'unit' => 'kg'];
        $seedTransactions['Mais-tisa'] = ['qty' => 550.00, 'unit' => 'kg'];
        $seedTransactions['KK168'] = ['qty' => 600.00, 'unit' => 'kg'];
        $seedTransactions['High-Yield Plus'] = ['qty' => 650.00, 'unit' => 'kg'];
        $seedTransactions['Organic Heirloom'] = ['qty' => 250.00, 'unit' => 'kg'];

        // GOOD Stock (>= 700 kg) (8)
        $seedTransactions['Teosinte 200'] = ['qty' => 800.00, 'unit' => 'kg'];
        $seedTransactions['Premium Yellow'] = ['qty' => 1200.00, 'unit' => 'kg'];
        $seedTransactions['DroughtMaster Pro'] = ['qty' => 1.50, 'unit' => 'ton']; // 1500 kg
        $seedTransactions['Tropical Giant'] = ['qty' => 2.00, 'unit' => 'ton'];   // 2000 kg
        $seedTransactions['Legacy Red'] = ['qty' => 750.00, 'unit' => 'kg'];
        $seedTransactions['Traditional Mix'] = ['qty' => 900.00, 'unit' => 'kg'];
        $seedTransactions['Vintage Yellows'] = ['qty' => 1100.00, 'unit' => 'kg'];
        $seedTransactions['Cherry Tomatoes'] = ['qty' => 700.00, 'unit' => 'kg'];

        // --- B. Create Seed Transactions ---
        foreach ($seedTransactions as $name => $data) {
            if ($name === $skipSeedName) continue; // Skip the designated item

            $id = $activeSeeds[$name] ?? null;
            if ($id) {
                $transactionCounter++;
                $transactions[] = $this->createTransaction('Seed', $id, $data['qty'], $data['unit'], $baseDate, $transactionCounter, $creator_id);
            } else {
                 // Should not happen if previous seeders ran, but good for debugging
                echo "Warning: Seed '{$name}' not found or not active. Skipping.\n";
            }
        }

        // --- 2. FERTILIZERS (13 Active Total | 12 with Transaction, 1 Skipped) ---
        $fertTransactions = [];
        $activeFertilizers = Item::active()->fertilizers()->get(['id', 'name'])->pluck('id', 'name')->toArray();
        $skipFertName = 'Zinc Micronutrient Spray'; // ID 1
        
        // --- C. Define Stock Levels for Fertilizers (2 Critical, 3 Low, 7 Good = 12 Total) ---
        
        // CRITICAL Stock (< 200 base units) (2)
        $fertTransactions['Magnesium Sulfate (Epsom Salt)'] = ['qty' => 150.00, 'unit' => 'kg']; 
        $fertTransactions['Urea Fertilizer (46-0-0)'] = ['qty' => 180.00, 'unit' => 'kg']; 

        // LOW Stock (200 base units <= Stock < 700 base units) (3)
        $fertTransactions['Slow-Release Nitrogen Pellets'] = ['qty' => 350.00, 'unit' => 'kg'];
        $fertTransactions['Complete Fertilizer (14-14-14)'] = ['qty' => 500.00, 'unit' => 'kg'];
        $fertTransactions['Liquid Potassium Fertilizer'] = ['qty' => 650.00, 'unit' => 'liter'];
        
        // GOOD Stock (>= 700 base units) (7)
        $fertTransactions['Seaweed Extract Concentrate'] = ['qty' => 750.00, 'unit' => 'liter'];
        $fertTransactions['Foliar Feed Concentrate'] = ['qty' => 800.00, 'unit' => 'liter'];
        $fertTransactions['High Phosphate Bloom Booster'] = ['qty' => 1200.00, 'unit' => 'kg'];
        $fertTransactions['Organic Compost Tea'] = ['qty' => 1000.00, 'unit' => 'liter'];
        $fertTransactions['Calcium Nitrate Granules'] = ['qty' => 1500.00, 'unit' => 'kg'];
        $fertTransactions['Micronutrient Mix'] = ['qty' => 900.00, 'unit' => 'kg'];
        $fertTransactions['Liquid Organic Fertilizer'] = ['qty' => 700.00, 'unit' => 'liter'];

        // --- D. Create Fertilizer Transactions ---
        foreach ($fertTransactions as $name => $data) {
            if ($name === $skipFertName) continue;
            
            $id = $activeFertilizers[$name] ?? null;
            if ($id) {
                $transactionCounter++;
                $transactions[] = $this->createTransaction('item', $id, $data['qty'], $data['unit'], $baseDate, $transactionCounter, $creator_id);
            } else {
                echo "Warning: Fertilizer '{$name}' not found or not active. Skipping.\n";
            }
        }

        // --- 3. PESTICIDES (12 Active Total | 11 with Transaction, 1 Skipped) ---
        $pestiTransactions = [];
        $activePesticides = Item::active()->pesticides()->get(['id', 'name'])->pluck('id', 'name')->toArray();
        $skipPestiName = 'Insecticidal Soap Spray'; // ID 10
        
        // --- E. Define Stock Levels for Pesticides (1 Critical, 4 Low, 6 Good = 11 Total) ---
        
        // CRITICAL Stock (< 200 base units) (1)
        $pestiTransactions['Powdered Insecticide'] = ['qty' => 190.00, 'unit' => 'kg']; 

        // LOW Stock (200 base units <= Stock < 700 base units) (4)
        $pestiTransactions['Granular Fungicide'] = ['qty' => 300.00, 'unit' => 'kg']; 
        $pestiTransactions['Concentrated Neem Oil'] = ['qty' => 550.00, 'unit' => 'liter']; 
        $pestiTransactions['Bacillus Thuringiensis (BT)'] = ['qty' => 680.00, 'unit' => 'kg'];
        $pestiTransactions['Broadleaf Weed Killer'] = ['qty' => 400.00, 'unit' => 'liter'];

        // GOOD Stock (>= 700 base units) (6)
        $pestiTransactions['Glyphosate Herbicide'] = ['qty' => 750.00, 'unit' => 'liter'];
        $pestiTransactions['Systemic Pest Control (Liquid)'] = ['qty' => 950.00, 'unit' => 'liter'];
        $pestiTransactions['Acaricide (Mite Control)'] = ['qty' => 1100.00, 'unit' => 'liter'];
        $pestiTransactions['Copper-Based Fungicide'] = ['qty' => 880.00, 'unit' => 'kg'];
        $pestiTransactions['Pre-Emergent Herbicide'] = ['qty' => 1500.00, 'unit' => 'kg'];
        $pestiTransactions['Snail and Slug Pellets'] = ['qty' => 700.00, 'unit' => 'kg'];

        // --- F. Create Pesticide Transactions ---
        foreach ($pestiTransactions as $name => $data) {
            if ($name === $skipPestiName) continue;
            
            $id = $activePesticides[$name] ?? null;
            if ($id) {
                $transactionCounter++;
                $transactions[] = $this->createTransaction('item', $id, $data['qty'], $data['unit'], $baseDate, $transactionCounter, $creator_id);
            } else {
                echo "Warning: Pesticide '{$name}' not found or not active. Skipping.\n";
            }
        }
        
        // 4. Insert all transactions (17 + 12 + 11 = 40 total transactions)
        DB::table('inventory_transactions')->insert($transactions);
    }

    /**
     * Helper to create a single transaction array with dynamic dates.
     * * @param Carbon $baseDate The starting date for the sequence.
     * @param int $counter The sequence number of the transaction.
     */
    private function createTransaction(string $productType, int $productId, float $qty, string $unit, Carbon $baseDate, int $counter, int $createdBy): array
    {
        // 1. Calculate transaction (system entry) date and receipt date
        // Transactions are spaced out by a few days, starting from the base date.
        // `created_at` (System Entry): BaseDate + (Counter * 2 days)
        $created_at = $baseDate->copy()->addDays($counter * 2)->addHours(8)->addMinutes(rand(0, 59));

        // `receipt_date` (Physical Delivery): A few days before `created_at` for testing delay, but must be <= today()
        $receipt_date = $created_at->copy()->subDays(rand(1, 5))->startOfDay();

        // 2. Calculate manufacture and expiration dates based on receipt date rules
        // Rule: manufacture_date < receipt_date < expiration_date
        
        // `manufacture_date`: Must be BEFORE receipt_date (e.g., 2 weeks prior)
        $manufacture_date = $receipt_date->copy()->subDays(rand(10, 20))->startOfDay();

        // `expiration_date`: Must be AFTER manufacture_date (e.g., 1 year from manufacture date)
        $expiration_date = $manufacture_date->copy()->addMonths(rand(10, 14))->endOfDay();
        
        // Ensure we don't accidentally create a transaction in the future
        if ($created_at->isFuture()) {
             $created_at = Carbon::now();
             $receipt_date = $created_at->copy()->subDay();
        }


        return [
            'product_type' => $productType, 
            'product_id' => $productId,
            'transaction_type' => 'inbound',
            'qty' => $qty,
            'unit' => $unit,
            
            // Dates
            'receipt_date' => $receipt_date->toDateString(), 
            'manufacture_date' => $manufacture_date->toDateString(), 
            'expiration_date' => $expiration_date->toDateString(), 
            
            'contract_id' => null,
            'partner_order_id' => null,
            'notes' => "Initial stock load #{$counter}. Receipt recorded on {$receipt_date->toDateString()}.",
            'created_by' => $createdBy,
            'created_at' => $created_at, // Use full DateTime
            'updated_at' => $created_at,
        ];
    }
}