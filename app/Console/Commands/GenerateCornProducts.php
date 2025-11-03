<?php

namespace App\Console\Commands;

use App\Models\Seed;
use App\Models\CornProduct;
use Illuminate\Console\Command;

class GenerateCornProducts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'corn:generate-products';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate corn products for all seeds that don\'t have one';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Generating corn products for seeds...');

        $seeds = Seed::whereDoesntHave('cornProduct')->get();

        if ($seeds->isEmpty()) {
            $this->info('All seeds already have corn products!');
            return 0;
        }

        $bar = $this->output->createProgressBar($seeds->count());

        foreach ($seeds as $seed) {
            CornProduct::create([
                'seed_id' => $seed->id,
                'name' => $seed->seed_variety . ' Corn',
                'unit' => 'kg',
                'status' => 'active',
                'notes' => 'Auto-generated from seed: ' . $seed->seed_variety,
            ]);

            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info("Successfully generated {$seeds->count()} corn products!");

        return 0;
    }
}