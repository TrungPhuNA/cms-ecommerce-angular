import { Component, Input, OnInit } from '@angular/core';
import { getCSSVariableValue } from 'src/app/_metronic/kt/_utils';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { ThousandsSeparatorPipe } from 'src/app/shared/pipes/thousands-separator.pipe';

@Component({
	selector: 'app-chart-area',
	templateUrl: './chart-area.component.html',
	styleUrls: ['./chart-area.component.scss']
})
export class ChartAreaComponent implements OnInit {

	@Input() data: any;
	chartOptions: any = {};

	constructor(
	) { }

	ngOnInit(): void {

	}
	ngOnChanges(): void {
		//Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
		//Add '${implements OnChanges}' to the class.
		if (this.data) {
			console.log(this.data);
			this.chartOptions = this.getChartOptions(350, this.data);
			console.log(this.chartOptions);
		}
	}

	getChartOptions(height: number, data: any) {
		const labelColor = getCSSVariableValue('--kt-gray-500');
		const borderColor = "#e04f16";
		const baseColor = "#e04f16";
		const lightColor = "#E04F16";

		return {
			series: data?.series,
			chart: {
				fontFamily: 'Be Vietnam Pro',
				type: 'area',
				height: height,
				toolbar: {
					show: false,
				},
			},
			title: data?.title,
			plotOptions: {},
			legend: {
				show: false,
			},
			dataLabels: {
				enabled: false,
			},
			fill: {
				type: 'gradient',
				gradient: {
					hadeIntensity: 1,
					type: 'vertical',
					gradientToColors: ['#FEF6EE'], // End color (transparent)
					opacityFrom: 0.3,
					opacityTo: 0,
					stops: [0, 100],
					colorStops: [
						{
							offset: 0,
							color: '#e04f16', // Start color
							opacity: 0.3
						},
						{
							offset: 100,
							color: '#FEF6EE', // End color (transparent)
							opacity: 0
						}
					]
				}
			},
			stroke: {
				curve: 'smooth',
				show: true,
				width: 3,
				colors: [baseColor],
			},
			xaxis: {
				categories: data?.categories || [],
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
						color: baseColor,
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
					formatter: function (val: number) {
						if (val === null || val === undefined) {
							return '0 đ';
						}
						return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + " đ";
					},
				},
				
				// min: 10, // Starting value (x)
				// max: 148 
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
					formatter: function (val: number) {
						if (val === null || val === undefined) {
							return '0 đ';
						}
						return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + " đ";
					},
				},
			},
			colors: [lightColor],
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
				strokeColors: baseColor,
				strokeWidth: 3,
			},
		};
	}
}
