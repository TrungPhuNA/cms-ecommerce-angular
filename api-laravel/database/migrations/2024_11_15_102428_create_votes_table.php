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
        Schema::create('votes', function (Blueprint $table) {
            $table->id();
            $table->text("comment")->nullable();
            $table->integer("rating")->default(0);
            $table->foreignId('product_id')->constrained('ec_products')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->enum("status", ["published", "draft", "pending"])->default("pending");
            $table->timestamps();
        });
        Schema::table('ec_products', function (Blueprint $table) {
            $table->integer("total_vote_count")->default(0);
            $table->integer("total_rating_score")->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('votes');
        Schema::table('ec_products', function (Blueprint $table) {
            $table->dropColumn('total_vote_count');
            $table->dropColumn('total_rating_score');
        });
    }
};
