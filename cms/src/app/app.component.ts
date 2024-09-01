import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ThemeModeService} from './_metronic/partials/layout/theme-mode-switcher/theme-mode.service';
import {NavigationEnd, Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import { AuthService } from "./services/auth.service";

@Component({
  // tslint:disable-next-line:component-selector
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'body[root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private translateService: TranslateService,
    private modeService: ThemeModeService,
    private authService: AuthService,
  ) {
    // register translations
    translateService.setDefaultLang('en');
    translateService.use('en');
  }

  ngOnInit() {
    this.modeService.init();
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
}
