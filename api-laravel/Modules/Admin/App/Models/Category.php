<?php

namespace Modules\Admin\App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\Admin\Database\factories\CategoryFactory;

class Category extends Model
{
    use HasFactory;
    protected $table = 'categories';
    protected $guarded = [''];
    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [];
    
    protected static function newFactory(): CategoryFactory
    {
        //return CategoryFactory::new();
    }
}
