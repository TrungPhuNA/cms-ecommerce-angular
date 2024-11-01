<?php

namespace Modules\Admin\App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\Admin\Database\factories\StockInFactory;

class Supplier extends Model
{
    use HasFactory;
    protected $table = 'supplier';
    protected $guarded = [''];
    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [];


    
    protected static function newFactory(): StockInFactory
    {
        //return StockInFactory::new();
    }
}
