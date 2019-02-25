
import { Request, Response } from 'express';
import { PLAYERS } from './data';
import { setTimeout } from 'timers';
const moment = require('moment');

export function searchPlayers(req: Request, res: Response) {

    const queryParams = req.query;

    const nameFilter = queryParams.nameFilter || '',
        countryFilter = queryParams.countryFilter || '',
        fromDate = queryParams.fromDate || '',
        toDate = queryParams.toDate || '',
        columnToSort = queryParams.columnToSort || '',
        sortOrder = queryParams.sortOrder,
        pageNumber = Number(queryParams.pageNumber) || 0,
        pageSize = Number(queryParams.pageSize);

    let players = PLAYERS;

    if (nameFilter) {
        players = players.filter(player => player.name.trim().toLowerCase().search(nameFilter.toLowerCase()) >= 0);
    }
    if (countryFilter) {
        players = players.filter(player => player.country.trim().toLowerCase().search(countryFilter.toLowerCase()) >= 0);
    }
    if (!moment(fromDate).isSame(toDate)) {
        players = players.filter(player => moment(player.registration_date).isBetween(fromDate, toDate));
    }

    if (columnToSort === 'name') {
        players.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (columnToSort === 'country') {
        players.sort((a, b) => a.country.localeCompare(b.country));
    }
    if (columnToSort === 'registration_date') {
        players.sort((a, b) => a.registration_date.localeCompare(b.registration_date));
    }
    if (columnToSort === 'score') {
        players.sort((l1, l2) => l1.score - l2.score);
    }
    if (sortOrder === 'desc') {
        players = players.reverse();
    }

    players.forEach(player => {
        if (player.score >= 0 && player.score <= 20) {
            player['level'] = 1;
        } else if (player.score >= 21 && player.score <= 40) {
            player['level'] = 2;
        } else if (player.score >= 41 && player.score <= 60) {
            player['level'] = 3;
        } else if (player.score >= 61 && player.score <= 80) {
            player['level'] = 4;
        } else if (player.score >= 81 && player.score <= 100) {
            player['level'] = 5;
        }
    });

    const initialPos = pageNumber * pageSize;
    const playersPage = players.slice(initialPos, initialPos + pageSize);

    setTimeout(() => {
        res.status(200).json({ payload: playersPage });
    }, 1000);
}

export function searchDistinctCountries(req: Request, res: Response) {

    const queryParams = req.query;

    const countryFilter = queryParams.countryFilter || '';

    let players = PLAYERS.sort((a, b) => a.country.localeCompare(b.country));

    if (countryFilter) {
        players = players.filter(player => player.country.trim().toLowerCase().search(countryFilter.toLowerCase()) >= 0);
    }

    const distinctedCountries = [...new Set(players.map(player => player.country))];

    setTimeout(() => {
        res.status(200).json({ distinctedCountries: distinctedCountries });
    }, 1000);
}


