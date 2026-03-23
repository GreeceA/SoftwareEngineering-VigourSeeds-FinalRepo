<?php

namespace App\Notifications;

use App\Models\FieldVisit;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class FieldVisitOverdueReminder extends Notification implements ShouldQueue
{
    use Queueable;

    protected $fieldVisit;

    public function __construct(FieldVisit $fieldVisit)
    {
        $this->fieldVisit = $fieldVisit;
    }

    public function via($notifiable)
    {
        return ['database', 'mail'];
    }

    public function toMail($notifiable)
    {
        $hasGrowthReports = $this->fieldVisit->growthReports()->exists();
        $hasDamageReports = $this->fieldVisit->damageReports()->exists();
        $hasAnyReports = $hasGrowthReports || $hasDamageReports;

        return (new MailMessage)
            ->subject('Action Required: Complete Field Visit Reports')
            ->greeting('Hello ' . $notifiable->first_name . '!')
            ->line('⚠️ **Your field visit was yesterday. Please complete your reports.**')
            ->line('**Visit Details:**')
            ->line('• Visit ID: #' . $this->fieldVisit->field_visit_ID)
            ->line('• Date: ' . $this->fieldVisit->date_visit->format('F d, Y'))
            ->line('• Contract: ' . $this->fieldVisit->contract->contract_name)
            ->line('• Farm: ' . ($this->fieldVisit->farm->location_name ?? 'N/A'))
            ->line('')
            ->line('**Report Status:**')
            ->line('• Growth Reports: ' . ($hasGrowthReports ? '✅ Submitted (' . $this->fieldVisit->growthReports()->count() . ')' : '❌ Missing'))
            ->line('• Damage Reports: ' . ($hasDamageReports ? '✅ Submitted (' . $this->fieldVisit->damageReports()->count() . ')' : '❌ Missing'))
            ->when(!$hasAnyReports, function ($mail) {
                return $mail->line('')
                    ->line('⚠️ **No reports have been submitted yet!**')
                    ->line('At least one Growth or Damage Report is required to complete this visit.');
            })
            ->action('Submit Reports Now', route('field-visits.show', $this->fieldVisit->field_visit_ID))
            ->line('Please submit all required reports as soon as possible.')
            ->salutation('Best regards, Vigour Seeds Team');
    }

    public function toArray($notifiable)
    {
        return [
            'field_visit_id' => $this->fieldVisit->field_visit_ID,
            'title' => 'Field Visit Reports Overdue',
            'message' => 'Please submit reports for field visit from ' . $this->fieldVisit->date_visit->format('F d, Y'),
            'contract' => $this->fieldVisit->contract->contract_name,
            'date' => $this->fieldVisit->date_visit->format('Y-m-d'),
            'type' => 'overdue',
            'url' => route('field-visits.show', $this->fieldVisit->field_visit_ID),
            'has_growth_reports' => $this->fieldVisit->growthReports()->exists(),
            'has_damage_reports' => $this->fieldVisit->damageReports()->exists(),
            'growth_reports_count' => $this->fieldVisit->growthReports()->count(),
            'damage_reports_count' => $this->fieldVisit->damageReports()->count(),
        ];
    }
}