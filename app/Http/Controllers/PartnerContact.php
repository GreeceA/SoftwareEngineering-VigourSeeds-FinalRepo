<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PartnerContact extends Model
{
    protected $fillable = ['partner_id', 'name', 'email', 'phone_number'];

    public function partner()
    {
        return $this->belongsTo(Partner::class);
    }
}