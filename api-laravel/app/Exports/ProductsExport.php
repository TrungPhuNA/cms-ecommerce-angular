<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Modules\Admin\App\Models\Product;

class ProductsExport implements FromQuery, WithHeadings
{
    protected $columns;

    public function __construct($columns)
    {
        $this->columns = $columns;
    }

    public function query()
    {
        return Product::select($this->columns);
    }

    public function headings(): array
    {
        return $this->columns;
    }
}
