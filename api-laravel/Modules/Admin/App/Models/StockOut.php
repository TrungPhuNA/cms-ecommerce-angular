<?php

namespace Modules\Admin\App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\Admin\Database\factories\StockOutFactory;

class StockOut extends Model
{
    use HasFactory;
    protected $table = 'ec_stock_outs';
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

    public function agency()
    {
        return $this->belongsTo(AgencyModel::class,'agency_id');
    }

    public function order()
    {
        return $this->belongsTo(Order::class,'order_id');
    }
    
    protected static function newFactory(): StockOutFactory
    {
        //return StockOutFactory::new();
    }
}
