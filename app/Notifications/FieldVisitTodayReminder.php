<?php

namespace App\Notifications;

use App\Models\FieldVisit;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class FieldVisitTodayReminder extends Notification implements ShouldQueue
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
        return (new MailMessage)
            ->subject('Field Visit Scheduled Today!')
            ->greeting('Hello ' . $notifiable->first_name . '!')
            ->line('🚨 **Your field visit is scheduled for TODAY!**')
            ->line('**Visit Details:**')
            ->line('• Visit ID: #' . $this->fieldVisit->field_visit_ID)
            ->line('• Date: ' . $this->fieldVisit->date_visit->format('F d, Y'))
            ->line('• Contract: ' . $this->fieldVisit->contract->contract_name)
            ->line('• Farm: ' . ($this->fieldVisit->farm->location_name ?? 'N/A'))
            ->line('• Address: ' . ($this->fieldVisit->farm->address ?? 'N/A'))
            ->action('View Field Visit', route('field-visits.show', $this->fieldVisit->field_visit_ID))
            ->line('Please ensure you complete all required reports after your visit.')
            ->salutation('Best regards, Vigour Seeds Team');
    }

    public function toArray($notifiable)
    {
        return [
            'field_visit_id' => $this->fieldVisit->field_visit_ID,
            'title' => 'Field Visit Today!',
            'message' => 'Your field visit is scheduled for today at ' . ($this->fieldVisit->farm->location_name ?? 'N/A'),
            'contract' => $this->fieldVisit->contract->contract_name,
            'date' => $this->fieldVisit->date_visit->format('Y-m-d'),
            'type' => 'today',
            'url' => route('field-visits.show', $this->fieldVisit->field_visit_ID),
        ];
    }
}