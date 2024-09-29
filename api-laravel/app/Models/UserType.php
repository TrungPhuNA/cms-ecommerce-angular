<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserType extends Model
{
    use HasFactory;
    protected $table = 'users_types';
    protected $guarded = [''];
    protected $hidden = ['pivot'];

    public function users()
    {
        return $this->belongsToMany(User::class,'users_has_types');
    }
}
