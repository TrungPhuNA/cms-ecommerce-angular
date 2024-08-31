import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InlineSVGModule} from 'ng-inline-svg-2';
import {RouterModule, Routes} from '@angular/router';
import {
  NgbDropdownModule,
  NgbProgressbarModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule} from '@ngx-translate/core';
import {LayoutComponent} from './layout.component';
import {HeaderComponent} from './components/header/header.component';
import {ContentComponent} from './components/content/content.component';
import {FooterComponent} from './components/footer/footer.component';
import {TopbarComponent} from './components/topbar/topbar.component';
import {PageTitleComponent} from './components/header/page-title/page-title.component';
import {HeaderMenuComponent} from './components/header/header-menu/header-menu.component';
import {DropdownMenusModule, ExtrasModule, ModalsModule,} from '../partials';
import {ThemeModeModule} from '../partials/layout/theme-mode-switcher/theme-mode.module';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {SidebarLogoComponent} from './components/sidebar/sidebar-logo/sidebar-logo.component';
import {SidebarMenuComponent} from './components/sidebar/sidebar-menu/sidebar-menu.component';
import {NavbarComponent} from './components/header/navbar/navbar.component';
import {Routing} from "../../routing";

import {LayoutScrollTopComponent} from "../partials/layout/extras/scroll-top/scroll-top.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BaseSearchFormComponent} from "./components/header/base-search-form/base-search-form.component";
import {AdvanceDatePickerModule, MonthPickerModule, SpinnerModule} from "../../shared/components";
import {NgSelectModule} from "@ng-select/ng-select";
import {NgxDaterangepickerMd} from "ngx-daterangepicker-material";

const ExtraComponents = [
  LayoutScrollTopComponent,
];
const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: Routing,
  },
];

@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    ContentComponent,
    FooterComponent,
    TopbarComponent,
    PageTitleComponent,
    HeaderMenuComponent,
    SidebarComponent,
    SidebarLogoComponent,
    SidebarMenuComponent,
    NavbarComponent,
    BaseSearchFormComponent,
    ...ExtraComponents,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    InlineSVGModule,
    NgbDropdownModule,
    NgbProgressbarModule,
    ExtrasModule,
    ModalsModule,
    DropdownMenusModule,
    NgbTooltipModule,
    TranslateModule,
    ThemeModeModule,
    FormsModule,
    RouterModule,
    MonthPickerModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgxDaterangepickerMd,
    AdvanceDatePickerModule,
    SpinnerModule,
  ],
    exports: [RouterModule],
})
export class LayoutModule {
}
