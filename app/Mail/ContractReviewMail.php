<?php

namespace App\Mail;

use App\Models\Contract;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ContractReviewMail extends Mailable
{
    use Queueable, SerializesModels;

    public $contract;
    public $internalCcEmails;

    public function __construct(Contract $contract, array $internalCcEmails)
    {
        // Ensure necessary data is loaded for the email
        $this->contract = $contract->load(['partner', 'farm', 'contractSeedCommitments.seed']);
        $this->internalCcEmails = $internalCcEmails;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        // Set the email subject, view, and CC recipients
        return $this->subject('Action Required: Review of Contract ' . $this->contract->contract_name)
                    ->cc($this->internalCcEmails) // CC internal staff list
                    ->markdown('emails.contracts.review'); // Use markdown view for clean HTML/Text body
    }
}