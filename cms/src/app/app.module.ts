import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ErrorInterceptor, TokenInterceptor } from "./auth/_helpers";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ServiceModule } from "./services/service.module";
import { SharedModule } from "./shared";
import { RouterModule } from '@angular/router';
import { Routing } from './routing'
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from "ngx-spinner";
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { CurrencyPipe } from "@angular/common";



@NgModule({
	declarations: [AppComponent, ],
	imports: [
		FormsModule,
		BrowserModule,
		BrowserAnimationsModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [HttpClient]
			}
		}),
		HttpClientModule,
		CurrencyPipe,
		ReactiveFormsModule,
		AppRoutingModule,
		InlineSVGModule.forRoot(),
		SweetAlert2Module.forRoot(),
		RouterModule.forRoot(Routing),
		NgxDaterangepickerMd.forRoot(),
		ServiceModule,
		SharedModule,
		NgbModule,
		NgxSpinnerModule.forRoot({ type: 'ball-spin-clockwise' }),
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	providers: [
		{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
		{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

		ErrorInterceptor,
	],
	bootstrap: [AppComponent],
})
export class AppModule {
}

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
	return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
