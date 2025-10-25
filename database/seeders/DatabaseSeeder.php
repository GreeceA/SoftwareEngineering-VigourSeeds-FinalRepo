<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    // Seed the application's database.
    public function run(): void
    {
        // Call core seeders for permissions and initial users
        $this->call([
            PermissionSeeder::class,
            AdminUserSeeder::class,
            \Database\Seeders\BasicUsersSeeder::class,
        ]);

        // Call functional data seeders
        $this->call([
            SeedSeeder::class,
            PartnerSeeder::class,
            ItemSeeder::class,
            InventoryTransactionSeeder::class,
        ]);
    }
}