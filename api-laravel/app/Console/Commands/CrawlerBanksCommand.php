<?php

namespace App\Console\Commands;

use App\Models\Bank;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class CrawlerBanksCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:crawler-banks';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info("=========== INIT CRAWLER =========");
        $response = Http::get('https://api.vietqr.io/v2/banks');
        Bank::truncate();
        if ($response->successful()) {
            $banks = $response->json();
            foreach ($banks['data'] as $item) {
                $this->warn("============ NAME: ".$item['name']);
                $this->warn("============ code: ".$item['code']);
                $this->warn("============ shortName: ".$item['shortName']);
                $this->warn("============ logo: ".$item['logo']);
                $this->warn("============ swift_code: ".$item['swift_code']);
                Bank::updateOrCreate([
                    "name"       => $item['name'],
                    "code"       => $item['code'],
                    "logo"       => $item['logo'],
                    "swift_code" => $item['swift_code'],
                    "short_name" => $item['short_name'],
                ], ["code", $item['code']]);
            }
        }
    }
}
