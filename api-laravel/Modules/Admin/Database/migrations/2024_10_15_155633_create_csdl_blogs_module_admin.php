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

        $menus = [
            [
                "name" => "Tin khuyến mãi",
                "description" => "Tin khuyến mãi",
                "status" => "published",
                "is_featured" => 1,
                "created_at" => \Carbon\Carbon::now()
            ],
            [
                "name" => "Thời trang thế giới",
                "description" => "Thời trang thế giới",
                "status" => "published",
                "is_featured" => 1,
                "created_at" => \Carbon\Carbon::now()
            ],
            [
                "name" => "Đồng phục",
                "description" => "Đồng phục",
                "status" => "published",
                "is_featured" => 1,
                "created_at" => \Carbon\Carbon::now()
            ],
        ];

        foreach ($menus as $item) {
            \Illuminate\Support\Facades\DB::table("bl_menus")->insert($item);
        }

        $tags = [
            [
                "name" => "thời trang nổi bật",
                "description" => "thời trang nổi bật",
                "status" => "published",
                "is_featured" => 1,
                "created_at" => \Carbon\Carbon::now()
            ],
            [
                "name" => "xu thế mới",
                "description" => "xu thế mới",
                "status" => "published",
                "is_featured" => 1,
                "created_at" => \Carbon\Carbon::now()
            ],
            [
                "name" => "Đồng phục",
                "description" => "Đồng phục",
                "status" => "published",
                "is_featured" => 1,
                "created_at" => \Carbon\Carbon::now()
            ],
        ];

        foreach ($tags as $item) {
            \Illuminate\Support\Facades\DB::table("bl_tags")->insert($item);
        }
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
