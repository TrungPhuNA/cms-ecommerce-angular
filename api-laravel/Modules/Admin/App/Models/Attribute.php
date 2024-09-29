<?php

namespace Modules\Admin\App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\Admin\Database\factories\AttributeFactory;

class Attribute extends Model
{
    use HasFactory;
    protected $table = 'ec_attributes';
    protected $guarded = [''];

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [];
    
    protected static function newFactory(): AttributeFactory
    {
        //return AttributeFactory::new();
    }

    public function attributeValue()
    {
        return $this->hasMany(AttributeValue::class,'attribute_id');
    }
}
