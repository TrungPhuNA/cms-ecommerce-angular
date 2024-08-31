export const BRIEF_CONFIG = {
    BUSINESS_TYPE: [
        {
			name: "Làm đẹp",
			value: "BEAUTY"
		},
		{
			name: "Công nghệ ô tô",
			value: "CAR_TECH"
		},
		{
			name: "Chăm sóc ô tô",
			value: "CAR_CARE"
		},
		{
			name: "Tài chính ngân hàng",
			value: "FINANCE"
		},
		{
			name: "Chứng khoán",
			value: "GAMING"
		}
    ],
    MEMBER_RANGE: [
        {
			value: 1,
			name: 'Dưới 50 nhân sự'
		},
		{
			value: 2,
			name: '50 - Dưới 100 nhân sự'
		},
		{
			value: 3,
			name: '100 - Dưới 200 nhân sự'
		},
		{
			value: 4,
			name: '200 - Dưới 500 nhân sự'
		},
		{
			value: 5,
			name: '500 - Dưới 1000 nhân sự'
		},
		{
			value: 6,
			name: 'Trên 1000 nhân sự'
		},
    ],
    RANK_BUDGET: [
        { value: 1, name: 'Dưới 50 triệu' },
        { value: 2, name: '50 - dưới 100 triệu' },
        { value: 3, name: '100 - dưới 500 triệu' },
        { value: 4, name: '500 - dưới 1 tỷ' },
        { value: 5, name: 'Trên 1 tỷ' },
    ],
    QUANTITY_SALE: [
        { value: 1, name: '<200 đơn/tháng' },
        { value: 2, name: '200 - 1000 đơn/tháng' },
        { value: 3, name: '1000 - 5000 đơn/tháng' },
        { value: 4, name: '>5000 đơn/tháng' },
        
    ],
    FOCUS_AREA: [
        {
			value: 1,
			name: " Việt Nam - miền Bắc"
		},
		{
			value: 2,
			name: "Việt Nam - miền Trung"
		},
		{
			value: 3,
			name: "Việt Nam - miền Name"
		},
		{
			value: 4,
			name: "Đông Nam Á"
		},
		{
			value: 5,
			name: "Đông Á"
		},
		{
			value: 6,
			name: "Nam Á"
		},
		{
			value: 7,
			name: "Trung Á"
		},
		{
			value: 8,
			name: "Tây Á - Trung Đông"
		},
		{
			value: 9,
			name: "Bắc Âu"
		},
		{
			value: 10,
			name: "Tây Âu"
		},
		{
			value: 11,
			name: "Đông Âu"
		},
		{
			value: 12,
			name: "Nam Âu"
		},
		{
			value: 13,
			name: "Bắc Mỹ"
		},
		{
			value: 14,
			name: "Trung Mỹ và Caribe"
		},
		{
			value: 15,
			name: "Nam Mỹ"
		},
		{
			value: 16,
			name: "Bắc Phi"
		},
		{
			value: 17,
			name: "Tây phi"
		},
		{
			value: 18,
			name: "Đông Phi"
		},
		{
			value: 19,
			name: "Trung Phi"
		},
		{
			value: 20,
			name: "Nam Phi"
		},
		{
			value: 21,
			name: "Châu Đại Dương"
		}
    ],
    SERVICE_TYPE: [
        {
            name: "Growth Traffic",
            value: "GT",
			vn_name: "Tăng trưởng traffic đầu vào"
        },
		{
            name: "Growth Acquisition",
            value: "GA",
			vn_name: "Tăng trưởng người dùng mới"
        },
        {
            name: "Growth Sale",
            value: "GS",
			vn_name: "Tăng trưởng đơn hàng"
        },
        {
            name: "Growth Loyalty Customer",
            value: "GLC",
			vn_name: "Tăng tỷ lệ khách hàng trung thành/quay lại"
        },
        {
            name: "Growth Universal",
            value: "GU",
			vn_name: "Tư vấn chiến lược tổng thể & toàn diện"
        }
    ],
    VIRAL_INFO: [
        {
            type: 1,
            name: 'Website'
        },
        {
            type: 2,
            name: 'Sàn trong nước'
        },
        {
            type: 3,
            name: 'Sàn nước ngoài'
        },
        {
            type: 4,
            name: 'Khác'
        }
    ],
	SERVICE_PRODUCTS: [
		//GT
		{
			value: 1,
			name: "Ambassador Community",
			service_type: "GT" 
		},
		{
			value: 2,
			name: "KOC Platform",
			service_type: "GT" 
		},
		{
			value: 3,
			name: "Full Digital Channel",
			service_type: "GT" 
		},
		//GA
		{
			value: 4,
			name: "Qualified Lead Generation",
			service_type: "GA" 
		},
		{
			value: 5,
			name: "Qualified Mobile User",
			service_type: "GA" 
		},
		{
			value: 6,
			name: "Fraud & Quality Control",
			service_type: "GA" 
		},

		// GS
		{
			value: 7,
			name: "Ecom Affiliate Partner (EAP)",
			service_type: "GS" 
		},
		
		{
			value: 8,
			name: "Dimuadi/D2C",
			service_type: "GS" 
		},
		{
			value: 9,
			name: "Mega Livestream",
			service_type: "GS" 
		},
		{
			value: 10,
			name: "ACCESSTRADE App",
			service_type: "GS" 
		}
		// GLC

		,
		{
			value: 11,
			name: "Bio Page/Ecom Page",
			service_type: "GLC" 
		},
		{
			value: 12,
			name: "MGM Solution",
			service_type: "GLC" 
		},
		{
			value: 13,
			name: "Voucher Platform",
			service_type: "GLC" 
		},
		{
			value: 14,
			name: "Partnership Platform",
			service_type: "GLC" 
		},

		// GU

		{
			value: 15,
			name: "Growth Solution Design",
			service_type: "GU" 
		},
		{
			value: 16,
			name: "ScaleF",
			service_type: "GU" 
		},
		{
			value: 17,
			name: "ACCESSTRADE Academy",
			service_type: "GU" 
		},
		
	]
}

export const CRM_CONFIG_DEFAULT = {
	status: [], // status_brief
	priority: [],
	sla: [],
	level: [],
	careers: [],
	service_type: BRIEF_CONFIG.SERVICE_TYPE,

	/**ADV config */
	business_type: [],
	member_range: [],
};
