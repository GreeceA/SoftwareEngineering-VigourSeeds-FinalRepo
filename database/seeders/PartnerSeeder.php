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
    // Run the database seeds.
    public function run(): void
    {
        $faker = Faker::create('en_PH');

        $this->cleanup();

        // Constants for name generation
        $companyTypes = ['Corporation', 'Inc.', 'Company', 'Enterprises', 'Group', 'Holdings', 'Ventures', 'Solutions', 'Services'];
        $businessTypes = ['Agricultural', 'Farm', 'Trading', 'Food', 'Produce', 'Harvest', 'Crop', 'Organic', 'Sustainable'];
        $locationNames = ['Manila', 'Cebu', 'Davao', 'Bulacan', 'Pampanga', 'Laguna', 'Cavite', 'Batangas', 'Quezon', 'Nueva Ecija'];

        DB::beginTransaction();
        try {
            $partners = [];
            $uniqueData = [
                'emails'      => [],
                'tins'        => [],
                'reg_numbers' => [],
            ];
            
            // Generate 18 unique partners
            for ($i = 0; $i < 18; $i++) {
                $partnerType = $faker->randomElement(['individual', 'organization']);

                // Generate natural names based on partner type
                if ($partnerType === 'individual') {
                    $name = $faker->unique()->name();
                } else {
                    $name = $this->generateCompanyName($faker, $companyTypes, $businessTypes, $locationNames);
                }

                // Ensure unique main email
                do {
                    $email = $faker->unique()->safeEmail();
                } while (in_array($email, $uniqueData['emails']));
                $uniqueData['emails'][] = $email;

                // Ensure unique TIN (12 digits, stored formatted)
                do {
                    $tin = $faker->unique()->numerify('###-###-###-###');
                    $tinRaw = str_replace('-', '', $tin);
                } while (in_array($tinRaw, $uniqueData['tins']));
                $uniqueData['tins'][] = $tinRaw;

                // Ensure unique DTI Registration Number (11 digits, stored raw)
                do {
                    $regRaw = $faker->unique()->numerify('###########');
                } while (in_array($regRaw, $uniqueData['reg_numbers']));
                $uniqueData['reg_numbers'][] = $regRaw;
                $regNumDB = "BN-{$regRaw}REG";

                // Generate formatted phone number (0XXX-XXX-XXXX)
                $phonePrefix = $faker->randomElement(['08', '09']);
                $phoneRaw = $faker->unique()->numerify("{$phonePrefix}#########");
                $phoneFormatted = substr($phoneRaw, 0, 4) . '-' . substr($phoneRaw, 4, 3) . '-' . substr($phoneRaw, 7, 4);

                $partnerData = [
                    'partner_type'        => $partnerType,
                    'name'                => $name,
                    'email'               => $email,
                    'phone'               => $phoneFormatted,
                    'address'             => $faker->address(),
                    'registration_number' => $regNumDB, // Stored as BN-XXXXXXXREG
                    'tax_id'              => $tin,      // Stored as XXX-XXX-XXX-XXX
                    'notes'               => $faker->optional(0.3)->paragraph(1),
                    'status'              => $faker->randomElement(['active', 'inactive']),
                    'created_at'          => now(),
                    'updated_at'          => now(),
                ];
                
                $partners[] = $partnerData;
            }

            // Insert all partners
            Partner::insert($partners);
            $partnerRecords = Partner::all();

            // Create Contact Persons and Farms for each partner
            foreach ($partnerRecords as $partner) {
                // --- Farms (1 to 3 farms per partner) ---
                $farmCount = $faker->numberBetween(1, 3);
                $partnerFarms = [];
                
                for ($f = 0; $f < $farmCount; $f++) {
                    // Generate farm name unique to the partner context
                    $locationName = $this->generateFarmName($faker, $partner->name);
                    
                    $partnerFarms[] = [
                        'partner_id'    => $partner->id,
                        'location_name' => $locationName,
                        'address'       => $faker->streetAddress() . ', ' . $faker->city(),
                        'area_size'     => $faker->randomFloat(2, 1.0, 500.0),
                        'soil_type'     => $faker->randomElement(['clay', 'sandy', 'loam', 'silty']),
                        'created_at'    => now(),
                        'updated_at'    => now(),
                    ];
                }
                Farm::insert($partnerFarms);
                $faker->unique(true); // Reset unique for next partner's farms

                // --- Contact Persons (Only for Organizations, 1 to 3 contacts) ---
                if ($partner->partner_type === 'organization') {
                    $contactCount = $faker->numberBetween(1, 3);
                    $partnerContacts = [];

                    for ($c = 0; $c < $contactCount; $c++) {
                        // Generate unique phone number for contact
                        $contactPhonePrefix = $faker->randomElement(['08', '09']);
                        $contactPhoneRaw = $faker->unique()->numerify("{$contactPhonePrefix}#########");
                        $contactPhoneFormatted = substr($contactPhoneRaw, 0, 4) . '-' . substr($contactPhoneRaw, 4, 3) . '-' . substr($contactPhoneRaw, 7, 4);

                        $partnerContacts[] = [
                            'partner_id'   => $partner->id,
                            'name'         => $faker->unique()->name(), // Ensure contact names are unique across all contacts
                            'email'        => $faker->unique()->safeEmail(),
                            'phone_number' => $contactPhoneFormatted,
                            'created_at'   => now(),
                            'updated_at'   => now(),
                        ];
                    }
                    ContactPerson::insert($partnerContacts);
                    $faker->unique(true); // Reset unique state for names/emails/phones for next partner
                }
            }
            
            DB::commit();

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    // Clean up existing data
    private function cleanup(): void
    {
        // Disable foreign key checks temporarily
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        
        // Truncate tables in correct order (child tables first)
        Farm::truncate();
        ContactPerson::truncate();
        Partner::truncate();
        
        // Enable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
    
    // Generate natural-sounding company names
    private function generateCompanyName($faker, $companyTypes, $businessTypes, $locationNames): string
    {
        $patterns = [
            function() use ($faker, $companyTypes, $businessTypes) {
                return $faker->lastName() . ' ' . $faker->randomElement($businessTypes) . ' ' . $faker->randomElement($companyTypes);
            },
            function() use ($faker, $companyTypes, $locationNames) {
                return $faker->randomElement($locationNames) . ' ' . $faker->randomElement(['Agri', 'Farm', 'Crop']) . ' ' . $faker->randomElement($companyTypes);
            },
            function() use ($faker, $companyTypes) {
                return $faker->firstName() . ' & ' . $faker->firstName() . ' ' . $faker->randomElement($companyTypes);
            },
            function() use ($faker, $companyTypes, $businessTypes) {
                return $faker->randomElement($businessTypes) . ' ' . $faker->randomElement(['Partners', 'Collective', 'Cooperative']) . ' ' . $faker->randomElement($companyTypes);
            }
        ];

        return $faker->unique()->randomElement($patterns)();
    }

    // Generate natural-sounding farm names
    private function generateFarmName($faker, $partnerName): string
    {
        // Create variations of partner name for uniqueness
        $partnerPrefix = strtok($partnerName, ' '); 
        
        $farmNamePatterns = [
            'Greenbelt ' . $faker->city(),
            'Branch ' . $faker->randomElement(['A', 'B', 'C']) . ' ' . $faker->city(),
            $partnerPrefix . ' Farmstead',
            $partnerPrefix . ' East Farm',
            $faker->randomElement(['Sunrise', 'Green Valley', 'Mountain View', 'Riverbend']) . ' Farm',
        ];

        return $faker->unique()->randomElement($farmNamePatterns);
    }
}