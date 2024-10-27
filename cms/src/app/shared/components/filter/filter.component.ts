import { Component, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

interface I_KEY_SEARCH {
	value: string,
	name: string,
	type?: any,
	dataSelect?: any
}

@Component({
	selector: 'app-filter',
	templateUrl: './filter.component.html',
	styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {


	@Input() keys: I_KEY_SEARCH[] = [];
	@Input() show = false;


	@Output()

	searchForm: FormGroup;


	constructor(
		private fb: FormBuilder,
	) { }

	ngOnInit(): void {
	}

	search() {

	}

	addConditionFilter() {

	}

	reset() {
		
	}

}
