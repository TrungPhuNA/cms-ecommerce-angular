<?php

namespace Tests\Browser;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class CrawlerMsTTest extends DuskTestCase
{
    /**
     * A Dusk test example.
     */
    public function testExample(): void
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('https://masothue.com/')
                ->waitFor('#search', 10) // Chờ input xuất hiện
                ->type('#search', '1234567890') // Điền mã số thuế
                ->press('.navbar-search button[type="submit"]') // Nhấn nút tìm kiếm
                ->waitFor('.search-results', 10) // Chờ kết quả xuất hiện
                ->assertSee('Kết quả tìm kiếm'); // Kiểm tra xem kết quả có xuất hiện không
        });
    }
}
