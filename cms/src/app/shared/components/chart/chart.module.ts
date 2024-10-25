import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartCircleComponent } from './chart-circle/chart-circle.component';
import { ChartLineComponent } from './chart-line/chart-line.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ChartAreaComponent } from './chart-area/chart-area.component';



@NgModule({
	declarations: [
		ChartCircleComponent,
		ChartLineComponent,
  ChartAreaComponent
	],
	imports: [
		CommonModule,
		NgApexchartsModule
	],
	exports: [
		ChartCircleComponent,
		ChartLineComponent,
		ChartAreaComponent
	]
})
export class ChartModule { }
