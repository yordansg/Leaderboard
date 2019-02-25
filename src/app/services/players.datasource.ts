


import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { Player } from '../model/model';
import { DataService } from './data.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';



export class PlayersDataSource implements DataSource<Player> {

    private playersSubject = new BehaviorSubject<Player[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private dataService: DataService) {

    }

    loadPlayers(nameFilter, countryFilter, fromDate, toDate, columnToSort, sortDirection,
        pageIndex, pageSize) {

        this.loadingSubject.next(true);
        const data = this.dataService.findPlayers(nameFilter, countryFilter, fromDate, toDate, columnToSort, sortDirection,
            pageIndex, pageSize).pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            );
        data.subscribe(players => this.playersSubject.next(players));
    }

    connect(collectionViewer: CollectionViewer): Observable<Player[]> {
        console.log('Connecting data source');
        return this.playersSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.playersSubject.complete();
        this.loadingSubject.complete();
    }

}
