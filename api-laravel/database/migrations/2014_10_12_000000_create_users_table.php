<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('phone')->nullable();
            $table->string('provider')->nullable();
            $table->string('provider_id')->nullable();
            $table->tinyInteger('status')->default(1);
            $table->string('avatar')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('users_types', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable()->unique();
            $table->timestamps();
        });

        Schema::create('users_has_types', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_type_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('users_bank_accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('bank_id')->constrained()->onDelete('cascade');
            $table->string('account_number');
            $table->string('account_name');
            $table->string('bank_branch');
            $table->boolean('is_default')->default(false);
            $table->timestamps();
        });

        Schema::create('banks', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('code')->nullable();
            $table->string('short_name')->nullable();
            $table->string('logo')->nullable();
            $table->string('swift_code')->nullable();
            $table->timestamps();
        });

        Schema::create('users_wallets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->decimal('balance', 15, 2)->default(0);
            $table->timestamps();
        });
        Schema::create('users_wallets_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('wallet_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['credit', 'debit']);
            $table->enum('status', ['pending', 'paid','reject','cancel']);
            $table->decimal('amount', 15, 2);
            $table->string('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users_bank_accounts');
        Schema::dropIfExists('banks');
        Schema::dropIfExists('users_has_types');
        Schema::dropIfExists('users_types');
        Schema::dropIfExists('users_wallets_transactions');
        Schema::dropIfExists('users_wallets');
        Schema::dropIfExists('users');
    }
};
