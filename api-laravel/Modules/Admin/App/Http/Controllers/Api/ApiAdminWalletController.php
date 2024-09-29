<?php

namespace Modules\Admin\App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Modules\Admin\App\Http\Requests\Api\RequestApiStoreWalletAdmin;
use Modules\Common\Query\UserQueryService;
use Modules\Common\Query\WalletQueryService;
use Modules\Common\Query\WalletTransactionQueryService;
use Modules\Common\Service\ErrorLogService;
use Modules\Common\Service\ResponseService;

class ApiAdminWalletController extends Controller
{
    /**
     * AdmGetListWallet
     */
    public function index(Request $request)
    {
        try {
            $paginator = WalletQueryService::getAll($request);
            $wallets = $paginator->getCollection();

            $meta = [
                "total"        => $paginator->total(),
                "per_page"     => (int) $paginator->perPage(),
                "current_page" => $paginator->currentPage(),
                "last_page"    => $paginator->lastPage()
            ];

            $data = [
                'wallets' => $wallets,
                'meta'    => $meta
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }

    /**
     * AdmAddWallet
     */
    public function store(RequestApiStoreWalletAdmin $request)
    {
        try {
            $user = UserQueryService::findById($request->user_id);
            if (!$user) {
                return ResponseService::sendError("User not found");
            }
            DB::beginTransaction();
            $amount = $request->amount;
            $wallet = WalletQueryService::addWallet($user, $amount);
            WalletTransactionQueryService::store($wallet, $amount);
            DB::commit();
            $data = [
                'wallet' => $wallet,
                'user'   => $user
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            DB::rollBack();
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }

    /**
     * AdmWithDrawWallet
     */
    public function withdrawMoney(RequestApiStoreWalletAdmin $request)
    {
        try {
            $user = UserQueryService::findById($request->user_id);
            if (!$user) {
                return ResponseService::sendError("User not found");
            }
            if (!$user->wallet) {
                return ResponseService::sendError("User wallet not found");
            }
            DB::beginTransaction();
            $amount = $request->amount;
            if ($amount > $user->wallet->balance) {
                return ResponseService::sendError("Insufficient balance");
            }
            $wallet = WalletQueryService::withdrawMoney($user, $amount);
            WalletTransactionQueryService::store($wallet, $amount, "Money withdrawn", "debit");
            DB::commit();
            $data = [
                'wallet' => $wallet,
                'user'   => $user
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            DB::rollBack();
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }

    public function history(Request $request)
    {
        try {
            $paginator = WalletTransactionQueryService::getAll($request);
            $transactions = $paginator->getCollection();

            $meta = [
                "total"        => $paginator->total(),
                "per_page"     => (int) $paginator->perPage(),
                "current_page" => $paginator->currentPage(),
                "last_page"    => $paginator->lastPage()
            ];

            $data = [
                'transactions' => $transactions,
                'meta'         => $meta
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }
}
