<?php

namespace Modules\Admin\App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\Admin\Database\factories\AttributeFactory;

class AgencyModel extends Model
{
    use HasFactory;
    protected $table = 'ec_agencies';
    protected $guarded = [''];

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [];
    
    protected static function newFactory(): AttributeFactory
    {
        //return AttributeFactory::new();
    }

    public function StockOuts()
    {
        return $this->hasMany(StockOut::class,'agency_id');
    }
}
