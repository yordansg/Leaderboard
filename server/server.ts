

import * as express from 'express';
import { Application } from 'express';
import { searchPlayers, searchDistinctCountries } from './search-players.route';
import { PLAYERS } from './data';

const app: Application = express();

const { check, validationResult } = require('express-validator/check');
const bodyParser = require('body-parser');
const httpServer = app.listen(9000, () => {
    console.log('HTTP REST API Server running at http://localhost:' + httpServer.address().port);
});


app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(express.json());

app.route('/api/players').get(searchPlayers);
app.route('/api/players/getDistinctCountries').get(searchDistinctCountries);

app.route('/api/players').post([
    check('name').isAlphanumeric().isLength({ max: 80 }).withMessage('Must be alphanumeric and max 80 chars!'),
    check('country').isAlphanumeric().isLength({ max: 50 }).withMessage('Must be alphanumeric and max 80 chars!'),
    check('registration_date').isISO8601().withMessage('Must be in YYYY-MM-DD format!'),
    check('score').isInt({ min: 0, max: 100 }).withMessage('Must be a non-negative integer!'),
], (req, res) => {
    const player = req.body;

    const name = player.name;
    const country = player.country;
    const registration_date = player.registration_date;
    const score = player.score;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    } else {
        PLAYERS.push({
            name: name || 'Default title',
            country: country || 'Default description',
            registration_date: registration_date,
            score: score || 'not completed'
        });
        res.send(200);
    }
});




