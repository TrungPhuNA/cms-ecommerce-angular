<?php

namespace App\Jobs\Export;

use App\Mail\Export\SendEmailExportProducts;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Modules\Admin\App\Models\Product;

class JobExportProducts implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $columns;
    protected $email;

    /**
     * Create a new job instance.
     */
    public function __construct($columns, $email)
    {
        $this->columns = $columns;
        $this->email = $email;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Lấy dữ liệu từ bảng products với các cột đã được chọn
        $products = Product::select($this->columns)->get();

        // Tạo đường dẫn lưu file CSV
        $fileName = 'exports/products_' . now()->timestamp . '.xlsx';
        $filePath = storage_path('app/' . $fileName);

        // Kiểm tra và tạo thư mục nếu chưa tồn tại
        if (!\File::exists(storage_path('app/exports'))) {
            \File::makeDirectory(storage_path('app/exports'), 0755, true);
        }

        // Tạo file CSV
        $csvFile = fopen($filePath, 'w');

        // Viết header
        fputcsv($csvFile, $this->columns);

        // Viết dữ liệu sản phẩm
        foreach ($products as $product) {
            fputcsv($csvFile, $product->toArray());
        }

        fclose($csvFile);

        // Gửi email với file export
        Mail::to($this->email)->send(new SendEmailExportProducts($fileName));
    }
}
