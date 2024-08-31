import {NgModule} from '@angular/core';
import { CurrencyPipe } from './currency.pipe';
import { ThousandsSeparatorPipe } from './thousands-separator.pipe';


@NgModule({
  declarations: [
    CurrencyPipe,
    ThousandsSeparatorPipe,
  ],
  exports: [
    CurrencyPipe,
    ThousandsSeparatorPipe,
  ]
})

export class PipesModule {
}
