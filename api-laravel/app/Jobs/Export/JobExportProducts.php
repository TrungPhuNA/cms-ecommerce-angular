<?php

namespace App\Jobs\Export;

use App\Exports\ProductsExport;
use App\Mail\Export\SendEmailExportProducts;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Maatwebsite\Excel\Facades\Excel;

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
        $fileName = 'products_export_' . now()->timestamp . '.xlsx';
        // Export dữ liệu
        Excel::store(new ProductsExport($this->columns), $fileName, 'local');

        // Gửi email với file export
        Mail::to($this->email)->send(new SendEmailExportProducts($fileName));
    }
}
