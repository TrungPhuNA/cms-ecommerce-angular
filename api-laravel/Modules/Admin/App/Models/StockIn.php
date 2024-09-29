<?php

namespace Modules\Admin\App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\Admin\Database\factories\StockInFactory;

class StockIn extends Model
{
    use HasFactory;
    protected $table = 'stock_ins';
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
