import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
	ChartComponent,
	ApexAxisChartSeries,
	ApexChart,
	ApexXAxis,
	ApexDataLabels,
	ApexTitleSubtitle,
	ApexStroke,
	ApexGrid
} from "ng-apexcharts";
import { getCSSVariableValue } from 'src/app/_metronic/kt/_utils';
import { HelperService } from 'src/app/services';
export type ChartOptions = {
	series: ApexAxisChartSeries;
	chart: ApexChart;
	xaxis: ApexXAxis;
	dataLabels: ApexDataLabels;
	grid: ApexGrid;
	stroke: ApexStroke;
	title: ApexTitleSubtitle;
};
@Component({
	selector: 'app-chart-line',
	templateUrl: './chart-line.component.html',
	styleUrls: ['./chart-line.component.scss']
})
export class ChartLineComponent implements OnInit {

	@Input() data: any
	@Input() color: any = {
		baseColor: getCSSVariableValue('--kt-info'),
		lightColor: getCSSVariableValue('--kt-info-light')
	};
	chartOptions: any = {};

	constructor(
		private helperService: HelperService
	) { }

	ngOnInit(): void {
	}

	ngOnChanges(): void {
		//Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
		//Add '${implements OnChanges}' to the class.
		console.log(this.color);
		this.chartOptions = this.getChartOptions(this.data, this.color, 350);
		
		
	}

	getChartOptions(data: any, color: any, height: number) {
		const labelColor = getCSSVariableValue('--kt-gray-500');
		const borderColor = getCSSVariableValue('--kt-gray-200');
		let value = data?.map((item: any) => Number(item.value || 0));
		let key = data?.map((item: any) => item.date);
		return {
			series: [
				{
					name: 'Doanh số',
					data: value,
				},
			],
			chart: {
				fontFamily: 'inherit',
				type: 'line',
				height: 350,
				toolbar: {
					show: false,
				},
			},
			plotOptions: {},
			legend: {
				show: false,
			},
			dataLabels: {
				enabled: false,
			},
			fill: {
				type: 'solid',
				opacity: 1,
			},
			stroke: {
				curve: 'smooth',
				show: true,
				width: 3,
				colors: [color.baseColor],
			},
			xaxis: {
				categories: key,
				axisBorder: {
					show: false,
				},
				axisTicks: {
					show: false,
				},
				labels: {
					style: {
						colors: labelColor,
						fontSize: '12px',
					},
				},
				crosshairs: {
					position: 'front',
					stroke: {
						color: color.baseColor,
						width: 1,
						dashArray: 3,
					},
				},
				tooltip: {
					enabled: true,
					formatter: undefined,
					offsetY: 0,
					style: {
						fontSize: '12px',
					},
				},
			},
			yaxis: {
				labels: {
					style: {
						colors: labelColor,
						fontSize: '12px',
					},
				
				},
			},
			states: {
				normal: {
					filter: {
						type: 'none',
						value: 0,
					},
				},
				hover: {
					filter: {
						type: 'none',
						value: 0,
					},
				},
				active: {
					allowMultipleDataPointsSelection: false,
					filter: {
						type: 'none',
						value: 0,
					},
				},
			},
			tooltip: {
				style: {
					fontSize: '12px',
				},
				y: {
					formatter: function (num: number) {
						if (num === null || num === undefined) {
							return '0 đ'
						}
						let value = num.toString()
						if(value?.endsWith('.00')) value = value.slice(0,-3);
						return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' đ';
					},
				},
			},
			colors: [color.lightColor],
			grid: {
				borderColor: borderColor,
				strokeDashArray: 4,
				yaxis: {
					lines: {
						show: true,
					},
				},
			},
			markers: {
				strokeColors: color.baseColor,
				strokeWidth: 3,
			},
		};
	}
}

