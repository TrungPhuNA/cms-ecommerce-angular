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
        Schema::create('supplier', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255);
            $table->string('slug', 255);
            $table->timestamps();
        });

        Schema::table('ec_stock_ins', function (Blueprint $table) {
            $table->string("type", 255)->nullable()->comment('final: Kho thành phẩm      ingredient: kho nguyên liệu   ');
        });
        Schema::table('ec_stock_outs', function (Blueprint $table) {
            $table->string("type", 255)->nullable()->comment('final: Kho thành phẩm      ingredient: kho nguyên liệu   ');
        });
        Schema::table('ec_orders', function (Blueprint $table) {
            $table->integer("supplier_id")->nullable()->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('supplier');
        Schema::table('ec_stock_ins', function (Blueprint $table) {
            $table->dropColumn('type');
        });
        Schema::table('ec_stock_outs', function (Blueprint $table) {
            $table->dropColumn('type');
        });
        Schema::table('ec_orders', function (Blueprint $table) {
            $table->dropColumn('supplier_id');
        });
    }
};
