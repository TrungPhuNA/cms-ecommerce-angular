<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ResetDatabaseCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:drop {--force : Force the operation to run when in production}';


    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Drop all tables in the database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        if (app()->isProduction() && !$this->option('force')) {
            $this->warn('You are in production mode. Use --force to run this command.');
            return;
        }

        $this->info('Dropping all tables...');

        // Disable foreign key checks to avoid constraint issues
        Schema::disableForeignKeyConstraints();

        $tables = DB::connection()->getDoctrineSchemaManager()->listTableNames();

        foreach ($tables as $table) {
            Schema::drop($table);
        }

        // Re-enable foreign key checks
        Schema::enableForeignKeyConstraints();

        $this->info('All tables dropped successfully.');

        // Run the migrations
        $this->call('migrate');

        // Seed the database
        $this->call('db:seed');
        $this->info('Database reset successfully.');
    }
}
