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
        Schema::create('setting_information', function (Blueprint $table) {
            $table->id();
            $table->string("logo")->nullable();
            $table->string("favicon")->nullable();
            $table->string("name")->nullable();
            $table->string("email")->nullable();
            $table->string("full_address")->nullable();
            $table->text("map")->nullable();
            $table->string("fax")->nullable();
            $table->string("contact_number")->nullable();
            $table->string("copyright")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('setting_information');
    }
};
