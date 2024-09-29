<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Traits\HasRoles;

class UserApi extends Authenticatable
{
    use HasFactory;

    use HasApiTokens, HasFactory, Notifiable, HasRoles;
    protected $guard_name = "api";
    protected $table = "users";

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function types()
    {
        return $this->belongsToMany(UserType::class,'users_has_types',"user_id","user_type_id");
    }

    public function rolesAccount()
    {
        return $this->belongsToMany(Role::class,'acl_model_has_roles','model_id','role_id');
    }

    public function wallet()
    {
        return $this->hasOne(Wallet::class);
    }
}
