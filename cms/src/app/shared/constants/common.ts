export const STATUS_ERROR_API = ['fail_validator', 'fail', 'fail_validate', 'fail_validation'];

export const ERROR_IMG = './assets/media/common/error-image.png';
export const DEFAULT_IMG = './assets/media/common/non-img.jpeg';
export const AVATAR_DEFAULT = './assets/media/auth/tim_80x80.png';

export const STATUS_PRODUCTS = [
	{
		value: 'pending',
		name: 'Pending',
		class: 'badge badge-light-warning'
	},
	{
		value: 'draft',
		name: 'Draft',
		class: 'badge badge-light-danger'
	},
	{
		value: 'published',
		name: 'Published',
		class: 'badge badge-light-success'
	}
];

export const PAYMENT_STATUSES = [
	{ value: 'pending', className: "warning", name: 'Pending' },
	{ value: 'completed', className: "success", name: 'Completed' },
	{ value: 'refunding', className: "info", name: 'Refunding' },
	{ value: 'refunded', className: "primary", name: 'Refunded' },
	{ value: 'fraud', className: "secondary", name: 'Fraud' },
	{ value: 'failed', className: "danger", name: 'Failed' }
];

export const ORDER_STATUSES = [
	{ value: 'pending', className: "warning", name: 'Pending' },
	{ value: 'processing', className: "primary", name: 'Processing' },
	{ value: 'completed', className: "success", name: 'Completed' },
	{ value: 'canceled', className: "danger", name: 'Canceled' },
	{ value: 'returned', className: "info", name: 'Returned' }
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