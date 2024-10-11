<?php

namespace Modules\Admin\App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\Admin\Database\factories\PaymentMethodFactory;

class PaymentMethod extends Model
{
    use HasFactory;

    protected $table = "payment_methods";
    protected $guarded = [""];
}
