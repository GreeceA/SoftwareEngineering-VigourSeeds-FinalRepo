<?php

namespace App\Notifications;

use App\Models\FieldVisit;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class FieldVisitReminder extends Notification implements ShouldQueue
{
    use Queueable;

    protected $fieldVisit;
    protected $daysUntil;

    public function __construct(FieldVisit $fieldVisit, $daysUntil = 1)
    {
        $this->fieldVisit = $fieldVisit;
        $this->daysUntil = $daysUntil;
    }

    public function via($notifiable)
    {
        return ['database', 'mail'];
    }

    public function toMail($notifiable)
    {
        $dayText = $this->daysUntil === 1 ? 'Tomorrow' : "in {$this->daysUntil} Days";
        
        return (new MailMessage)
            ->subject("Upcoming Field Visit - {$dayText}")
            ->greeting('Hello ' . $notifiable->first_name . '!')
            ->line($this->daysUntil === 7 
                ? '📅 **Advance Notice: You have a field visit scheduled in one week.**'
                : ($this->daysUntil === 1 
                    ? '⏰ **Reminder: Your field visit is scheduled for tomorrow!**'
                    : "You have an upcoming field visit scheduled in **{$this->daysUntil} days**.")
            )
            ->line('**Visit Details:**')
            ->line('• Visit ID: #' . $this->fieldVisit->field_visit_ID)
            ->line('• Date: ' . $this->fieldVisit->date_visit->format('F d, Y'))
            ->line('• Contract: ' . $this->fieldVisit->contract->contract_name)
            ->line('• Farm: ' . ($this->fieldVisit->farm->location_name ?? 'N/A'))
            ->line('• Address: ' . ($this->fieldVisit->farm->address ?? 'N/A'))
            ->action('View Field Visit', route('field-visits.show', $this->fieldVisit->field_visit_ID))
            ->line($this->daysUntil === 7 
                ? 'Please begin preparing for this visit.'
                : 'Please ensure you are prepared for this visit.'
            )
            ->salutation('Best regards, Vigour Seeds Team');
    }

    public function toArray($notifiable)
    {
        $dayText = $this->daysUntil === 1 ? 'Tomorrow' : "in {$this->daysUntil} Days";
        
        return [
            'field_visit_id' => $this->fieldVisit->field_visit_ID,
            'title' => "Field Visit {$dayText}",
            'message' => "You have a field visit scheduled for " . $this->fieldVisit->date_visit->format('F d, Y') . " at " . ($this->fieldVisit->farm->location_name ?? 'N/A'),
            'contract' => $this->fieldVisit->contract->contract_name,
            'date' => $this->fieldVisit->date_visit->format('Y-m-d'),
            'days_until' => $this->daysUntil,
            'type' => 'reminder',
            'url' => route('field-visits.show', $this->fieldVisit->field_visit_ID),
        ];
    }
}