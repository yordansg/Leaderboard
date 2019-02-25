import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NgxDrpOptions, PresetItem, Range } from 'ngx-mat-daterange-picker';

@Component({
  selector: 'date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.scss']
})
export class DateRangeComponent implements OnInit {

  @Output() onSubmitEmitter: EventEmitter<Range> = new EventEmitter();

  range: Range = { fromDate: new Date(), toDate: new Date() };
  options: NgxDrpOptions;
  presets: Array<PresetItem> = [];

  ngOnInit() {
    const today = new Date();

    this.setupPresets();
    this.options = {
      presets: this.presets,
      format: 'yyyy-MM-dd',
      range: { fromDate: today, toDate: today },
      applyLabel: 'Submit',
    };
  }

  // handler function that receives the updated date range object
  updateRange(range: Range) {
    this.onSubmitEmitter.emit(range);
  }

  // helper function to create initial presets
  setupPresets() {
    const backDate = (numOfDays) => {
      const today = new Date();
      return new Date(today.setDate(today.getDate() - numOfDays));
    };

    const today = new Date();
    const yesterday = backDate(1);
    const minus7 = backDate(7);
    const minus30 = backDate(30);
    const currMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const currMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

    this.presets = [
      { presetLabel: 'Yesterday', range: { fromDate: yesterday, toDate: today } },
      { presetLabel: 'Last 7 Days', range: { fromDate: minus7, toDate: today } },
      { presetLabel: 'Last 30 Days', range: { fromDate: minus30, toDate: today } },
      { presetLabel: 'This Month', range: { fromDate: currMonthStart, toDate: currMonthEnd } },
      { presetLabel: 'Last Month', range: { fromDate: lastMonthStart, toDate: lastMonthEnd } }
    ];
  }

}
