<?php

namespace Modules\User\App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Modules\Common\Query\UserBankAccountQueryService;
use Modules\Common\Service\ErrorLogService;
use Modules\Common\Service\ResponseService;
use Modules\User\App\Http\Requests\Api\RequestApiCreateUserBankAccount;

class ApiUserBankAccountController extends Controller
{
    /**
     * UserBankAccount
     * @param  Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        try {
            $paginator = UserBankAccountQueryService::getAll($request);
            $userBankAccounts = $paginator->getCollection();

            $meta = [
                "total"        => $paginator->total(),
                "per_page"     => (int) $paginator->perPage(),
                "current_page" => $paginator->currentPage(),
                "last_page"    => $paginator->lastPage()
            ];

            $data = [
                'meta'               => $meta,
                'user_bank_accounts' => $userBankAccounts
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }

    /**
     * CreateUserBankAccount
     * @param  RequestApiCreateUserBankAccount  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(RequestApiCreateUserBankAccount $request)
    {
        try {
            $request->merge(['user_id' => auth()->user()->id]);
            $userBankAccount = UserBankAccountQueryService::create($request);
            $data = [
                'user_bank_account' => $userBankAccount
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }

    /**
     * ShowUserBankAccount
     */
    public function show(Request $request, $id)
    {
        try {
            $userBankAccount = UserBankAccountQueryService::findById($request, $id);
            $data = [
                'user_bank_account' => $userBankAccount
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }

    /**
     * UpdateUserBankAccount
     */
    public function update(RequestApiCreateUserBankAccount $request, $id)
    {
        try {
            UserBankAccountQueryService::update($request, $id);
            $data = [
                'user_bank_account' => UserBankAccountQueryService::findById($request, $id)
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        //
    }
}
