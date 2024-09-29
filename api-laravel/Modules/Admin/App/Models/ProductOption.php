<?php

namespace Modules\Admin\App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\Admin\Database\factories\ProductOptionFactory;

class ProductOption extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [];
    
    protected $table = 'ec_product_options';
    protected $guarded = [''];

    public function productOptionValue()
    {
        return $this->hasMany(ProductOptionValue::class,'product_option_id');
    }
}
