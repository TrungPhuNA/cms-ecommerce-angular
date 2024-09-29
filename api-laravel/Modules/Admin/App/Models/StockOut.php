<?php

namespace Modules\Admin\App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\Admin\Database\factories\StockOutFactory;

class StockOut extends Model
{
    use HasFactory;
    protected $table = 'stock_outs';
    protected $guarded = [''];

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [];
    
    protected static function newFactory(): StockOutFactory
    {
        //return StockOutFactory::new();
    }
}
