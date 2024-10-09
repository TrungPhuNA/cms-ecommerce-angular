<?php

namespace Modules\Admin\App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\Admin\Database\factories\StockInFactory;

class StockIn extends Model
{
    use HasFactory;
    protected $table = 'ec_stock_ins';
    protected $guarded = [''];
    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [];

	public function user()
    {
        return $this->belongsTo(User::class,'user_id');
    }

	public function product()
    {
        return $this->belongsTo(Product::class,'product_id');
    }
    
    protected static function newFactory(): StockInFactory
    {
        //return StockInFactory::new();
    }
}
