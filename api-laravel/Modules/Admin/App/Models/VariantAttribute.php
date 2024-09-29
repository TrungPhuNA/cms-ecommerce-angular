<?php

namespace Modules\Admin\App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\Admin\Database\factories\VariantAttributeFactory;

class VariantAttribute extends Model
{
    use HasFactory;
    protected $table = 'variant_attributes';
    protected $guarded = [''];
    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [];
    
    protected static function newFactory(): VariantAttributeFactory
    {
        //return VariantAttributeFactory::new();
    }

    public function attributeValue()
    {
        return $this->belongsTo(AttributeValue::class, 'attribute_value_id');
    }
}
