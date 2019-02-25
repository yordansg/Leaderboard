

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Player } from '../model/model';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable()
export class DataService {

    constructor(private http: HttpClient) {

    }

    findPlayers(
        nameFilter = '', countryFilter = '', fromDate = '', toDate = '', columnToSort = '', sortOrder = 'asc',
        pageNumber = 0, pageSize = 10): Observable<Player[]> {

        return this.http.get('/api/players/', {
            params: new HttpParams()
                .set('nameFilter', nameFilter)
                .set('countryFilter', countryFilter)
                .set('fromDate', fromDate)
                .set('toDate', toDate)
                .set('columnToSort', columnToSort)
                .set('sortOrder', sortOrder)
                .set('pageNumber', pageNumber.toString())
                .set('pageSize', pageSize.toString())
        }).pipe(
            map(res => res['payload'])
        );
    }

    getPlayersMetadata(
        countryFilter = '') {
        return this.http.get('/api/players/getDistinctCountries', {
            params: new HttpParams()
                .set('countryFilter', countryFilter)
        }).pipe(
            map(res => res['distinctedCountries']),
            catchError(this.handleError)
        );
    }

    postPlayer(data): Observable<any> {
        return this.http.post('/api/players', data, httpOptions)
            .pipe(
                catchError(res => this.handleError(res))
            );
    }

    private handleError(res: HttpErrorResponse) {
        if (res.status === 200) {
            return throwError('Status response is successfull.');
        }
        if (res.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', res.error.message);
            return throwError('Something bad happened; please try again later.');
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.log(
                `Backend returned code ${res.status}`);
        }
        // return an observable with an error message
        return throwError('Something bad happened; please try again later.');
    }

}
