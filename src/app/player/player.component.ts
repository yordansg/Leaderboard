import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { DataService } from '../services/data.service';
import { debounceTime, distinctUntilChanged, startWith, tap, delay } from 'rxjs/operators';
import { merge } from 'rxjs/observable/merge';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { PlayersDataSource } from '../services/players.datasource';
import { Observable } from 'rxjs/Observable';
import { DatePipe } from '@angular/common';
import { Range } from 'ngx-mat-daterange-picker';


@Component({
    selector: 'player',
    templateUrl: './player.component.html',
    styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit, AfterViewInit {

    dataSource: PlayersDataSource;

    displayedColumns = ['name', 'country', 'registration_date', 'score', 'level'];
    header2Columns = ['name2', 'country2', 'registration_date2', 'score2', 'level2'];

    distinctCountries: Observable<string>;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    @ViewChild(MatSort) sort: MatSort;

    @ViewChild('input') input: ElementRef;

    selectedDateRange: Range = { fromDate: new Date(), toDate: new Date() };

    selectedCountry = '';

    constructor(private dataService: DataService, private datePipe: DatePipe, ) {
    }

    ngOnInit() {
        this.dataSource = new PlayersDataSource(this.dataService);

        this.dataService.getPlayersMetadata('').
            toPromise().then(countries => this.distinctCountries = countries);

        this.dataSource.loadPlayers(
            '',                         // filter, filteredColumns, fromDate, toDate, column to sort, sortingDirection, pageIndex, pageSize
            '',
            this.datePipe.transform(this.selectedDateRange.fromDate, 'yyyy-MM-dd'),
            this.datePipe.transform(this.selectedDateRange.toDate, 'yyyy-MM-dd'),
            '',
            'desc',
            0,
            10
        );
    }

    getPlayersData() {
        this.dataSource.loadPlayers(
            this.input.nativeElement.value,
            this.selectedCountry,
            this.datePipe.transform(this.selectedDateRange.fromDate, 'yyyy-MM-dd'),
            this.datePipe.transform(this.selectedDateRange.toDate, 'yyyy-MM-dd'),
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex,
            this.paginator.pageSize);
    }

    ngAfterViewInit() {
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

        fromEvent(this.input.nativeElement, 'keyup')
            .pipe(
                debounceTime(150),
                distinctUntilChanged(),
                tap(() => {
                    this.paginator.pageIndex = 0;
                    this.loadPlayersPage();
                })
            )
            .subscribe();

        merge(this.sort.sortChange, this.paginator.page)
            .pipe(
                tap(() => this.loadPlayersPage())
            )
            .subscribe();
    }

    loadPlayersPage() {
        this.getPlayersData();
    }

    selectedCountryFilter(country: string) {
        this.selectedCountry = country;
        this.paginator.pageIndex = 0;
        this.getPlayersData();
    }

    OnNewDateRangeSubmitted(dateRange: Range) {
        this.selectedDateRange = dateRange;
        this.paginator.pageIndex = 0;
        if (typeof (this.input) === 'undefined') {
            // TODO
        } else {
            this.getPlayersData();
        }
    }

}
