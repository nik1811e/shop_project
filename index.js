const express = require('express');
const Sequelize = require('sequelize');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const Promise = require("bluebird");
const bcrypt = require('bcryptjs');

const config = require('./config');
const errors = require('./utils/errors');
const logger = require('./utils/logger');

const db = require('./context/db')(Sequelize, config);

const authService = require('./services/auth')(db.auth, db.orders, errors);
const menuService = require('./services/menu')(db.items, db.auth, db.orders, errors);
const orderService = require('./services/orders')(db.orders, db.items, db.auth, errors);


const apiController = require('./controllers/api')(authService, menuService, orderService);

const auth = require('./utils/auth')(authService, config, errors);

const app = express();

app.use(express.static('public'));
app.use(cookieParser(config.cookie.key));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/api', logger);
app.use('/api', auth);
app.use('/api', apiController);

console.log("http://localhost:3000");

db.sequelize
    .sync()
    .then(() => {
        app.listen(process.env.PORT || 3000, () => {
            console.log('--- Success ---\n');
        });
    })
    .catch((err) => console.log(err));