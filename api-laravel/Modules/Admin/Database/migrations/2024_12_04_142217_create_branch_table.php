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
        Schema::table('ec_stock_outs', function (Blueprint $table) {
            $table->integer("agency_id", )->nullable();
        });
        Schema::create('ec_agencies', function (Blueprint $table) {
            $table->id();
            $table->string("name")->nullable();
            $table->string("slug")->nullable();
            $table->string("description")->nullable();
            $table->enum("status", ["published", "draft", "pending"])->default("pending");
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ec_stock_outs', function (Blueprint $table) {
            $table->dropColumn('agency_id');
        });
        Schema::dropIfExists('ec_agencies');

    }
};
