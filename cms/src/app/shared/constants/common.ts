export const STATUS_ERROR_API = ['fail_validator', 'fail', 'fail_validate', 'fail_validation'];

export const ERROR_IMG = './assets/media/common/error-image.png';
export const DEFAULT_IMG = './assets/media/common/non-img.jpeg';
export const AVATAR_DEFAULT = './assets/media/auth/tim_80x80.png';

export const STATUS_PRODUCTS = [
	{
		value: -2,
		name: 'Hết hàng',
		class: 'badge badge-light-warning'
	},
	{
		value: -1,
		name: 'Dừng hoạt động',
		class: 'badge badge-light-danger'
	},
	{
		value: 1,
		name: 'Hoạt động',
		class: 'badge badge-light-success'
	}
];

export const PAYMENT_STATUSES = [
	{ value: 'pending', name: 'Pending' },
	{ value: 'completed', name: 'Completed' },
	{ value: 'refunding', name: 'Refunding' },
	{ value: 'refunded', name: 'Refunded' },
	{ value: 'fraud', name: 'Fraud' },
	{ value: 'failed', name: 'Failed' }
];

export const ORDER_STATUSES = [
	{ value: 'pending', name: 'Pending' },
	{ value: 'processing', name: 'Processing' },
	{ value: 'completed', name: 'Completed' },
	{ value: 'canceled', name: 'Canceled' },
	{ value: 'returned', name: 'Returned' }
];

export const STATUS_BY_NUMBER = [

	{
		value: -1,
		name: 'Dừng hoạt động',
		class: 'badge badge-light-danger'
	},
	{
		value: 1,
		name: 'Hoạt động',
		class: 'badge badge-light-success'
	}
];

export const VALIDATOR_MESSAGES = {
	required: 'Trường này không được để trống.',
	pattern: 'Trường này không đúng định dạng.',
}