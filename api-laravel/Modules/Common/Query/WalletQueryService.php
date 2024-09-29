<?php
/**
 * Created By PhpStorm
 * Code By : trungphuna
 * Date: 7/19/24
 */

namespace Modules\Common\Query;

use App\Models\Wallet;
use Illuminate\Http\Request;
use Modules\Common\Base\ModelService;

class WalletQueryService extends ModelService
{
    public static function getAll(Request $request, $items = null)
    {
        $items = Wallet::with('user');
        return parent::getAll($request, $items);
    }

    public static function addWallet($user, $amount)
    {
        $wallet = $user->wallet;
        if (empty($wallet)) $wallet = WalletQueryService::createWalletUser($user, 0);

        $wallet->balance += $amount;
        $wallet->save();
        return $wallet;
    }

    public static function withdrawMoney($user, $amount)
    {
        $wallet = $user->wallet;
        if (empty($wallet)) $wallet = WalletQueryService::createWalletUser($user, 0);

        $wallet->balance -= $amount;
        $wallet->save();
        return $wallet;
    }

    public static function createWalletUser($user, $amount)
    {
        return Wallet::create([
            'user_id' => $user->id,
            'balance' => $amount,
        ]);
    }
}