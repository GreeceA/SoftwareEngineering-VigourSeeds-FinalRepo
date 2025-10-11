<?php

namespace Database\Seeders;

use App\Models\Partner;
use App\Models\PartnerContact as ContactPerson;
use App\Models\PartnerFarm as Farm;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class PartnerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('en_PH'); // Using a specific locale for more realistic local data

        DB::beginTransaction();
        try {
            $partners = [];
            $uniqueData = [
                'emails' => [],
                'tins' => [],
                'reg_numbers' => [],
            ];
            
            // Generate 10 unique partners
            for ($i = 0; $i < 10; $i++) {
                $partnerType = $faker->randomElement(['individual', 'organization']);

                // Ensure unique main email
                do {
                    $email = $faker->unique()->safeEmail();
                } while (in_array($email, $uniqueData['emails']));
                $uniqueData['emails'][] = $email;

                // Ensure unique TIN (12 digits)
                do {
                    // Generates 12 digits, formatted as XXX-XXX-XXX-XXX for display
                    $tin = $faker->unique()->numerify('###-###-###-###');
                    $tinRaw = str_replace('-', '', $tin);
                } while (in_array($tinRaw, $uniqueData['tins']));
                $uniqueData['tins'][] = $tinRaw;

                // Ensure unique DTI Registration Number (11 digits, stored raw)
                do {
                    $regRaw = $faker->unique()->numerify('###########');
                } while (in_array($regRaw, $uniqueData['reg_numbers']));
                $uniqueData['reg_numbers'][] = $regRaw;
                // Format for database: BN-XXXXXXXXXXXREG
                $regNumDB = "BN-{$regRaw}REG";

                // Ensure unique phone number (11 digits, starts with 08 or 09, formatted)
                $phonePrefix = $faker->randomElement(['08', '09']);
                $phoneRaw = $faker->unique()->numerify("{$phonePrefix}#########"); // Total 11 digits
                $phoneFormatted = substr($phoneRaw, 0, 4) . '-' . substr($phoneRaw, 4, 3) . '-' . substr($phoneRaw, 7, 4);

                $partnerData = [
                    'partner_type' => $partnerType,
                    // Use a unique name for each, combining type and a random word
                    'name' => $faker->unique()->company() . ' ' . $faker->word() . ' ' . $i, 
                    'email' => $email,
                    'phone' => $phoneFormatted,
                    'address' => $faker->address(),
                    'registration_number' => $regNumDB,
                    'tax_id' => $tinRaw,
                    'notes' => $faker->optional(0.5)->paragraph(1),
                    'status' => $faker->randomElement(['active', 'inactive']),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
                
                $partners[] = $partnerData;
            }

            // Insert all partners
            Partner::insert($partners);
            $partnerRecords = Partner::all();

            // Create Contact Persons and Farms for each partner
            foreach ($partnerRecords as $partner) {
                // --- Farms (1 to 3 farms per partner, max 10 allowed) ---
                $farmCount = $faker->numberBetween(1, 3);
                $partnerFarms = [];
                $farmNames = [];
                
                for ($f = 0; $f < $farmCount; $f++) {
                    // Ensure unique location name for the partner
                    do {
                        $locationName = $faker->unique()->city() . ' Farm';
                    } while (in_array($locationName, $farmNames));
                    $farmNames[] = $locationName;

                    $partnerFarms[] = [
                        'partner_id' => $partner->id,
                        'location_name' => $locationName,
                        'address' => $faker->streetAddress(),
                        // Area size between 0.01 and 999.99
                        'area_size' => $faker->randomFloat(2, 0.01, 999.99), 
                        'soil_type' => $faker->randomElement(['clay', 'sandy', 'loam', 'silty']),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
                Farm::insert($partnerFarms);
                $faker->unique(true); // Reset unique for next partner's farms

                // --- Contact Persons (Only for Organizations, 1 to 3 contacts) ---
                if ($partner->partner_type === 'organization') {
                    $contactCount = $faker->numberBetween(1, 3);
                    $partnerContacts = [];
                    $contactEmails = [];
                    $contactNames = [];
                    $contactPhones = [];

                    for ($c = 0; $c < $contactCount; $c++) {
                        // Contact Name uniqueness check
                        do {
                            $contactName = $faker->unique()->name();
                        } while (in_array($contactName, $contactNames));
                        $contactNames[] = $contactName;

                        // Contact Email uniqueness check
                        do {
                            $contactEmail = $faker->unique()->safeEmail();
                        } while (in_array($contactEmail, $contactEmails));
                        $contactEmails[] = $contactEmail;

                        // Contact Phone uniqueness check (11 digits, starts with 08 or 09, formatted)
                        $contactPhonePrefix = $faker->randomElement(['08', '09']);
                        $contactPhoneRaw = $faker->unique()->numerify("{$contactPhonePrefix}#########");
                        $contactPhoneFormatted = substr($contactPhoneRaw, 0, 4) . '-' . substr($contactPhoneRaw, 4, 3) . '-' . substr($contactPhoneRaw, 7, 4);
                        $contactPhones[] = $contactPhoneFormatted;

                        $partnerContacts[] = [
                            'partner_id' => $partner->id,
                            'name' => $contactName,
                            'email' => $contactEmail,
                            'phone_number' => $contactPhoneFormatted,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    }
                    ContactPerson::insert($partnerContacts);
                    $faker->unique(true); // Reset unique for next partner's contacts
                }
            }
            
            DB::commit();

        } catch (\Exception $e) {
            DB::rollBack();
            // Optional: Log the exception or echo an error message for debugging
            // echo "Seeder failed: " . $e->getMessage() . "\n";
            throw $e;
        }
    }
}