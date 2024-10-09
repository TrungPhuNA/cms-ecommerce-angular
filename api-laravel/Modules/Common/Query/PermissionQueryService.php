<?php
/**
 * Created By PhpStorm
 * Code By : trungphuna
 * Date: 9/29/24
 */

namespace Modules\Common\Query;

use Illuminate\Http\Request;
use Modules\Common\Base\ModelService;
use Spatie\Permission\Models\Permission;

class PermissionQueryService extends ModelService
{

//    const GROUP = [
//	{
//		value: 'account_user',
//		vi_name: 'Tài khoản',
//		en_name: 'Account',
//
//	},
//{
//    value: 'category',
//		vi_name: 'Danh mục',
//		en_name: 'Category',
//
//	},
//{
//    value: 'product',
//		vi_name: 'Sản phẩm',
//		en_name: 'Product',
//
//	},
//{
//    value: 'account_permission',
//		vi_name: 'Permission',
//		en_name: 'Permission',
//
//	},
//{
//    value: 'account_role',
//		vi_name: 'Role',
//		en_name: 'Role',
//
//	},
//{
//    value: 'warehouse_stock_in',
//		vi_name: 'Nhập kho',
//		en_name: 'Stock in',
//
//	},
//{
//    value: 'warehouse_stock_out',
//		vi_name: 'Xuất kho',
//		en_name: 'Stock out',
//
//	},
//{
//    value: 'order',
//		vi_name: 'Đơn hàng',
//		en_name: 'Order',
//
//	}
//]
    public static function getAll(Request $request, $items = null)
    {
        $items = Permission::query();
        return parent::getAll($request, $items);
    }

    public static function create(Request $request)
    {
        $dataInput = $request->all();
        return Permission::create($dataInput);
    }

    public static function update(Request $request, $id)
    {
        $dataInput = $request->all();
        return Permission::find($id)->update($dataInput);
    }

    public static function findById(Request $request, $id)
    {
        return Permission::find($id);
    }
}