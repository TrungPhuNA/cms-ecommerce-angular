<?php

namespace Modules\Admin\App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\Admin\Database\factories\OrderFactory;

class Order extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $table = 'ec_orders';
    protected $guarded = [''];
    
    protected static function newFactory(): OrderFactory
    {
        //return OrderFactory::new();
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class,'order_id');
    }

    public function stockOuts()
    {
        return $this->hasMany(StockOut::class,'order_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class,'user_id');
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class, 'supplier_id');
    }
}
