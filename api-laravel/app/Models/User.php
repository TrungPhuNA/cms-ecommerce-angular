<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

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

    protected static function booted()
    {
        static::created(function ($user) {
            $typeName = $user->type_name ?? 'USER';
            $defaultType = UserType::where('name', $typeName)->first();
            if ($defaultType) {
                $user->types()->attach($defaultType->id);
            }
        });
    }

    public function types()
    {
        return $this->belongsToMany(UserType::class,'users_has_types');
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
