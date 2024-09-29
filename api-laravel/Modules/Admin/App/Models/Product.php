<?php

namespace Modules\Admin\App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\Admin\Database\factories\ProductFactory;

class Product extends Model
{
    use HasFactory;
    protected $table = 'products';
    protected $guarded = [''];

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [];
    
    protected static function newFactory(): ProductFactory
    {
        //return ProductFactory::new();
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }
}
