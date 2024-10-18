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
        
        $articles = [
            [
                "name" => "Tặng ngay Voucher 25K cho khách hàng Follow Zalo YODY trong tháng 10",
                "slug" => "tang-ngay-voucher-cho-khach-hang-follow-zalo",
                "status" => "pending",
                "description" => "Ưu đãi cực Hot trong tháng 10, chỉ cần quý khách thao tác theo dõi kênh Zalo OA của YODY sẽ được nhận ngay Voucher giảm giá",
                "is_featured" => 1,
                "views" => 0,
                "avatar" => "https://m.yodycdn.com/fit-in/filters:format(webp)/products/media/articles/2.%20ZALO%20YODY%2050K.jpg",
                "content" => "Nội dung",
                "menu_id" => \Illuminate\Support\Facades\DB::table("bl_menus")->inRandomOrder()->first()->id,
                "created_at" => Carbon\Carbon::now()
            ],
            [
                "name" => "Ưu đãi lớn nhất năm 2024 - SALE CUỐI MÙA LÊN ĐẾN 50%",
                "slug" => "uu-dai-lon-nhat-nam-2024-sale-cuoi-mua",
                "status" => "pending",
                "description" => "Quý khách có thể thực hiện mua sắm trực tiếp tại hệ thống Online Yody bao gồm Website, Fanpge, Zalo OA hoặc trực tiếp tại hơn 270 cửa hàng YODY trên toàn quốc.",
                "is_featured" => 1,
                "views" => 0,
                "avatar" => "https://m.yodycdn.com/fit-in/filters:format(webp)/products/media/articles/yody-sale-cuoi-mua.png",
                "content" => "Nội dung",
                "menu_id" => \Illuminate\Support\Facades\DB::table("bl_menus")->inRandomOrder()->first()->id,
                "created_at" => Carbon\Carbon::now()
            ],
            [
                "name" => "MUA CÀNG NHIỀU GIẢM CÀNG SÂU - LÊN ĐẾN 15%",
                "slug" => "mua-nhieu-giam-nhieu",
                "status" => "pending",
                "description" => "Tri ân 10 năm hoạt động, YODY tung khuyến mãi cực kỳ lớn. Khách hàng mua càng nhiều sẽ được giảm giá giảm càng sâu, phù hợp với các khách hàng mua chung theo nhóm hoặc mua cho cả gia đình.",
                "is_featured" => 1,
                "views" => 0,
                "avatar" => "https://m.yodycdn.com/fit-in/filters:format(webp)/products/media/articles/1.%20MUA%20C%C3%80NG%20NHI%E1%BB%80U%20-%20GI%E1%BA%A2M%20C%C3%80NG%20S%C3%82U.jpg",
                "content" => "Nội dung",
                "menu_id" => \Illuminate\Support\Facades\DB::table("bl_menus")->inRandomOrder()->first()->id,
                "created_at" => Carbon\Carbon::now()
            ],
            [
                "name" => "ĐỘC QUYỀN WEBSITE - VOUCHER 100K CHO KHÁCH HÀNG ĐĂNG KÍ EMAIL",
                "slug" => "voucher-100k-cho-khach-hang-dang-ki-email",
                "status" => "pending",
                "description" => "hời gian nhận và sử dụng mã khuyến mãi kéo dài từ ngày 01/10/2024 đến ngày 31/10/2024. Sau khi nhận mã, khách hàng sẽ sử dụng trực tiếp để mua hàng trên Website (không áp dụng tại cửa hàng).",
                "is_featured" => 1,
                "views" => 0,
                "avatar" => "https://m.yodycdn.com/fit-in/filters:format(webp)/products/media/articles/4.%20%C4%90%C4%82NG%20K%C3%8D%20TH%C3%94NG%20TIN.jpg",
                "content" => "Nội dung",
                "menu_id" => \Illuminate\Support\Facades\DB::table("bl_menus")->inRandomOrder()->first()->id,
                "created_at" => Carbon\Carbon::now()
            ],
        ];

        foreach ($articles as $item) {
            \Illuminate\Support\Facades\DB::table("bl_articles")->insert($item);
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
