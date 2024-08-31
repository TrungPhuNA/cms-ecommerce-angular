import {Component, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-base',
  template: '',
})
export class BaseComponent implements OnDestroy {
  public readonly destroy$ = new Subject<void>();

  constructor() {
  }

  ngOnDestroy() {
    this.destroySubs();
  }

  protected destroySubs() {
    this.destroy$.next();
  }

}
