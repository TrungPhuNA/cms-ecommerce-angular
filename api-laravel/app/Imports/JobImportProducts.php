<?php

namespace App\Imports;

use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Facades\Storage;
use Modules\Admin\App\Models\Product;

class JobImportProducts implements ToModel, WithChunkReading, WithHeadingRow
{
    public function model(array $row)
    {
        $imagePath = null;
        // Tải ảnh về từ link
        if (isset($row['avatar'])) {
            $imagePath = $this->downloadImage($row['avatar']);
        }

        // Tạo sản phẩm từ dữ liệu của từng dòng
        return new Product([
            'name'        => $row['name'],
            'slug'        => Str::slug($row['name']),
            'price'       => $row['price'],
            'category_id' => $row['category'] ?? 1,
            'avatar'      => $imagePath,
        ]);
    }

    // Xử lý ảnh
    private function downloadImage($url)
    {
        $contents = file_get_contents($url);
        $name = basename($url);
        $path = 'uploads/images/'.$name;
        Storage::put($path, $contents);

        return $path;
    }

    // Chunk 1000 records mỗi lần
    public function chunkSize(): int
    {
        return 1000;
    }
}
