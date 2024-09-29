<?php
/**
 * Created By PhpStorm
 * Code By : trungphuna
 * Date: 7/19/24
 */

namespace Modules\Common\Query;

use App\Models\Wallet;
use App\Models\WalletTransaction;
use Illuminate\Http\Request;
use Modules\Common\Base\ModelService;

class WalletTransactionQueryService extends ModelService
{
    public static function getAll(Request $request, $items = null)
    {
        $items = WalletTransaction::with('user:id,name,email', 'wallet:id,user_id,balance');
        return parent::getAll($request, $items);
    }

    public static function store($wallet, $amount, $description = 'Reward received', $type = 'credit')
    {
        return WalletTransaction::create([
            'wallet_id'   => $wallet->id,
            'type'        => $type,
            'user_id'     => $wallet->user_id,
            'amount'      => $amount,
            'description' => $description
        ]);
    }
}