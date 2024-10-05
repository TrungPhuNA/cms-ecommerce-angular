<?php

namespace Modules\Admin\App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\Admin\Database\factories\TransactionFactory;

class Transaction extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $table = 'ec_transactions';
    protected $guarded = [''];
    
    protected static function newFactory(): TransactionFactory
    {
        //return TransactionFactory::new();
    }
}
