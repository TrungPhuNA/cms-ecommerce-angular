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
        Schema::create('bl_menus', function (Blueprint $table) {
            $table->id();
            $table->string("name")->nullable();
            $table->string("slug")->nullable();
            $table->string("description")->nullable();
            $table->enum("status", ["published", "draft", "pending"])->default("pending");
            $table->tinyInteger('is_featured')->default(0);
            $table->timestamps();
        });
        Schema::create('bl_articles', function (Blueprint $table) {
            $table->id();
            $table->string("name")->nullable();
            $table->string("slug")->nullable();
            $table->string("description")->nullable();
            $table->text("content")->nullable();
            $table->enum("status", ["published", "draft", "pending"])->default("pending");
            $table->integer('author_id')->index()->nullable();
            $table->foreignId('menu_id')->constrained('bl_menus');
            $table->tinyInteger('is_featured')->default(0);
            $table->string("avatar")->nullable();
            $table->bigInteger("views")->default(0);
            $table->timestamps();
        });
        Schema::create('bl_tags', function (Blueprint $table) {
            $table->id();
            $table->string("name")->nullable();
            $table->string("slug")->nullable();
            $table->string("description")->nullable();
            $table->enum("status", ["published", "draft", "pending"])->default("pending");
            $table->tinyInteger('is_featured')->default(0);
            $table->timestamps();
        });
        Schema::create('bl_articles_tags', function (Blueprint $table) {
            $table->foreignId('article_id')->constrained('bl_articles');
            $table->foreignId('tag_id')->constrained('bl_tags');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bl_articles_tags');
        Schema::dropIfExists('bl_articles');
        Schema::dropIfExists('bl_tags');
        Schema::dropIfExists('bl_menus');
    }
};
