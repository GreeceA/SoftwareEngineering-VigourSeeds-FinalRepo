<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SampleUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Use a static "verified" timestamp for new users
        $verified = '2025-01-01 00:00:00';

        DB::table('users')->insert([
            // === 1-2 Years (2 users) ===
            ['id' => 28, 'first_name' => 'Krizzys', 'last_name' => 'Maxine', 'email' => 'ligmbaballs@gmail.com', 'email_verified_at' => null, 'password' => '$2y$12$ObzHlQeYLgpU3mf9Q.M.XuAMOv6SWJenpbWwf.AKihHWtynE9xvSC', 'role' => 'employee', 'status' => 'active', 'google_id' => null, 'avatar' => '/storage/avatars/Y5XM1jt8mWEIJblGr4Td3YydfU2hOROqhDLBT6IA.jpg', 'remember_token' => null, 'created_at' => '2024-11-17 18:55:00', 'updated_at' => '2024-11-17 18:55:00'], // 1 year
            ['id' => 27, 'first_name' => 'Sai', 'last_name' => 'Winnie', 'email' => 'swrargoncillo@addu.edu.ph', 'email_verified_at' => null, 'password' => '$2y$12$NN2I6GRtJKSJVPttE.xP..htew6/42AXqro3eIbnlbMl8U3rAzf5O', 'role' => 'employee', 'status' => 'active', 'google_id' => null, 'avatar' => null, 'remember_token' => null, 'created_at' => '2023-09-17 18:08:04', 'updated_at' => '2023-09-17 18:08:04'], // 2 years

            // === 3-5 Years (3 users) ===
            ['id' => 26, 'first_name' => 'Kaiyou', 'last_name' => 'Serra', 'email' => 'aingreenx@gmail.com', 'email_verified_at' => '2025-11-17 18:10:23', 'password' => '$2y$12$ohwf03bkBe/wdfriECVAceKOMxCEwQOBViROPsdbT4A4Z27SiSLki', 'role' => 'employee', 'status' => 'active', 'google_id' => null, 'avatar' => '/storage/avatars/nV6I8464fu3JdQ98we6bIaawcyy23oCbluR9rQgg.png', 'remember_token' => '0jWX6oak9BMnD60KptT3SLcm42j2lq8zli2Lg9HP8oEyZGkLxHRzHHP1D4kE', 'created_at' => '2022-10-17 18:00:43', 'updated_at' => '2022-10-17 19:05:11'], // 3 years
            ['id' => 24, 'first_name' => 'Joselyn', 'last_name' => 'Ancog', 'email' => 'joselynancog@gmail.com', 'email_verified_at' => null, 'password' => '$2y$12$8LH3I88i8JgKboky98HugOOhwKL2RD7qOEeL1ETCdIQP.mEDg3nda', 'role' => 'employee', 'status' => 'active', 'google_id' => '112409901174380709619', 'avatar' => 'https://lh3.googleusercontent.com/a/ACg8ocLMLr59LYP3RDSUa8lQWmAbdijxqrHEMocbBTMHjXUgubXHRw=s96-c', 'remember_token' => 'TpDVLfQj0ASKgQ4dnj2dcSLsLmVOisEf8xdGl46q0QPQ5apSTq4rA2vJvzlC', 'created_at' => '2021-08-20 17:51:10', 'updated_at' => '2021-08-20 17:51:10'], // 4 years
            ['id' => 34, 'first_name' => 'Frank', 'last_name' => 'Wright', 'email' => 'seed.manager2@vigourseeds.com', 'email_verified_at' => $verified, 'password' => '$2y$12$gwBWBYG/SS61j5x01pQi8ezJHHEEf4e4lOpH41/OPMfDjpnZQ0bCS', 'role' => 'employee', 'status' => 'active', 'google_id' => null, 'avatar' => null, 'remember_token' => null, 'created_at' => '2020-06-01 08:00:00', 'updated_at' => '2020-06-01 08:00:00'], // 5 years

            // === 7-9 Years (2 users) ===
            ['id' => 33, 'first_name' => 'Elena', 'last_name' => 'Garcia', 'email' => 'partner.viewer2@vigourseeds.com', 'email_verified_at' => $verified, 'password' => '$2y$12$gwBWBYG/SS61j5x01pQi8ezJHHEEf4e4lOpH41/OPMfDjpnZQ0bCS', 'role' => 'employee', 'status' => 'active', 'google_id' => null, 'avatar' => null, 'remember_token' => null, 'created_at' => '2018-07-10 16:45:00', 'updated_at' => '2018-07-10 16:45:00'], // 7 years
            ['id' => 32, 'first_name' => 'David', 'last_name' => 'Kim', 'email' => 'warehouse.staff2@vigourseeds.com', 'email_verified_at' => $verified, 'password' => '$2y$12$gwBWBYG/SS61j5x01pQi8ezJHHEEf4e4lOpH41/OPMfDjpnZQ0bCS', 'role' => 'employee', 'status' => 'active', 'google_id' => null, 'avatar' => null, 'remember_token' => null, 'created_at' => '2016-04-05 09:15:00', 'updated_at' => '2016-04-05 09:15:00'], // 9 years

            // === 10+ Years (3 users) ===
            ['id' => 29, 'first_name' => 'Anna', 'last_name' => 'Smith', 'email' => 'contract.manager2@vigourseeds.com', 'email_verified_at' => $verified, 'password' => '$2y$12$gwBWBYG/SS61j5x01pQi8ezJHHEEf4e4lOpH41/OPMfDjpnZQ0bCS', 'role' => 'employee', 'status' => 'active', 'google_id' => null, 'avatar' => null, 'remember_token' => null, 'created_at' => '2015-01-10 10:00:00', 'updated_at' => '2015-01-10 10:00:00'],
            ['id' => 30, 'first_name' => 'Brian', 'last_name' => 'Lee', 'email' => 'inventory.manager2@vigourseeds.com', 'email_verified_at' => $verified, 'password' => '$2y$12$gwBWBYG/SS61j5x01pQi8ezJHHEEf4e4lOpH41/OPMfDjpnZQ0bCS', 'role' => 'employee', 'status' => 'active', 'google_id' => null, 'avatar' => null, 'remember_token' => null, 'created_at' => '2015-05-15 11:30:00', 'updated_at' => '2015-05-15 11:30:00'],
            ['id' => 31, 'first_name' => 'Carla', 'last_name' => 'Diaz', 'email' => 'field.officer2@vigourseeds.com', 'email_verified_at' => $verified, 'password' => '$2y$12$gwBWBYG/SS61j5x01pQi8ezJHHEEf4e4lOpH41/OPMfDjpnZQ0bCS', 'role' => 'employee', 'status' => 'active', 'google_id' => null, 'avatar' => null, 'remember_token' => null, 'created_at' => '2015-10-20 14:00:00', 'updated_at' => '2015-10-20 14:00:00'],
        ]);
    }
}