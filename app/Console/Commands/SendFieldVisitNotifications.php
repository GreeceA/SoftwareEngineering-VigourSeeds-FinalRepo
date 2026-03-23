<?php

namespace App\Console\Commands;

use App\Models\FieldVisit;
use App\Notifications\FieldVisitReminder;
use App\Notifications\FieldVisitTodayReminder;
use App\Notifications\FieldVisitOverdueReminder;
use Carbon\Carbon;
use Illuminate\Console\Command;

class SendFieldVisitNotifications extends Command
{
    protected $signature = 'fieldvisits:notify';
    protected $description = 'Send field visit notifications to assigned technicians';

    public function handle()
    {
        $this->info('Starting field visit notifications...');

        // 1. Notify 7 days before
        $this->sendReminders(7);

        // 2. Notify 1 day before
        $this->sendReminders(1);

        // 3. Notify on the day
        $this->sendTodayReminders();

        // 4. Notify 1 day after (overdue)
        $this->sendOverdueReminders();

        $this->info('✅ Field visit notifications completed!');
    }

    protected function sendReminders($daysUntil)
    {
        $targetDate = Carbon::today()->addDays($daysUntil);

        $visits = FieldVisit::with(['contract', 'farm', 'assignee'])
            ->where('status', 'ongoing')
            ->whereDate('date_visit', $targetDate)
            ->whereNotNull('user_ID')
            ->get();

        foreach ($visits as $visit) {
            if ($visit->assignee) {
                $visit->assignee->notify(new FieldVisitReminder($visit, $daysUntil));
                $this->info("✉️ Sent {$daysUntil}-day reminder for Visit #{$visit->field_visit_ID} to {$visit->assignee->email}");
            }
        }

        $this->info("Sent {$visits->count()} {$daysUntil}-day reminder(s)");
    }

    protected function sendTodayReminders()
    {
        $visits = FieldVisit::with(['contract', 'farm', 'assignee'])
            ->where('status', 'ongoing')
            ->whereDate('date_visit', Carbon::today())
            ->whereNotNull('user_ID')
            ->get();

        foreach ($visits as $visit) {
            if ($visit->assignee) {
                $visit->assignee->notify(new FieldVisitTodayReminder($visit));
                $this->info("✉️ Sent TODAY reminder for Visit #{$visit->field_visit_ID} to {$visit->assignee->email}");
            }
        }

        $this->info("Sent {$visits->count()} today reminder(s)");
    }

    protected function sendOverdueReminders()
    {
        $yesterday = Carbon::yesterday();

        $visits = FieldVisit::with(['contract', 'farm', 'assignee', 'growthReports', 'damageReports'])
            ->where('status', 'ongoing')
            ->whereDate('date_visit', $yesterday)
            ->whereNotNull('user_ID')
            ->get();

        foreach ($visits as $visit) {
            if ($visit->assignee) {
                $visit->assignee->notify(new FieldVisitOverdueReminder($visit));
                $this->info("⚠️ Sent OVERDUE reminder for Visit #{$visit->field_visit_ID} to {$visit->assignee->email}");
            }
        }

        $this->info("Sent {$visits->count()} overdue reminder(s)");
    }
}