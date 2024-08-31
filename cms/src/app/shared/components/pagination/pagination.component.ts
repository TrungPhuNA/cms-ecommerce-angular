import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { IPaging } from '../../models';
import { config } from '../../constants';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnChanges{
	

	@Input() paging: any = {
		page: 1,
		page_size: 20,
		total: 0
	};

	@Output() changePaged = new EventEmitter();

	defaultClass = config.paginationClass;

	ngOnChanges(changes: SimpleChanges): void {
	}

	changed(e: any) {
		this.changePaged.emit(e);
	}
}
