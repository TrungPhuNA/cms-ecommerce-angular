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
        Schema::create('services_user', function (Blueprint $table) {
            $table->id();
            $table->integer("user_id")->index();
            $table->integer("service_id")->index();
            $table->integer("action_id")->index()->comment("nhân viên được giao");
            $table->integer("price")->default(0);
            $table->enum("status", ["pending", "processing", "completed", "canceled"])->default("pending");
            $table->string("name")->nullable();
            $table->string("address")->nullable();
            $table->date("date")->nullable();
            $table->boolean("is_home_service")->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('services_user');
    }
};
